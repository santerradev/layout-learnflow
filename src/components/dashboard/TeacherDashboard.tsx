import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivitiesCalendar } from './ActivitiesCalendar';
import { MdSchool, MdAssignment, MdPeople } from 'react-icons/md';
import { toast } from 'sonner';

interface DashboardStats {
  totalCourses: number;
  totalActivities: number;
  totalStudents: number;
}

export function TeacherDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalActivities: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar cursos do professor
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('professor_id', user.id);

      if (coursesError) throw coursesError;

      const courseIds = courses?.map(c => c.id) || [];

      let totalActivities = 0;
      let totalStudents = 0;

      if (courseIds.length > 0) {
        // Carregar atividades dos cursos
        const { data: activities, error: actError } = await supabase
          .from('activities')
          .select('id')
          .in('course_id', courseIds);

        if (actError) throw actError;
        totalActivities = activities?.length || 0;

        // Carregar total de alunos inscritos
        const { data: enrollments, error: enrollError } = await supabase
          .from('course_enrollments')
          .select('id')
          .in('course_id', courseIds);

        if (enrollError) throw enrollError;
        totalStudents = enrollments?.length || 0;
      }

      setStats({
        totalCourses: courses?.length || 0,
        totalActivities,
        totalStudents,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Cursos</CardTitle>
            <MdSchool className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cursos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades Criadas</CardTitle>
            <MdAssignment className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de atividades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <MdPeople className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Em todos os cursos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <ActivitiesCalendar />
    </div>
  );
}
