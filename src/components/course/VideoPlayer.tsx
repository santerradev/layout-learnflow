import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MdAccessTime, 
  MdPeople, 
  MdThumbUp,
  MdThumbDown,
  MdShare,
  MdBookmark
} from 'react-icons/md';

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
}

export const VideoPlayer = ({ lesson }: VideoPlayerProps) => {
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

        {/* Action Buttons */}
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

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
            <p className="text-muted-foreground leading-relaxed">
              {lesson.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};