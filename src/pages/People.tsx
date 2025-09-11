import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MdAdd, 
  MdSearch,
  MdEmail,
  MdPerson,
  MdSchool
} from 'react-icons/md';

// Mock people data
const mockPeople = [
  {
    id: '1',
    name: 'Prof. Ana Silva',
    email: 'ana.silva@edu.com',
    role: 'Professor',
    courses: ['Matemática Avançada'],
    initials: 'AS'
  },
  {
    id: '2',
    name: 'Prof. Carlos Mendes',
    email: 'carlos.mendes@edu.com',
    role: 'Professor',
    courses: ['História do Brasil'],
    initials: 'CM'
  },
  {
    id: '3',
    name: 'Prof. Mariana Costa',
    email: 'mariana.costa@edu.com',
    role: 'Professor',
    courses: ['Física Moderna'],
    initials: 'MC'
  },
  {
    id: '4',
    name: 'João Pedro Santos',
    email: 'joao.santos@student.edu.com',
    role: 'Aluno',
    courses: ['Matemática Avançada', 'Física Moderna'],
    initials: 'JP'
  },
  {
    id: '5',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@student.edu.com',
    role: 'Aluno',
    courses: ['História do Brasil', 'Matemática Avançada'],
    initials: 'MO'
  },
  {
    id: '6',
    name: 'Carlos Eduardo Lima',
    email: 'carlos.lima@student.edu.com',
    role: 'Aluno',
    courses: ['Física Moderna'],
    initials: 'CE'
  }
];

/**
 * People page - Lista todas as pessoas da plataforma
 */
export const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'teachers' | 'students'>('all');

  const handleEmailUser = (email: string, name: string) => {
    const subject = encodeURIComponent('Mensagem da plataforma');
    const body = encodeURIComponent(`Olá ${name},\n\n`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const filteredPeople = mockPeople.filter(person => {
    const matchesSearch = 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'teachers') return matchesSearch && person.role === 'Professor';
    if (filter === 'students') return matchesSearch && person.role === 'Aluno';
    
    return matchesSearch;
  });

  const teachers = filteredPeople.filter(person => person.role === 'Professor');
  const students = filteredPeople.filter(person => person.role === 'Aluno');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pessoas</h1>
          <p className="text-muted-foreground">
            Conecte-se com professores e colegas da plataforma
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <MdAdd className="h-4 w-4 mr-2" />
            Convidar Pessoa
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
                  placeholder="Buscar pessoas..."
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
                  variant={filter === 'teachers' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter('teachers')}
                >
                  Professores
                </Badge>
                <Badge 
                  variant={filter === 'students' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter('students')}
                >
                  Alunos
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Section */}
      {(filter === 'all' || filter === 'teachers') && teachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdPerson className="h-5 w-5" />
              <span>Professores</span>
              <Badge variant="secondary">{teachers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{teacher.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground truncate">
                        {teacher.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {teacher.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {teacher.courses.map((course, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEmailUser(teacher.email, teacher.name)}
                    className="flex-shrink-0"
                  >
                    <MdEmail className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Section */}
      {(filter === 'all' || filter === 'students') && students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdSchool className="h-5 w-5" />
              <span>Alunos</span>
              <Badge variant="secondary">{students.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{student.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground truncate">
                        {student.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {student.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {student.courses.map((course, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEmailUser(student.email, student.name)}
                    className="flex-shrink-0"
                  >
                    <MdEmail className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredPeople.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Nenhuma pessoa encontrada
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Tente usar termos diferentes na busca'
                  : 'Ainda não há pessoas cadastradas na plataforma'
                }
              </p>
              {!searchTerm && (
                <Button>
                  <MdAdd className="h-4 w-4 mr-2" />
                  Convidar Primeira Pessoa
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};