import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  nome: string;
  foto_url: string | null;
  email: string;
}

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

export function NewConversationDialog({
  open,
  onOpenChange,
  onConversationCreated,
}: NewConversationDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      setCurrentUserId(user?.id || null);
    };
    init();
  }, []);

  useEffect(() => {
    if (open && currentUserId) {
      console.log('Fetching users, current user:', currentUserId);
      fetchUsers();
      setSelectedUsers(new Set());
    }
  }, [open, currentUserId]);

  const fetchUsers = async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, foto_url, email')
      .neq('id', currentUserId)
      .order('nome');

    if (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    console.log('Usuários carregados:', data);
    setUsers(data || []);
  };

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const createConversation = async () => {
    if (selectedUsers.size === 0 || !currentUserId) {
      toast({
        title: 'Selecione usuários',
        description: 'Você precisa selecionar pelo menos um usuário',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Creating conversation...');
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        toast({
          title: 'Erro ao criar conversa',
          description: convError.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      console.log('Conversation created:', conversation.id);

      const participants = [
        { conversation_id: conversation.id, user_id: currentUserId },
        ...Array.from(selectedUsers).map(userId => ({
          conversation_id: conversation.id,
          user_id: userId,
        })),
      ];

      console.log('Adding participants:', participants);

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        toast({
          title: 'Erro ao adicionar participantes',
          description: participantsError.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Conversa criada',
        description: 'A conversa foi criada com sucesso',
      });

      console.log('Conversation created successfully');
      setLoading(false);
      onOpenChange(false);
      onConversationCreated(conversation.id);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao criar a conversa',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecione os usuários para iniciar uma conversa
          </p>

          <ScrollArea className="h-[300px] border rounded-lg p-4">
            {users.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <p className="text-sm">Nenhum usuário disponível</p>
                  <p className="text-xs mt-2">Cadastre mais usuários para iniciar conversas</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-accent p-2 rounded-lg"
                    onClick={() => toggleUser(user.id)}
                  >
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                    <Avatar>
                      <AvatarImage src={user.foto_url || undefined} />
                      <AvatarFallback>
                        {user.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.nome}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <Button
            onClick={createConversation}
            disabled={selectedUsers.size === 0 || loading}
            className="w-full"
          >
            Criar Conversa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
