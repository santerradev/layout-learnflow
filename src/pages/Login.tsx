import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

/**
 * Login page - User authentication
 */
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email é obrigatório');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Formato de email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Senha é obrigatória');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      if (email === 'admin@edu.com' && password === 'password') {
        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta à plataforma.",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no servidor",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding and Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">L</span>
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground">
              LearnFlow
            </h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-primary-foreground leading-tight">
              Descubra novas possibilidades de ensino
            </h2>
            <p className="text-primary-foreground/90 text-lg">
              Plataforma completa para instituições de ensino. Gestão de cursos, aulas interativas e comunicação integrada.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-primary-foreground/20">
          <div>
            <div className="text-4xl font-bold text-primary-foreground mb-2">500+</div>
            <div className="text-primary-foreground/80 text-sm">Cursos Ativos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-foreground mb-2">2.5k</div>
            <div className="text-primary-foreground/80 text-sm">Professores</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-foreground mb-2">15k</div>
            <div className="text-primary-foreground/80 text-sm">Alunos Ativos</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-medium text-foreground">
                LearnFlow
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Entrar na sua conta
              </h2>
              <p className="text-muted-foreground">
                Acesse sua plataforma de ensino
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  className={emailError ? 'border-destructive' : ''}
                />
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  className={passwordError ? 'border-destructive' : ''}
                />
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="space-y-3 text-center lg:text-left">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline block"
              >
                Esqueci minha senha
              </Link>
              
              <div className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link to="/cadastro" className="text-primary hover:underline">
                  Cadastre-se
                </Link>
              </div>

              <div className="text-xs text-muted-foreground">
                <Link to="/generate-test-users" className="hover:text-foreground">
                  Gerar usuários de teste para chat
                </Link>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo:</strong> admin@edu.com / password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};