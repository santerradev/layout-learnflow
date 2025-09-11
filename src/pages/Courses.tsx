import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MdAdd, 
  MdSearch,
  MdFilterList,
  MdGridView,
  MdViewList
} from 'react-icons/md';
import { CourseCard } from '@/components/CourseCard';

// Mock courses data
const mockCourses = [
  {
    id: '1',
    title: 'Matemática Avançada',
    section: '3º Ano - Turma A',
    teacher: 'Prof. Ana Silva',
    bannerColor: 'bg-blue-500',
    description: 'Curso focado em matemática avançada para ensino médio'
  },
  {
    id: '2',
    title: 'História do Brasil',
    section: '2º Ano - Turma B',
    teacher: 'Prof. Carlos Mendes',
    bannerColor: 'bg-green-500',
    description: 'Estudo da história brasileira desde o período colonial'
  },
  {
    id: '3',
    title: 'Física Moderna',
    section: '3º Ano - Turma C',
    teacher: 'Prof. Mariana Costa',
    bannerColor: 'bg-purple-500',
    description: 'Conceitos fundamentais da física quântica e relatividade'
  }
];

/**
 * Courses page - Lista todos os cursos do usuário
 */
export const Courses = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'teaching' | 'enrolled'>('all');

  const filteredCourses = mockCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meus Cursos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus cursos em um só lugar
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <MdAdd className="h-4 w-4 mr-2" />
            Criar Curso
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={filter === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter('all')}
                >
                  Todos
                </Badge>
                <Badge 
                  variant={filter === 'teaching' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter('teaching')}
                >
                  Lecionando
                </Badge>
                <Badge 
                  variant={filter === 'enrolled' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter('enrolled')}
                >
                  Matriculado
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <MdGridView className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <MdViewList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {filteredCourses.map((course) => (
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
      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Nenhum curso encontrado
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Tente usar termos diferentes na busca'
                  : 'Você ainda não possui cursos. Crie seu primeiro curso!'
                }
              </p>
              {!searchTerm && (
                <Button>
                  <MdAdd className="h-4 w-4 mr-2" />
                  Criar Primeiro Curso
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};