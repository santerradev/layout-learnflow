import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus } from 'lucide-react';
import { NewConversationDialog } from './NewConversationDialog';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  updated_at: string;
  participants: {
    user_id: string;
    profiles: {
      nome: string;
      foto_url: string | null;
    };
  }[];
  lastMessage?: {
    content: string;
    created_at: string;
  };
}

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({ selectedConversationId, onSelectConversation }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('ConversationList - Current user:', user?.id);
      setCurrentUserId(user?.id || null);
    };
    init();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    fetchConversations();
  }, [currentUserId]);

  const fetchConversations = async () => {
    if (!currentUserId) return;

    console.log('Fetching conversations for user:', currentUserId);

    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations!inner(
          id,
          updated_at
        )
      `)
      .eq('user_id', currentUserId);

    if (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Erro ao carregar conversas',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    console.log('Conversations loaded:', data?.length);

    const conversationIds = data.map(d => d.conversation_id);
    
    if (conversationIds.length === 0) {
      setConversations([]);
      return;
    }

    const { data: participantsData } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        user_id,
        profiles!inner(
          nome,
          foto_url
        )
      `)
      .in('conversation_id', conversationIds)
      .neq('user_id', currentUserId);

    const { data: messagesData } = await supabase
      .from('messages')
      .select('conversation_id, content, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false });

    const conversationsMap = new Map();
    
    data.forEach(item => {
      const conv = item.conversations;
      if (!conversationsMap.has(conv.id)) {
        conversationsMap.set(conv.id, {
          id: conv.id,
          updated_at: conv.updated_at,
          participants: [],
        });
      }
    });

    participantsData?.forEach(participant => {
      const conv = conversationsMap.get(participant.conversation_id);
      if (conv) {
        conv.participants.push(participant);
      }
    });

    messagesData?.forEach(message => {
      const conv = conversationsMap.get(message.conversation_id);
      if (conv && !conv.lastMessage) {
        conv.lastMessage = {
          content: message.content,
          created_at: message.created_at,
        };
      }
    });

    const conversationsList = Array.from(conversationsMap.values());
    console.log('Final conversations:', conversationsList.length);
    setConversations(conversationsList);
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.participants.length === 0) return 'Conversa';
    return conversation.participants.map(p => p.profiles.nome).join(', ');
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.participants.length === 0) return null;
    return conversation.participants[0].profiles.foto_url;
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Conversas</h2>
          <Button size="sm" onClick={() => setShowNewConversation(true)}>
            <MessageSquarePlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Nenhuma conversa ainda</p>
              <p className="text-xs mt-2">Clique no botão acima para iniciar</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-3 rounded-lg text-left hover:bg-accent transition-colors ${
                  selectedConversationId === conversation.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={getConversationAvatar(conversation) || undefined} />
                    <AvatarFallback>
                      {getConversationName(conversation).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{getConversationName(conversation)}</p>
                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        onConversationCreated={(id) => {
          fetchConversations();
          onSelectConversation(id);
        }}
      />
    </Card>
  );
}
