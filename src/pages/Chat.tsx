import { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Card } from '@/components/ui/card';

export default function Chat() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedConversationName, setSelectedConversationName] = useState<string>('');

  const handleSelectConversation = (id: string, name: string) => {
    setSelectedConversationId(id);
    setSelectedConversationName(name);
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        <div className="w-80 flex-shrink-0">
          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <div className="flex-1 min-w-0">
          {selectedConversationId ? (
            <div className="h-full flex flex-col">
              <Card className="mb-4 p-4 bg-background border-b rounded-none">
                <h2 className="text-lg font-semibold">{selectedConversationName}</h2>
              </Card>
              <div className="flex-1 min-h-0">
                <ChatWindow conversationId={selectedConversationId} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Bem-vindo ao Chat</p>
                <p className="text-sm mt-2">Selecione uma conversa ou inicie uma nova</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
