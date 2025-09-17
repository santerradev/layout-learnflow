import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MdAccessTime, 
  MdPeople, 
  MdThumbUp,
  MdThumbDown,
  MdShare,
  MdBookmark,
  MdCheckCircle,
  MdSkipNext,
  MdPerson
} from 'react-icons/md';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  views: number;
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
  // Convert URL to embeddable format if it's a YouTube URL
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(lesson.videoUrl)}
              title={lesson.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MdAccessTime className="h-4 w-4" />
              {lesson.duration}
            </div>
            <div className="flex items-center gap-1">
              <MdPeople className="h-4 w-4" />
              {lesson.views} visualizações
            </div>
            <Badge variant="secondary">
              {lesson.createdAt.toLocaleDateString('pt-BR')}
            </Badge>
          </div>
        </div>

        {/* Completion and Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <MdThumbUp className="h-4 w-4" />
              Curtir
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MdThumbDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MdShare className="h-4 w-4" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MdBookmark className="h-4 w-4" />
              Salvar
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <Button onClick={handleMarkComplete} className="gap-2">
                <MdCheckCircle className="h-4 w-4" />
                Marcar como Concluída
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                  <MdCheckCircle className="h-3 w-3" />
                  Concluída
                </Badge>
                {hasNext && (
                  <Button onClick={handleNextLesson} className="gap-2">
                    Próxima Aula
                    <MdSkipNext className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

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
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MdPerson className="h-3 w-3" />
                  Instrutor: Prof. João Silva
                </div>
                <div>
                  Publicado em {lesson.createdAt.toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};