import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdClose, MdImage } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCourseDialog = ({ open, onOpenChange }: CreateCourseDialogProps) => {
  const [title, setTitle] = useState('');
  const [section, setSection] = useState('');
  const [description, setDescription] = useState('');
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !section.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e a turma do curso.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrate with Supabase to create course
      // For now, just show success and close
      toast({
        title: "Curso criado!",
        description: "Seu curso foi criado com sucesso.",
      });
      
      // Reset form
      setTitle('');
      setSection('');
      setDescription('');
      setCourseImageUrl('');
      onOpenChange(false);
      
      // Navigate to courses page
      navigate('/cursos');
    } catch (error) {
      toast({
        title: "Erro ao criar curso",
        description: "Ocorreu um erro ao criar o curso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar novo curso</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar seu curso
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome do curso *</Label>
            <Input
              id="title"
              placeholder="Ex: Matemática Avançada"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Turma *</Label>
            <Input
              id="section"
              placeholder="Ex: 3º Ano - Turma A"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o conteúdo do curso..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseImageUrl">
              <div className="flex items-center gap-2">
                <MdImage className="h-4 w-4" />
                URL da imagem do curso
              </div>
            </Label>
            <Input
              id="courseImageUrl"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={courseImageUrl}
              onChange={(e) => setCourseImageUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar curso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
