import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-gradient-shift" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">LeanFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Cadastro</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground animate-fade-in">
            Transforme a forma de
            <span className="text-primary"> ensinar e aprender</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A plataforma completa para gestão educacional moderna, conectando professores e alunos em um ambiente colaborativo e intuitivo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/cadastro">Começar Agora</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link to="/login">Fazer Login</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:scale-105 transition-transform">
              <BookOpen className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Gestão de Cursos</h3>
              <p className="text-muted-foreground">
                Organize e administre seus cursos de forma simples e eficiente
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:scale-105 transition-transform">
              <Users className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Colaboração</h3>
              <p className="text-muted-foreground">
                Conecte professores e alunos em um ambiente interativo
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:scale-105 transition-transform">
              <TrendingUp className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Acompanhamento</h3>
              <p className="text-muted-foreground">
                Monitore o progresso e performance em tempo real
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
