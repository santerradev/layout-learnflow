import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MdAdd, MdDelete } from 'react-icons/md';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
}

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  activityType: 'quiz' | 'assignment' | 'material';
}

export const CreateActivityDialog = ({ open, onOpenChange, courseId, activityType }: CreateActivityDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''] }
  ]);

  const getDialogTitle = () => {
    switch (activityType) {
      case 'quiz':
        return 'Criar Novo Questionário';
      case 'assignment':
        return 'Criar Nova Tarefa';
      case 'material':
        return 'Adicionar Material';
      default:
        return 'Criar Atividade';
    }
  };

  const getDialogDescription = () => {
    switch (activityType) {
      case 'quiz':
        return 'Preencha os campos do quiz e adicione de 1 à 10 perguntas';
      case 'assignment':
        return 'Configure a tarefa que será entregue pelos alunos';
      case 'material':
        return 'Adicione materiais de apoio para os alunos';
      default:
        return '';
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''] }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Preencha o título da atividade');
      return;
    }

    // Validate based on type
    if (activityType === 'quiz') {
      for (let i = 0; i < questions.length; i++) {
        if (!questions[i].question.trim()) {
          toast.error(`Preencha o enunciado da pergunta ${i + 1}`);
          return;
        }
        
        const filledOptions = questions[i].options.filter(opt => opt.trim());
        if (filledOptions.length < 2) {
          toast.error(`A pergunta ${i + 1} precisa ter pelo menos 2 opções`);
          return;
        }
      }
    }

    // Here you would save to database
    toast.success('Atividade criada com sucesso!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setTopic('');
    setDueDate('');
    setQuestions([{ question: '', options: ['', '', '', ''] }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {getDialogDescription()}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              {activityType === 'quiz' ? 'Título do questionário' : 
               activityType === 'assignment' ? 'Título da tarefa' : 
               'Título do material'}
            </Label>
            <Input
              id="title"
              placeholder="Ex: Fundamentos de JavaScript"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo desta atividade..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">Tópico</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tópico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Fundamentos de Programação</SelectItem>
                <SelectItem value="2">Estruturas de Dados</SelectItem>
                <SelectItem value="3">Algoritmos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de entrega</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Questions - Only for Quiz */}
          {activityType === 'quiz' && (
            <>
              <div className="space-y-4">
                {questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="border rounded-lg p-4 space-y-4 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Pergunta {questionIndex + 1}</Label>
                      {questions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(questionIndex)}
                        >
                          <MdDelete className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-${questionIndex}`}>Enunciado da Pergunta</Label>
                      <Textarea
                        id={`question-${questionIndex}`}
                        placeholder="Digite sua pergunta aqui..."
                        value={question.question}
                        onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Opções de Resposta (Marque a correta)</Label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${questionIndex}`}
                            className="h-4 w-4"
                          />
                          <Input
                            placeholder={`Opção ${String.fromCharCode(65 + optionIndex)}`}
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Question Button */}
              {questions.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddQuestion}
                  className="w-full"
                >
                  <MdAdd className="h-4 w-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              )}
            </>
          )}

          {/* Assignment Instructions */}
          {activityType === 'assignment' && (
            <div className="space-y-2">
              <Label htmlFor="instructions">Instruções da Tarefa</Label>
              <Textarea
                id="instructions"
                placeholder="Descreva o que os alunos devem entregar..."
                rows={6}
              />
            </div>
          )}

          {/* Material URL */}
          {activityType === 'material' && (
            <div className="space-y-2">
              <Label htmlFor="url">Link do Material</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://exemplo.com/material.pdf"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            {activityType === 'quiz' ? 'Salvar Questionário' : 
             activityType === 'assignment' ? 'Salvar Tarefa' : 
             'Salvar Material'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
