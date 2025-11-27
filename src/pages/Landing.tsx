import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import heroImage from '@/assets/hero-workspace.jpg';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-secondary/30 animate-gradient-shift" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/40 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-foreground" />
          <span className="text-2xl font-bold text-foreground">LeanFlow</span>
        </div>
        <nav className="flex items-center gap-8">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Cadastro</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-100px)]">
          {/* Left Column - Content */}
          <div className="space-y-6 lg:pr-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Transforme a forma de{' '}
              <span className="text-primary">ensinar e aprender</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              A plataforma completa para gestão educacional moderna, conectando professores e alunos em um ambiente colaborativo e intuitivo.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
              <Button size="lg" className="text-base px-8" asChild>
                <Link to="/cadastro">Começar Agora</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" asChild>
                <Link to="/login">Saiba Mais</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative lg:block hidden">
            <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-2xl transform rotate-2">
              <img 
                src={heroImage} 
                alt="Workspace moderno com desenvolvimento"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
