import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard';

/**
 * Dashboard page - Shows different dashboards based on user role
 */
export const Dashboard = () => {
  const [userType, setUserType] = useState<'estudante' | 'professor' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserType();
  }, []);

  const loadUserType = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('tipo')
        .eq('id', user.id)
        .single();

      setUserType(profile?.tipo || 'estudante');
    } catch (error) {
      console.error('Erro ao carregar tipo de usuário:', error);
      setUserType('estudante'); // Default para estudante
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {userType === 'professor' 
            ? 'Visão geral das suas turmas e atividades'
            : 'Acompanhe seus cursos e prazos de entrega'}
        </p>
      </div>

      {userType === 'professor' ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  );
};