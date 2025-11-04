import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/button';
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

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-2 pb-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chat')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Chat</h1>
        </div>
        <div className="flex-1 mt-4">
          <ChatWindow conversationId={conversationId} />
        </div>
      </div>
    </MainLayout>
  );
}
