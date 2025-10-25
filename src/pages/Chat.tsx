import { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function Chat() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        <div className="w-80 flex-shrink-0">
          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        <div className="flex-1">
          {selectedConversationId ? (
            <ChatWindow conversationId={selectedConversationId} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Selecione uma conversa para começar
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
