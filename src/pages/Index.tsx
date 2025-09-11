import { CourseCard } from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MdAdd } from 'react-icons/md';

// Mock courses data matching the existing structure
const mockCourses = [
  {
    id: '1',
    title: 'Matemática Avançada',
    section: '3º Ano - Turma A',
    teacher: 'Prof. Ana Silva',
    bannerColor: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'História do Brasil',
    section: '2º Ano - Turma B',
    teacher: 'Prof. Carlos Mendes',
    bannerColor: 'bg-green-500',
  },
  {
    id: '3',
    title: 'Física Moderna',
    section: '3º Ano - Turma C',
    teacher: 'Prof. Mariana Costa',
    bannerColor: 'bg-purple-500',
  },
];

/**
 * Main Index page - Dashboard with courses
 */
const Index = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bem-vindo de volta!
        </h1>
        <p className="text-muted-foreground">
          Seus cursos estão prontos para você
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
          />
        ))}
      </div>

      {/* Empty State */}
      {mockCourses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum curso ainda
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              Crie sua primeira turma ou participe de uma turma existente
            </p>
            <Button>
              <MdAdd className="h-4 w-4 mr-2" />
              Começar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
