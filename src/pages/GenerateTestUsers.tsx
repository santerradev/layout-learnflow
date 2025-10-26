import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const TEST_USERS = [
  { nome: 'Maria Silva', email: 'maria@test.com', password: 'Test1234' },
  { nome: 'João Santos', email: 'joao@test.com', password: 'Test1234' },
  { nome: 'Ana Costa', email: 'ana@test.com', password: 'Test1234' },
  { nome: 'Pedro Oliveira', email: 'pedro@test.com', password: 'Test1234' },
];

export const GenerateTestUsers = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ nome: string; status: 'success' | 'error' | 'pending'; message?: string }[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateUsers = async () => {
    setIsGenerating(true);
    setResults(TEST_USERS.map(user => ({ nome: user.nome, status: 'pending' })));

    const newResults = [];

    for (const user of TEST_USERS) {
      try {
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              nome: user.nome,
              tipo: 'estudante'
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          // Se o erro for que o usuário já existe, considerar como sucesso
          if (error.message.includes('already registered')) {
            newResults.push({ 
              nome: user.nome, 
              status: 'success' as const, 
              message: 'Já existe' 
            });
          } else {
            newResults.push({ 
              nome: user.nome, 
              status: 'error' as const, 
              message: error.message 
            });
          }
        } else {
          newResults.push({ nome: user.nome, status: 'success' as const });
        }
      } catch (error: any) {
        newResults.push({ 
          nome: user.nome, 
          status: 'error' as const, 
          message: error.message 
        });
      }
      
      setResults([...newResults]);
      // Pequeno delay entre criações
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsGenerating(false);

    const successCount = newResults.filter(r => r.status === 'success').length;
    if (successCount > 0) {
      toast({
        title: "Usuários criados!",
        description: `${successCount} usuário(s) de teste criado(s) com sucesso.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <h1 className="text-2xl font-medium text-foreground">
              LearnFlow
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-foreground mb-2">
              Gerar Usuários de Teste
            </h2>
            <p className="text-muted-foreground text-sm">
              Crie automaticamente usuários de teste para experimentar o chat
            </p>
          </div>

          {/* Test Users Info */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-sm mb-3">Usuários que serão criados:</h3>
            <div className="space-y-2">
              {TEST_USERS.map((user, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  {results.length > 0 ? (
                    <>
                      {results[index]?.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : results[index]?.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      ) : (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      )}
                    </>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/20" />
                  )}
                  <div className="flex-1">
                    <span className="font-medium">{user.nome}</span>
                    <span className="text-muted-foreground"> - {user.email}</span>
                  </div>
                  {results[index]?.message && (
                    <span className="text-xs text-muted-foreground">
                      ({results[index].message})
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Senha padrão:</strong> Test1234
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateUsers}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando usuários...
              </>
            ) : (
              'Gerar Usuários de Teste'
            )}
          </Button>

          {/* Navigation Links */}
          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">
              Voltar para Login
            </Link>
            <Link to="/chat" className="text-muted-foreground hover:text-foreground">
              Ir para Chat
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
