import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MdAdd, 
  MdPlayArrow, 
  MdAccessTime, 
  MdPeople,
  MdDescription,
  MdVideoLibrary,
  MdArrowBack
} from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateLessonForm } from '@/components/course/CreateLessonForm';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { PlaylistSidebar } from '@/components/course/PlaylistSidebar';

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  createdAt: Date;
  topicId: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface LessonsTabProps {
  courseId: string;
}

// Mock data
const mockTopics: Topic[] = [
  {
    id: '1',
    title: 'Introdução à Álgebra Linear',
    description: 'Conceitos fundamentais de álgebra linear',
    lessons: [
      {
        id: '1',
        title: 'Vetores e Espaços Vetoriais',
        description: 'Introdução aos conceitos básicos de vetores',
        videoUrl: '/videos/algebra-vetores.mp4',
        duration: '45 min',
        createdAt: new Date('2024-01-15'),
        topicId: '1'
      },
      {
        id: '2',
        title: 'Operações com Vetores',
        description: 'Soma, subtração e produto escalar de vetores',
        videoUrl: '/videos/algebra-operacoes.mp4',
        duration: '38 min',
        createdAt: new Date('2024-01-18'),
        topicId: '1'
      }
    ]
  },
  {
    id: '2',
    title: 'Matrizes e Determinantes',
    description: 'Estudo de matrizes e cálculo de determinantes',
    lessons: [
      {
        id: '3',
        title: 'Definição e Tipos de Matrizes',
        description: 'Conceitos básicos sobre matrizes',
        videoUrl: '/videos/matrizes-definicao.mp4',
        duration: '42 min',
        createdAt: new Date('2024-01-22'),
        topicId: '2'
      }
    ]
  }
];

export const LessonsTab = ({ courseId }: LessonsTabProps) => {
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(['1'])); // Mock completed lessons

  const handleCreateLesson = (lessonData: any) => {
    console.log('Creating lesson:', lessonData);
    setOpenDialog(false);
  };

  const handlePlayVideo = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToList = () => {
    setSelectedLesson(null);
  };

  const handleCompleteLesson = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    
    // Find current lesson and get next one
    const allLessons = topics.flatMap(topic => topic.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === selectedLesson.id);
    const nextLesson = allLessons[currentIndex + 1];
    
    if (nextLesson) {
      setSelectedLesson(nextLesson);
    }
  };

  const getNextLesson = (currentLesson: Lesson) => {
    const allLessons = topics.flatMap(topic => topic.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
    return allLessons[currentIndex + 1] || null;
  };

  // If a lesson is selected, show video player
  if (selectedLesson) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackToList}
            className="gap-2"
          >
            <MdArrowBack className="h-4 w-4" />
            Voltar para Lista
          </Button>
        </div>

        {/* Video Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <VideoPlayer 
              lesson={selectedLesson} 
              isCompleted={completedLessons.has(selectedLesson.id)}
              onComplete={handleCompleteLesson}
              onNext={handleNextLesson}
              hasNext={!!getNextLesson(selectedLesson)}
            />
          </div>
          
          {/* Playlist Sidebar - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <PlaylistSidebar 
              topics={topics}
              currentLesson={selectedLesson}
              onLessonSelect={setSelectedLesson}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Aulas</h2>
          <p className="text-muted-foreground">
            Videoaulas organizadas por tópicos
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <MdAdd className="h-4 w-4" />
              Nova Aula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Aula</DialogTitle>
              <DialogDescription>
                Adicione uma nova videoaula ao curso
              </DialogDescription>
            </DialogHeader>
            <CreateLessonForm 
              topics={topics}
              onSubmit={handleCreateLesson}
              onCancel={() => setOpenDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Topics and Lessons */}
      <div className="space-y-6">
        {topics.map((topic) => (
          <Card key={topic.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MdVideoLibrary className="h-5 w-5 text-primary" />
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {topic.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {topic.lessons.length} aula{topic.lessons.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topic.lessons.map((lesson) => (
                  <div key={lesson.id}>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePlayVideo(lesson)}
                          className="h-12 w-12 rounded-full"
                        >
                          <MdPlayArrow className="h-6 w-6" />
                        </Button>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MdAccessTime className="h-3 w-3" />
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {lesson.id !== topic.lessons[topic.lessons.length - 1].id && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {topics.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MdVideoLibrary className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma aula criada
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando sua primeira videoaula para este curso
            </p>
            <Button onClick={() => setOpenDialog(true)} className="gap-2">
              <MdAdd className="h-4 w-4" />
              Criar Primeira Aula
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};