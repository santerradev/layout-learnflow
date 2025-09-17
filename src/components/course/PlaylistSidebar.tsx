import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MdPlayArrow, 
  MdAccessTime, 
  MdVideoLibrary,
  MdCheckCircle
} from 'react-icons/md';
import { cn } from '@/lib/utils';

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

interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface PlaylistSidebarProps {
  topics: Topic[];
  currentLesson: Lesson;
  onLessonSelect: (lesson: Lesson) => void;
}

export const PlaylistSidebar = ({ 
  topics, 
  currentLesson, 
  onLessonSelect 
}: PlaylistSidebarProps) => {
  const totalLessons = topics.reduce((acc, topic) => acc + topic.lessons.length, 0);
  const currentIndex = topics
    .flatMap(topic => topic.lessons)
    .findIndex(lesson => lesson.id === currentLesson.id) + 1;

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MdVideoLibrary className="h-5 w-5 text-primary" />
          Lista de Reprodução
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">
            {currentIndex} de {totalLessons}
          </Badge>
          <span>aulas</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-1 p-3">
            {topics.map((topic) => (
              <div key={topic.id} className="space-y-1">
                <div className="px-3 py-2">
                  <h4 className="font-medium text-sm text-foreground">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {topic.lessons.length} aula{topic.lessons.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {topic.lessons.map((lesson, index) => (
                  <Button
                    key={lesson.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto p-3 text-left",
                      lesson.id === currentLesson.id && "bg-accent"
                    )}
                    onClick={() => onLessonSelect(lesson)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0 mt-1">
                        {lesson.id === currentLesson.id ? (
                          <MdCheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="flex items-center justify-center h-6 w-6 rounded bg-muted text-xs font-medium">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className={cn(
                          "font-medium text-sm line-clamp-2",
                          lesson.id === currentLesson.id 
                            ? "text-primary" 
                            : "text-foreground"
                        )}>
                          {lesson.title}
                        </h5>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MdAccessTime className="h-3 w-3" />
                            {lesson.duration}
                          </div>
                          <span>•</span>
                          <span>{lesson.views} views</span>
                        </div>
                      </div>
                      {lesson.id !== currentLesson.id && (
                        <MdPlayArrow className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};