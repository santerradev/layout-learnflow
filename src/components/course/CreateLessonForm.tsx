import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MdVideoLibrary, MdAssignment, MdFolder, MdTopic } from 'react-icons/md';

interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: any[];
}

interface CreateLessonFormProps {
  topics: Topic[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

type ContentType = 'lesson' | 'task' | 'material' | 'topic';

export const CreateLessonForm = ({ topics, onSubmit, onCancel }: CreateLessonFormProps) => {
  const [contentType, setContentType] = useState<ContentType>('lesson');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    topicId: '',
    // Task specific
    dueDate: '',
    points: '',
    // Material specific
    fileUrl: '',
    fileType: '',
    // Topic specific
    topicTitle: '',
    topicDescription: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, type: contentType });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lesson" className="gap-2">
            <MdVideoLibrary className="h-4 w-4" />
            Aula
          </TabsTrigger>
          <TabsTrigger value="task" className="gap-2">
            <MdAssignment className="h-4 w-4" />
            Tarefa
          </TabsTrigger>
          <TabsTrigger value="material" className="gap-2">
            <MdFolder className="h-4 w-4" />
            Material
          </TabsTrigger>
          <TabsTrigger value="topic" className="gap-2">
            <MdTopic className="h-4 w-4" />
            Tópico
          </TabsTrigger>
        </TabsList>

        {/* Lesson Form */}
        <TabsContent value="lesson" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdVideoLibrary className="h-5 w-5" />
                Nova Videoaula
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Aula</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Introdução aos Vetores"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="Ex: 45 min"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o conteúdo da aula..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL do Vídeo</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topicId">Tópico</Label>
                  <Select value={formData.topicId} onValueChange={(value) => handleInputChange('topicId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tópico" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Form */}
        <TabsContent value="task" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdAssignment className="h-5 w-5" />
                Nova Tarefa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Título da Tarefa</Label>
                  <Input
                    id="taskTitle"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Exercícios de Vetores"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Pontuação</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.points}
                    onChange={(e) => handleInputChange('points', e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taskDescription">Descrição</Label>
                <Textarea
                  id="taskDescription"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva a tarefa..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data de Entrega</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskTopicId">Tópico</Label>
                  <Select value={formData.topicId} onValueChange={(value) => handleInputChange('topicId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tópico" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Material Form */}
        <TabsContent value="material" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdFolder className="h-5 w-5" />
                Novo Material
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materialTitle">Título do Material</Label>
                  <Input
                    id="materialTitle"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Apostila de Vetores"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileType">Tipo de Arquivo</Label>
                  <Select value={formData.fileType} onValueChange={(value) => handleInputChange('fileType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="doc">Documento</SelectItem>
                      <SelectItem value="ppt">Apresentação</SelectItem>
                      <SelectItem value="link">Link Externo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="materialDescription">Descrição</Label>
                <Textarea
                  id="materialDescription"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o material..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileUrl">URL do Arquivo</Label>
                  <Input
                    id="fileUrl"
                    type="url"
                    value={formData.fileUrl}
                    onChange={(e) => handleInputChange('fileUrl', e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materialTopicId">Tópico</Label>
                  <Select value={formData.topicId} onValueChange={(value) => handleInputChange('topicId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tópico" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Topic Form */}
        <TabsContent value="topic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdTopic className="h-5 w-5" />
                Novo Tópico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topicTitle">Título do Tópico</Label>
                <Input
                  id="topicTitle"
                  value={formData.topicTitle}
                  onChange={(e) => handleInputChange('topicTitle', e.target.value)}
                  placeholder="Ex: Álgebra Linear"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topicDescription">Descrição</Label>
                <Textarea
                  id="topicDescription"
                  value={formData.topicDescription}
                  onChange={(e) => handleInputChange('topicDescription', e.target.value)}
                  placeholder="Descreva o tópico..."
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar {contentType === 'lesson' ? 'Aula' : 
                 contentType === 'task' ? 'Tarefa' : 
                 contentType === 'material' ? 'Material' : 'Tópico'}
        </Button>
      </div>
    </form>
  );
};