import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock messages for Pedro conversation
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    content: 'Oi! Tudo bem?',
    sender_id: 'pedro-123',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    sender: {
      nome: 'Pedro Silva',
      foto_url: null,
    }
  },
  {
    id: 'msg-2',
    content: 'Você viu o material da aula de Programação?',
    sender_id: 'pedro-123',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    sender: {
      nome: 'Pedro Silva',
      foto_url: null,
    }
  }
];

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender: {
    nome: string;
    foto_url: string | null;
  };
}

interface ChatWindowProps {
  conversationId: string;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const isMockConversation = conversationId.startsWith('mock-');
  const [messages, setMessages] = useState<Message[]>(isMockConversation ? mockMessages : []);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Chat - Current user:', user?.id);
      setCurrentUserId(user?.id || null);
    };
    init();
  }, []);

  useEffect(() => {
    if (!conversationId || isMockConversation) return;

    fetchMessages();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any;
          
          const { data: senderData } = await supabase
            .from('profiles')
            .select('nome, foto_url')
            .eq('id', newMsg.sender_id)
            .single();

          if (senderData) {
            setMessages((prev) => [...prev, {
              id: newMsg.id,
              content: newMsg.content,
              sender_id: newMsg.sender_id,
              created_at: newMsg.created_at,
              sender: senderData
            }]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    console.log('Fetching messages for conversation:', conversationId);
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sender_id,
        created_at,
        profiles!messages_sender_id_fkey(
          nome,
          foto_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Erro ao carregar mensagens',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    console.log('Messages loaded:', data?.length);

    const formattedMessages = data.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      sender_id: msg.sender_id,
      created_at: msg.created_at,
      sender: msg.profiles
    }));

    setMessages(formattedMessages);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    console.log('Sending message:', messageContent);

    // Handle mock conversation
    if (isMockConversation) {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        content: messageContent,
        sender_id: currentUserId,
        created_at: new Date().toISOString(),
        sender: {
          nome: 'Você',
          foto_url: null,
        }
      };
      setMessages(prev => [...prev, newMsg]);
      
      // Simulate Pedro's response after 2 seconds
      setTimeout(() => {
        const pedroResponse: Message = {
          id: `msg-pedro-${Date.now()}`,
          content: 'Legal! Vou dar uma olhada também.',
          sender_id: 'pedro-123',
          created_at: new Date().toISOString(),
          sender: {
            nome: 'Pedro Silva',
            foto_url: null,
          }
        };
        setMessages(prev => [...prev, pedroResponse]);
      }, 2000);
      return;
    }

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: messageContent,
    });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message,
        variant: 'destructive',
      });
      setNewMessage(messageContent);
      return;
    }

    console.log('Message sent successfully');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full px-4 py-6" ref={scrollRef}>
          <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-muted-foreground">
              <div>
                <p className="text-sm">Nenhuma mensagem ainda</p>
                <p className="text-xs mt-2">Envie a primeira mensagem!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.sender.foto_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {message.sender.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {!isOwn && (
                      <span className="text-xs font-medium text-foreground mb-1 px-2">
                        {message.sender.nome}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 shadow-sm ${
                        isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 px-2">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  {isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.sender.foto_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {message.sender.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-background/95 backdrop-blur">
        <div className="flex gap-2 items-end">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-full bg-muted border-0 focus-visible:ring-1"
            autoFocus
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim()}
            className="rounded-full h-10 w-10 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
