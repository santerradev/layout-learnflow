import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MdThumbUp, 
  MdThumbDown, 
  MdMoreVert,
  MdSend 
} from 'react-icons/md';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

interface CommentsSectionProps {
  lessonId: string;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Maria Santos',
    authorInitials: 'MS',
    content: 'Excelente explicação! Finalmente entendi os conceitos de vetores. A forma como o professor explicou foi muito clara.',
    timestamp: '2024-01-16T10:30:00Z',
    likes: 12,
    dislikes: 0,
    replies: [
      {
        id: '1-1',
        author: 'Prof. João Silva',
        authorInitials: 'JS',
        content: 'Fico feliz que tenha ajudado, Maria! Continue assim.',
        timestamp: '2024-01-16T11:00:00Z',
        likes: 5,
        dislikes: 0
      }
    ]
  },
  {
    id: '2',
    author: 'Carlos Lima',
    authorInitials: 'CL',
    content: 'Poderia fazer um exemplo com vetores em 3D na próxima aula? Seria muito útil!',
    timestamp: '2024-01-16T14:20:00Z',
    likes: 8,
    dislikes: 1
  },
  {
    id: '3',
    author: 'Ana Costa',
    authorInitials: 'AC',
    content: 'Muito bom! Estou acompanhando todas as aulas. O material complementar também está excelente.',
    timestamp: '2024-01-16T16:45:00Z',
    likes: 6,
    dislikes: 0
  }
];

export const CommentsSection = ({ lessonId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'há alguns minutos';
    if (diffInHours < 24) return `há ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `há ${diffInDays} dias`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsPosting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Você',
        authorInitials: 'VC',
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      
      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi publicado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar comentário",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleDislike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, dislikes: comment.dislikes + 1 }
        : comment
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Comentários ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Adicione um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim() || isPosting}
              className="gap-2"
            >
              <MdSend className="h-4 w-4" />
              {isPosting ? 'Publicando...' : 'Comentar'}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{comment.authorInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-2 leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(comment.id)}
                      className="h-8 px-2 gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <MdThumbUp className="h-3 w-3" />
                      {comment.likes > 0 && <span className="text-xs">{comment.likes}</span>}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDislike(comment.id)}
                      className="h-8 px-2 gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <MdThumbDown className="h-3 w-3" />
                      {comment.dislikes > 0 && <span className="text-xs">{comment.dislikes}</span>}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Responder
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MdMoreVert className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{reply.authorInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{reply.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-2 leading-relaxed">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <MdThumbUp className="h-3 w-3" />
                            {reply.likes > 0 && <span className="text-xs">{reply.likes}</span>}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <MdThumbDown className="h-3 w-3" />
                            {reply.dislikes > 0 && <span className="text-xs">{reply.dislikes}</span>}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Responder
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {comments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Seja o primeiro a comentar nesta aula!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};