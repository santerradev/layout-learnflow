import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MdAdd, 
  MdAssignment, 
  MdFolder, 
  MdQuiz,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateActivityDialog } from './CreateActivityDialog';

interface ActivitiesTabProps {
  courseId: string;
}

// Mock activities data
const mockTopics = [
  {
    id: '1',
    title: 'Fundamentos de Programação',
    activities: [
      {
        id: '1',
        title: 'Lista de Exercícios - Variáveis e Tipos',
        type: 'quiz',
        dueDate: '2024-01-25',
        status: 'pending'
      },
      {
        id: '2',
        title: 'Material de Apoio - Sintaxe JavaScript',
        type: 'material',
        dueDate: null,
        status: 'available'
      }
    ]
  },
  {
    id: '2',
    title: 'Estruturas de Dados',
    activities: [
      {
        id: '3',
        title: 'Questionário - Arrays e Objetos',
        type: 'quiz',
        dueDate: '2024-01-30',
        status: 'pending'
      },
      {
        id: '4',
        title: 'Prova - Algoritmos e Lógica',
        type: 'assignment',
        dueDate: '2024-02-05',
        status: 'upcoming'
      }
    ]
  }
];

/**
 * Activities Tab component - displays course activities organized by topics
 */
export const ActivitiesTab = ({ courseId }: ActivitiesTabProps) => {
  const navigate = useNavigate();
  const [expandedTopics, setExpandedTopics] = useState<string[]>(['1']);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activityType, setActivityType] = useState<'quiz' | 'assignment' | 'material'>('quiz');

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <MdAssignment className="h-5 w-5 text-blue-600" />;
      case 'material':
        return <MdFolder className="h-5 w-5 text-green-600" />;
      case 'quiz':
        return <MdQuiz className="h-5 w-5 text-purple-600" />;
      default:
        return <MdFolder className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">Pendente</Badge>;
      case 'completed':
        return <Badge variant="default">Concluída</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Em breve</Badge>;
      case 'available':
        return <Badge variant="outline">Disponível</Badge>;
      default:
        return null;
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Create Button - Only for teachers */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <MdAdd className="h-4 w-4" />
              Nova atividade
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setActivityType('quiz');
              setCreateDialogOpen(true);
            }}>
              <MdQuiz className="h-4 w-4 mr-2" />
              Questionário
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setActivityType('assignment');
              setCreateDialogOpen(true);
            }}>
              <MdAssignment className="h-4 w-4 mr-2" />
              Tarefa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setActivityType('material');
              setCreateDialogOpen(true);
            }}>
              <MdFolder className="h-4 w-4 mr-2" />
              Material
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Topics and Activities */}
      <div className="space-y-4">
        {mockTopics.map((topic) => (
          <Card key={topic.id} className="animate-fade-in">
            {/* Topic Header */}
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleTopic(topic.id)}
            >
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{topic.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {topic.activities.length} atividade{topic.activities.length !== 1 ? 's' : ''}
                  </Badge>
                  {expandedTopics.includes(topic.id) ? (
                    <MdExpandLess className="h-5 w-5" />
                  ) : (
                    <MdExpandMore className="h-5 w-5" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>

            {/* Activities List */}
            {expandedTopics.includes(topic.id) && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {topic.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => {
                        navigate(`/quiz/${activity.id}`);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <h4 className="font-medium text-foreground">
                            {activity.title}
                          </h4>
                          {activity.dueDate && (
                            <p className="text-sm text-muted-foreground">
                              Entrega: {formatDueDate(activity.dueDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
      ))}
    </div>

    <CreateActivityDialog
      open={createDialogOpen}
      onOpenChange={setCreateDialogOpen}
      courseId={courseId}
      activityType={activityType}
    />

    {/* Empty State */}
    {mockTopics.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">
                Nenhuma atividade ainda
              </h3>
              <p className="text-muted-foreground">
                As atividades da turma aparecerão aqui
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};