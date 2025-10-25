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
        <div className="flex-1 min-w-0">
          {selectedConversationId ? (
            <ChatWindow conversationId={selectedConversationId} />
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
