import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MdAdd, MdEmail } from 'react-icons/md';

interface PeopleTabProps {
  courseId: string;
}

// Mock people data
const mockPeople = {
  teachers: [
    {
      id: '1',
      name: 'Prof. Ana Silva',
      email: 'ana.silva@edu.com',
      initials: 'AS',
      role: 'Professor'
    }
  ],
  students: [
    {
      id: '2',
      name: 'João Pedro Santos',
      email: 'joao.santos@student.edu.com',
      initials: 'JP',
      role: 'Aluno'
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@student.edu.com',
      initials: 'MO',
      role: 'Aluno'
    },
    {
      id: '4',
      name: 'Carlos Eduardo Lima',
      email: 'carlos.lima@student.edu.com',
      initials: 'CE',
      role: 'Aluno'
    },
    {
      id: '5',
      name: 'Ana Carolina Souza',
      email: 'ana.souza@student.edu.com',
      initials: 'AC',
      role: 'Aluno'
    },
    {
      id: '6',
      name: 'Pedro Henrique Costa',
      email: 'pedro.costa@student.edu.com',
      initials: 'PH',
      role: 'Aluno'
    }
  ]
};

/**
 * People Tab component - displays course participants (teachers and students)
 */
export const PeopleTab = ({ courseId }: PeopleTabProps) => {
  const handleInviteStudent = () => {
    // This would open a modal to invite students
    console.log('Invite student modal');
  };

  const handleEmailUser = (email: string, name: string) => {
    // This would open email client or modal
    const subject = encodeURIComponent('Mensagem da turma');
    const body = encodeURIComponent(`Olá ${name},\n\n`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Teachers Section */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Professores</span>
              <Badge variant="secondary">{mockPeople.teachers.length}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPeople.teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{teacher.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-foreground">{teacher.name}</h4>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge>{teacher.role}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEmailUser(teacher.email, teacher.name)}
                  >
                    <MdEmail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Section */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Alunos</span>
              <Badge variant="secondary">{mockPeople.students.length}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleInviteStudent}
              className="flex items-center gap-2"
            >
              <MdAdd className="h-4 w-4" />
              Convidar alunos
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockPeople.students.map((student) => (
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

      {/* Course Statistics */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Estatísticas da Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {mockPeople.teachers.length + mockPeople.students.length}
              </div>
              <div className="text-sm text-muted-foreground">Total de pessoas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {mockPeople.students.length}
              </div>
              <div className="text-sm text-muted-foreground">Alunos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {mockPeople.teachers.length}
              </div>
              <div className="text-sm text-muted-foreground">Professores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Participação</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State for Students */}
      {mockPeople.students.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Nenhum aluno inscrito ainda
              </h3>
              <p className="text-muted-foreground">
                Convide alunos para participarem da turma
              </p>
              <Button onClick={handleInviteStudent}>
                <MdAdd className="h-4 w-4 mr-2" />
                Convidar primeiro aluno
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};