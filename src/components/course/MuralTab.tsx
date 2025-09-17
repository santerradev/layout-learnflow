import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MdSend, MdMoreVert } from 'react-icons/md';
import { useToast } from '@/hooks/use-toast';
import { CourseProgressCard } from './CourseProgressCard';

interface MuralTabProps {
  courseId: string;
}

// Mock posts data
const mockPosts = [
  {
    id: '1',
    author: 'Prof. Ana Silva',
    authorInitials: 'AS',
    content: 'Bem-vindos ao curso de Matemática Avançada! Estou muito animada para trabalhar com vocês este semestre. Lembrem-se de sempre participar das discussões e não hesitem em tirar dúvidas.',
    timestamp: '2024-01-15T10:30:00Z',
    comments: []
  },
  {
    id: '2',
    author: 'Prof. Ana Silva',
    authorInitials: 'AS',
    content: 'Pessoal, não se esqueçam que temos prova na próxima semana sobre funções logarítmicas. Estudem os exercícios dos capítulos 4 e 5 do livro.',
    timestamp: '2024-01-14T14:20:00Z',
    comments: [
      { id: '1', author: 'João Silva', content: 'Professora, a prova vai incluir gráficos também?' },
      { id: '2', author: 'Prof. Ana Silva', content: 'Sim João, incluirá interpretação de gráficos!' }
    ]
  }
];

/**
 * Mural Tab component - displays course announcements and posts
 */
export const MuralTab = ({ courseId }: MuralTabProps) => {
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    setIsPosting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Post criado com sucesso!",
        description: "Seu aviso foi publicado no mural da turma.",
      });
      
      setNewPost('');
    } catch (error) {
      toast({
        title: "Erro ao criar post",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Course Progress Card */}
      <CourseProgressCard
        courseId={courseId}
        instructor="Prof. João Silva"
        totalLessons={3}
        completedLessons={1}
        totalActivities={2}
        completedActivities={1}
      />
      
      {/* Create Post Form */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Anuncie algo para a turma..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleCreatePost}
                disabled={!newPost.trim() || isPosting}
                className="flex items-center gap-2"
              >
                <MdSend className="h-4 w-4" />
                {isPosting ? 'Publicando...' : 'Postar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <Card key={post.id} className="animate-fade-in">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{post.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{post.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.timestamp)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MdMoreVert className="h-4 w-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-foreground leading-relaxed">{post.content}</p>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Comentários ({post.comments.length})
                  </p>
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">
                Nenhum post ainda
              </h3>
              <p className="text-muted-foreground">
                Seja o primeiro a fazer um anúncio para a turma!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};