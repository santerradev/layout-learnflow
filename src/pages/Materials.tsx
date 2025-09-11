import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MdAdd, 
  MdSearch,
  MdFolder,
  MdInsertDriveFile,
  MdPictureAsPdf,
  MdVideoLibrary,
  MdImage,
  MdDownload,
  MdVisibility
} from 'react-icons/md';

// Mock materials data
const mockMaterials = [
  {
    id: '1',
    title: 'Apostila de Logaritmos',
    course: 'Matemática Avançada',
    teacher: 'Prof. Ana Silva',
    type: 'pdf',
    size: '2.5 MB',
    downloadCount: 23,
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Vídeo - Propriedades dos Logaritmos',
    course: 'Matemática Avançada',
    teacher: 'Prof. Ana Silva',
    type: 'video',
    size: '45.2 MB',
    downloadCount: 18,
    uploadDate: '2024-01-14'
  },
  {
    id: '3',
    title: 'Slides - República Velha',
    course: 'História do Brasil',
    teacher: 'Prof. Carlos Mendes',
    type: 'presentation',
    size: '8.7 MB',
    downloadCount: 31,
    uploadDate: '2024-01-12'
  },
  {
    id: '4',
    title: 'Diagrama - Física Quântica',
    course: 'Física Moderna',
    teacher: 'Prof. Mariana Costa',
    type: 'image',
    size: '1.2 MB',
    downloadCount: 15,
    uploadDate: '2024-01-10'
  },
  {
    id: '5',
    title: 'Lista de Exercícios - Funções',
    course: 'Matemática Avançada',
    teacher: 'Prof. Ana Silva',
    type: 'pdf',
    size: '650 KB',
    downloadCount: 42,
    uploadDate: '2024-01-08'
  }
];

/**
 * Materials page - Lista todos os materiais disponíveis
 */
export const Materials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pdf' | 'video' | 'image' | 'presentation'>('all');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <MdPictureAsPdf className="h-8 w-8 text-red-600" />;
      case 'video':
        return <MdVideoLibrary className="h-8 w-8 text-blue-600" />;
      case 'image':
        return <MdImage className="h-8 w-8 text-green-600" />;
      case 'presentation':
        return <MdInsertDriveFile className="h-8 w-8 text-orange-600" />;
      default:
        return <MdFolder className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'video':
        return 'Vídeo';
      case 'image':
        return 'Imagem';
      case 'presentation':
        return 'Apresentação';
      default:
        return 'Arquivo';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && material.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Materiais</h1>
          <p className="text-muted-foreground">
            Acesse todos os materiais de estudo em um só lugar
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <MdAdd className="h-4 w-4 mr-2" />
            Enviar Material
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar materiais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto">
                <Badge 
                  variant={filter === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setFilter('all')}
                >
                  Todos
                </Badge>
                <Badge 
                  variant={filter === 'pdf' ? 'default' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setFilter('pdf')}
                >
                  PDFs
                </Badge>
                <Badge 
                  variant={filter === 'video' ? 'default' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setFilter('video')}
                >
                  Vídeos
                </Badge>
                <Badge 
                  variant={filter === 'image' ? 'default' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setFilter('image')}
                >
                  Imagens
                </Badge>
                <Badge 
                  variant={filter === 'presentation' ? 'default' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setFilter('presentation')}
                >
                  Apresentações
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                {getFileIcon(material.type)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate mb-1">
                    {material.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {material.course}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {material.teacher}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(material.type)}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{material.size}</span>
                <span>{material.downloadCount} downloads</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(material.uploadDate)}
                </span>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MdVisibility className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MdDownload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Nenhum material encontrado
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Tente usar termos diferentes na busca'
                  : 'Ainda não há materiais disponíveis'
                }
              </p>
              {!searchTerm && (
                <Button>
                  <MdAdd className="h-4 w-4 mr-2" />
                  Enviar Primeiro Material
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};