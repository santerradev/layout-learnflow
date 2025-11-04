import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';

export default function ChatConversation() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  if (!conversationId) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Conversa não encontrada</p>
        </div>
      </MainLayout>
    );
  }

  // Get conversation name from mock data if it's a mock conversation
  const conversationName = conversationId === 'mock-pedro-1' ? 'Pedro Silva' : 'Chat';

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chat')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {conversationName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold">{conversationName}</h1>
        </div>
        <div className="flex-1 mt-4">
          <ChatWindow conversationId={conversationId} />
        </div>
      </div>
    </MainLayout>
  );
}
