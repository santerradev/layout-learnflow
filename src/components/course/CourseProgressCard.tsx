import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  MdPerson, 
  MdVideoLibrary, 
  MdAssignment,
  MdTrendingUp 
} from 'react-icons/md';

interface CourseProgressCardProps {
  courseId: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  totalActivities: number;
  completedActivities: number;
}

export const CourseProgressCard = ({
  instructor,
  totalLessons,
  completedLessons,
  totalActivities,
  completedActivities
}: CourseProgressCardProps) => {
  const totalItems = totalLessons + totalActivities;
  const completedItems = completedLessons + completedActivities;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Informações do Curso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instructor */}
        <div className="flex items-center gap-2 text-sm">
          <MdPerson className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Instrutor:</span>
          <span className="font-medium">{instructor}</span>
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <MdVideoLibrary className="h-4 w-4 text-muted-foreground" />
            <span>{totalLessons} aulas</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1">
            <MdAssignment className="h-4 w-4 text-muted-foreground" />
            <span>{totalActivities} atividades</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdTrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">Progresso do Curso</span>
            </div>
            <Badge variant="secondary">{progressPercentage}%</Badge>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <p className="text-sm text-muted-foreground">
            {completedItems} de {totalItems} aulas concluídas
          </p>
        </div>

        {/* Statistics */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-medium text-sm">Estatísticas</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aulas concluídas:</span>
              <span className="font-medium">{completedLessons}/{totalLessons}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Atividades feitas:</span>
              <span className="font-medium">{completedActivities}/{totalActivities}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};