import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

/**
 * Registration page - User sign up
 */
export const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'Nome completo é obrigatório';
    }
    if (name.trim().length < 2) {
      return 'Nome deve ter pelo menos 2 caracteres';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email é obrigatório';
    }
    if (!emailRegex.test(email)) {
      return 'Formato de email inválido';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Senha é obrigatória';
    }
    if (password.length < 8) {
      return 'Senha deve ter pelo menos 8 caracteres';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) {
      return 'Confirmação de senha é obrigatória';
    }
    if (confirmPassword !== password) {
      return 'Senhas não coincidem';
    }
    return '';
  };

  const handleFieldBlur = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, password);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
    
    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock registration - in real app, this would be an API call
      const userData = { name, email };
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo(a), ${name}! Você já está logado na plataforma.`,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <h1 className="text-2xl font-medium text-foreground">
              EduPlatform
            </h1>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-medium text-foreground mb-2">
              Criar sua conta
            </h2>
            <p className="text-muted-foreground text-sm">
              Junte-se à nossa plataforma de ensino
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleFieldBlur('name', name)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleFieldBlur('email', email)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleFieldBlur('password', password)}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleFieldBlur('confirmPassword', confirmPassword)}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Register Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};