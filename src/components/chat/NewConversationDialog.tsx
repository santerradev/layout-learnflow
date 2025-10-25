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
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (open) {
      fetchUsers();
      setSelectedUsers(new Set());
    }
  }, [open, currentUserId]);

  const fetchUsers = async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, foto_url, email')
      .neq('id', currentUserId);

    if (error) {
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setUsers(data);
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
    if (selectedUsers.size === 0 || !currentUserId) return;

    setLoading(true);

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convError) {
      toast({
        title: 'Erro ao criar conversa',
        description: convError.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const participants = [
      { conversation_id: conversation.id, user_id: currentUserId },
      ...Array.from(selectedUsers).map(userId => ({
        conversation_id: conversation.id,
        user_id: userId,
      })),
    ];

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (participantsError) {
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

    setLoading(false);
    onOpenChange(false);
    onConversationCreated(conversation.id);
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
