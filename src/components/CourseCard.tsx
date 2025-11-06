import { MdMoreVert, MdAssignment, MdAnnouncement } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
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
  courseImageUrl?: string;
  teacherAvatarUrl?: string;
  isEnrolled?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
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
  courseImageUrl,
  teacherAvatarUrl,
  isEnrolled = true,
  onClick,
  onDelete
}: CourseCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/curso/${id}`);
    onClick?.();
  };

  return (
    <div 
      className="bg-card rounded-lg shadow-sm border border-border course-card-hover cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Course Banner */}
      <div className={`h-32 ${courseImageUrl ? '' : bannerColor} course-banner relative overflow-hidden`}>
        {courseImageUrl ? (
          <img 
            src={courseImageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${bannerColor}`} />
        )}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground hover:bg-white/20 bg-black/20"
                onClick={(e) => e.stopPropagation()}
              >
                <MdMoreVert className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
              >
                <span>Excluir</span>
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
        <div className="mb-4 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {teacherAvatarUrl && <AvatarImage src={teacherAvatarUrl} alt={teacher} />}
            <AvatarFallback>{teacher.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground font-medium">
            {teacher}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-border">
          <Button 
            variant={isEnrolled ? "default" : "secondary"}
            size="sm"
            className={isEnrolled ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {isEnrolled ? "Acessar" : "Inscrever-se"}
          </Button>
        </div>
      </div>
    </div>
  );
};