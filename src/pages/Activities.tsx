import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MdAssignment, 
  MdQuiz,
  MdFolder,
  MdSearch,
  MdFilterList,
  MdCalendarToday,
  MdAccessTime
} from 'react-icons/md';

// Mock activities data
const mockActivities = [
  {
    id: '1',
    title: 'Lista de Exercícios - Logaritmos',
    course: 'Matemática Avançada',
    teacher: 'Prof. Ana Silva',
    type: 'assignment',
    dueDate: '2024-01-25',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Questionário - Funções Exponenciais',
    course: 'Matemática Avançada',
    teacher: 'Prof. Ana Silva',
    type: 'quiz',
    dueDate: '2024-01-30',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Ensaio sobre República Velha',
    course: 'História do Brasil',
    teacher: 'Prof. Carlos Mendes',
    type: 'assignment',
    dueDate: '2024-02-05',
    status: 'completed',
    priority: 'low'
  },
  {
    id: '4',
    title: 'Material de Apoio - Física Quântica',
    course: 'Física Moderna',
    teacher: 'Prof. Mariana Costa',
    type: 'material',
    dueDate: null,
    status: 'available',
    priority: 'low'
  }
];

/**
 * Activities page - Lista todas as atividades do usuário
 */
export const Activities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

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
      case 'overdue':
        return <Badge variant="destructive">Atrasada</Badge>;
      case 'available':
        return <Badge variant="outline">Disponível</Badge>;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
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

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && activity.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Atividades</h1>
          <p className="text-muted-foreground">
            Acompanhe todas as suas atividades e prazos
          </p>
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
                  placeholder="Buscar atividades..."
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
                  Todas
                </Badge>
                <Badge 
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter('pending')}
                >
                  Pendentes
                </Badge>
                <Badge 
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter('completed')}
                >
                  Concluídas
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <Card 
            key={activity.id} 
            className={`border-l-4 ${getPriorityColor(activity.priority)} hover:shadow-md transition-shadow cursor-pointer`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <h3 className="font-medium text-foreground">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.course}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(activity.status)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {activity.teacher.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{activity.teacher}</span>
                  </div>
                </div>

                {activity.dueDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MdAccessTime className="h-4 w-4" />
                    <span>Entrega: {formatDueDate(activity.dueDate)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Nenhuma atividade encontrada
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Tente usar termos diferentes na busca'
                  : 'Você não possui atividades no momento'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};