import { Header } from '@/components/Header';
import { CourseCard } from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { MdSchool } from 'react-icons/md';

// Mock data for demonstration
const mockCourses = [
  {
    id: '1',
    title: 'Matemática Avançada',
    section: '3º Ano - Turma A',
    teacher: 'Prof. Ana Silva',
    bannerColor: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'História do Brasil',
    section: '2º Ano - Turma B',
    teacher: 'Prof. Carlos Santos',
    bannerColor: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Física Experimental',
    section: '3º Ano - Turma C',
    teacher: 'Prof. Maria Oliveira',
    bannerColor: 'bg-purple-500'
  },
  {
    id: '4',
    title: 'Literatura Contemporânea',
    section: '1º Ano - Turma A',
    teacher: 'Prof. João Pedro',
    bannerColor: 'bg-orange-500'
  },
  {
    id: '5',
    title: 'Química Orgânica',
    section: '3º Ano - Turma B',
    teacher: 'Prof. Lucia Costa',
    bannerColor: 'bg-red-500'
  },
  {
    id: '6',
    title: 'Programação Web',
    section: 'Curso Técnico',
    teacher: 'Prof. Ricardo Lima',
    bannerColor: 'bg-indigo-500'
  }
];

/**
 * Dashboard page - Main course listing page
 * Displays all courses in a responsive grid layout
 */
export const Dashboard = () => {
  const handleCourseClick = (courseId: string) => {
    console.log(`Navigating to course: ${courseId}`);
    // Here you would implement navigation to the course page
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-foreground">
            Suas turmas
          </h2>
          <p className="text-muted-foreground mt-1">
            Acesse suas turmas e acompanhe o progresso dos estudos
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              section={course.section}
              teacher={course.teacher}
              bannerColor={course.bannerColor}
              onClick={() => handleCourseClick(course.id)}
            />
          ))}
        </div>

        {/* Empty State (when no courses) */}
        {mockCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <MdSchool className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma turma encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              Participe de uma turma ou crie uma nova para começar
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Participar de uma turma
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};