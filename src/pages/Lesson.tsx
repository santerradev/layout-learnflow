import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MdArrowBack } from 'react-icons/md';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { PlaylistSidebar } from '@/components/course/PlaylistSidebar';

// Mock data - will be replaced with real data later
const mockTopics = [
  {
    id: '1',
    title: 'Fundamentos',
    description: 'Conceitos básicos e introdutórios',
    lessons: [
      {
        id: '1',
        title: 'Introdução aos Vetores',
        description: 'Nesta aula, você aprenderá os conceitos fundamentais sobre vetores, incluindo definição, representação gráfica e operações básicas.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '45 min',
        createdAt: new Date('2024-01-15'),
        topicId: '1',
      },
      {
        id: '2',
        title: 'Operações com Vetores',
        description: 'Aprenda a realizar operações como adição, subtração e multiplicação escalar com vetores.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '50 min',
        createdAt: new Date('2024-01-17'),
        topicId: '1',
      },
    ],
  },
  {
    id: '2',
    title: 'Tópicos Avançados',
    description: 'Conteúdo mais complexo e detalhado',
    lessons: [
      {
        id: '3',
        title: 'Produto Escalar',
        description: 'Entenda o produto escalar de vetores e suas aplicações práticas.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '40 min',
        createdAt: new Date('2024-01-20'),
        topicId: '2',
      },
    ],
  },
];

export const Lesson = () => {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Find all lessons and current lesson
  const allLessons = mockTopics.flatMap(topic => topic.lessons);
  const currentLesson = allLessons.find(lesson => lesson.id === lessonId);
  const currentIndex = allLessons.findIndex(lesson => lesson.id === lessonId);

  if (!currentLesson) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Aula não encontrada.</p>
        <Button onClick={() => navigate(`/curso/${courseId}?tab=aulas`)} className="mt-4">
          Voltar ao Curso
        </Button>
      </div>
    );
  }

  const handleCompleteLesson = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      navigate(`/curso/${courseId}/aula/${nextLesson.id}`);
    }
  };

  const handleBackToCourse = () => {
    navigate(`/curso/${courseId}?tab=aulas`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button 
            variant="ghost" 
            onClick={handleBackToCourse}
            className="gap-2"
          >
            <MdArrowBack className="h-4 w-4" />
            Voltar ao Curso
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Video Player Section */}
          <div className="flex-1">
            <VideoPlayer
              lesson={currentLesson}
              isCompleted={completedLessons.has(currentLesson.id)}
              onComplete={handleCompleteLesson}
              onNext={handleNextLesson}
              hasNext={currentIndex < allLessons.length - 1}
            />
          </div>

          {/* Playlist Sidebar */}
          <div className="w-96 shrink-0">
            <PlaylistSidebar
              topics={mockTopics}
              currentLesson={currentLesson}
              onLessonSelect={(lesson) => navigate(`/curso/${courseId}/aula/${lesson.id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
