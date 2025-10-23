interface CourseHeaderProps {
  title: string;
  section: string;
  teacher: string;
  bannerColor: string;
}

/**
 * Course Header component - displays course banner and basic info
 */
export const CourseHeader = ({ title, section, teacher, bannerColor }: CourseHeaderProps) => {
  return (
    <div className="bg-[hsl(var(--course-banner))] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-2 border-white/30"></div>
        <div className="absolute right-12 top-8 w-16 h-16 rounded-full border-2 border-white/20"></div>
        <div className="absolute -right-8 top-20 w-32 h-32 rounded-full border border-white/10"></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium text-white">{title}</h1>
          <p className="text-white/90 text-lg">{section}</p>
          <p className="text-white/80">{teacher}</p>
        </div>
      </div>
    </div>
  );
};