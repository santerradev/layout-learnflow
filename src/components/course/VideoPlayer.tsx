import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MdCheckCircle,
  MdArrowForward
} from 'react-icons/md';
import { useToast } from '@/hooks/use-toast';
import { CommentsSection } from './CommentsSection';

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  createdAt: Date;
  topicId: string;
}

interface VideoPlayerProps {
  lesson: Lesson;
  isCompleted?: boolean;
  onComplete?: (lessonId: string) => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const VideoPlayer = ({ 
  lesson, 
  isCompleted = false, 
  onComplete, 
  onNext, 
  hasNext = false 
}: VideoPlayerProps) => {
  const [videoProgress, setVideoProgress] = useState(81); // Simulated progress
  const { toast } = useToast();

  const handleMarkComplete = () => {
    if (onComplete) {
      onComplete(lesson.id);
      toast({
        title: "Aula concluída!",
        description: "Parabéns! Você concluiu esta aula.",
      });
    }
  };

  const handleNextLesson = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={lesson.videoUrl}
              title={lesson.title}
              className="w-full h-full"
              controls
              controlsList="nodownload"
            />
          </div>
        </CardContent>
      </Card>

      {/* Video Info */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span>{lesson.duration}</span>
            <span>•</span>
            <span>{lesson.createdAt.toLocaleDateString('pt-BR')}</span>
            {isCompleted && (
              <>
                <span>•</span>
                <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                  <MdCheckCircle className="h-3 w-3" />
                  Concluída
                </Badge>
              </>
            )}
            {hasNext && isCompleted && (
              <Button onClick={handleNextLesson} size="sm" className="gap-2 ml-2">
                Próxima Aula
                <MdArrowForward className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mark as Complete Button */}
        {!isCompleted && (
          <div>
            <Button onClick={handleMarkComplete} className="gap-2">
              <MdCheckCircle className="h-4 w-4" />
              Marcar como Concluída
            </Button>
          </div>
        )}

        {/* Video Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Progresso do vídeo</h3>
                <span className="text-sm text-muted-foreground">{videoProgress}%</span>
              </div>
              <Progress value={videoProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-2">Sobre esta aula</h3>
            <p className="text-muted-foreground leading-relaxed">
              {lesson.description}
            </p>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentsSection lessonId={lesson.id} />
      </div>
    </div>
  );
};