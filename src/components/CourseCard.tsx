import { MdMoreVert, MdAssignment, MdAnnouncement } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CourseCardProps {
  id: string;
  title: string;
  section: string;
  teacher: string;
  bannerColor?: string;
  onClick?: () => void;
}

/**
 * CourseCard component inspired by Google Classroom design
 * Features: course banner, title, teacher info, quick actions
 */
export const CourseCard = ({ 
  id, 
  title, 
  section, 
  teacher, 
  bannerColor = 'bg-primary',
  onClick 
}: CourseCardProps) => {
  return (
    <div 
      className="bg-card rounded-lg shadow-sm border border-border course-card-hover cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Course Banner */}
      <div className={`h-20 ${bannerColor} course-banner relative`}>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground hover:bg-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <MdMoreVert className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <span>Arquivar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Course Title and Section */}
        <div className="mb-3">
          <h3 className="text-lg font-medium text-foreground mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {section}
          </p>
        </div>

        {/* Teacher Info */}
        <div className="mb-4">
          <p className="text-sm text-secondary font-medium">
            {teacher}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-secondary hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MdAssignment className="h-4 w-4 mr-1" />
            Atividades
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-secondary hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MdAnnouncement className="h-4 w-4 mr-1" />
            Mural
          </Button>
        </div>
      </div>
    </div>
  );
};