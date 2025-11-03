import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CourseHeader } from '@/components/CourseHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MuralTab } from '@/components/course/MuralTab';
import { LessonsTab } from '@/components/course/LessonsTab';
import { ActivitiesTab } from '@/components/course/ActivitiesTab';
import { PeopleTab } from '@/components/course/PeopleTab';

// Mock course data
const mockCourse = {
  id: '1',
  title: 'Curso Programação',
  section: '3º Ano - Turma A',
  teacher: 'Prof. Ana Silva',
  bannerColor: 'bg-blue-500',
  description: 'Curso focado em programação e desenvolvimento de software'
};

type TabValue = 'mural' | 'aulas' | 'atividades' | 'pessoas';

/**
 * Course page - Individual course view with tabs
 */
export const Course = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabValue>('mural');

  // Get tab from URL params or default to 'mural'
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabValue;
    if (tabParam && ['mural', 'aulas', 'atividades', 'pessoas'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <CourseHeader 
        title={mockCourse.title}
        section={mockCourse.section}
        teacher={mockCourse.teacher}
        bannerColor={mockCourse.bannerColor}
      />
      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange as (value: string) => void}>
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="mural">Mural</TabsTrigger>
            <TabsTrigger value="aulas">Aulas</TabsTrigger>
            <TabsTrigger value="atividades">Atividades</TabsTrigger>
            <TabsTrigger value="pessoas">Pessoas</TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="mural" className="mt-0">
            <MuralTab courseId={id || ''} />
          </TabsContent>

          <TabsContent value="aulas" className="mt-0">
            <LessonsTab courseId={id || ''} />
          </TabsContent>

          <TabsContent value="atividades" className="mt-0">
            <ActivitiesTab courseId={id || ''} />
          </TabsContent>

          <TabsContent value="pessoas" className="mt-0">
            <PeopleTab courseId={id || ''} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};