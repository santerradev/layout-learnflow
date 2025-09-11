import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  MdSettings,
  MdSecurity,
  MdNotifications,
  MdPalette,
  MdLanguage,
  MdStorage,
  MdPrivacyTip,
  MdSave,
  MdLock,
  MdVisibility,
  MdBrightness6,
  MdVolumeUp
} from 'react-icons/md';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

/**
 * Settings page - Application settings and preferences
 */
export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    // Account Settings
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false,
    
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    
    // Appearance Settings
    theme: 'system',
    language: 'pt-BR',
    fontSize: 'medium',
    soundEffects: true,
    
    // Course Settings
    autoEnroll: false,
    showCalendarEvents: true,
    defaultView: 'grid',
    emailDigest: 'daily',
    
    // Storage Settings
    autoBackup: true,
    storageLimit: '5GB',
    downloadQuality: 'high'
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [`${category}${setting}`]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas!",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MdSettings className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize sua experiência na plataforma
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={isLoading}>
            <MdSave className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdSecurity className="h-5 w-5" />
              Conta e Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-email">Email Atual</Label>
                <Input
                  id="current-email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="change-password">Alterar Senha</Label>
                <Button variant="outline" className="w-full justify-start">
                  <MdLock className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Segurança</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-normal">Autenticação de dois fatores</Label>
                  <p className="text-xs text-muted-foreground">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('', 'twoFactorAuth', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdPrivacyTip className="h-5 w-5" />
              Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Visibilidade do Perfil</Label>
                <Select 
                  value={settings.profileVisibility} 
                  onValueChange={(value) => handleSettingChange('', 'profileVisibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Público</SelectItem>
                    <SelectItem value="contacts">Apenas contatos</SelectItem>
                    <SelectItem value="private">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Informações Visíveis</h4>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">Mostrar email no perfil</Label>
                <Switch
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => handleSettingChange('', 'showEmail', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">Mostrar telefone no perfil</Label>
                <Switch
                  checked={settings.showPhone}
                  onCheckedChange={(checked) => handleSettingChange('', 'showPhone', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">Permitir mensagens diretas</Label>
                <Switch
                  checked={settings.allowMessages}
                  onCheckedChange={(checked) => handleSettingChange('', 'allowMessages', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdNotifications className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-normal">Notificações por email</Label>
                  <p className="text-xs text-muted-foreground">Receba atualizações importantes por email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('', 'emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-normal">Notificações por SMS</Label>
                  <p className="text-xs text-muted-foreground">Receba alertas urgentes por SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('', 'smsNotifications', checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Resumo por email</Label>
              <Select 
                value={settings.emailDigest} 
                onValueChange={(value) => handleSettingChange('', 'emailDigest', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nunca</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdPalette className="h-5 w-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => handleSettingChange('', 'theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => handleSettingChange('', 'language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tamanho da fonte</Label>
                <Select 
                  value={settings.fontSize} 
                  onValueChange={(value) => handleSettingChange('', 'fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequena</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-normal">Efeitos sonoros</Label>
                <p className="text-xs text-muted-foreground">Sons para notificações e ações</p>
              </div>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(checked) => handleSettingChange('', 'soundEffects', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdStorage className="h-5 w-5" />
              Preferências de Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Visualização padrão</Label>
                <Select 
                  value={settings.defaultView} 
                  onValueChange={(value) => handleSettingChange('', 'defaultView', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grade</SelectItem>
                    <SelectItem value="list">Lista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-normal">Inscrição automática</Label>
                  <p className="text-xs text-muted-foreground">Entrar automaticamente em cursos sugeridos</p>
                </div>
                <Switch
                  checked={settings.autoEnroll}
                  onCheckedChange={(checked) => handleSettingChange('', 'autoEnroll', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-normal">Mostrar eventos no calendário</Label>
                  <p className="text-xs text-muted-foreground">Sincronizar prazos com seu calendário</p>
                </div>
                <Switch
                  checked={settings.showCalendarEvents}
                  onCheckedChange={(checked) => handleSettingChange('', 'showCalendarEvents', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MdStorage className="h-5 w-5" />
              Dados e Armazenamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Limite de armazenamento</Label>
                <Select 
                  value={settings.storageLimit} 
                  onValueChange={(value) => handleSettingChange('', 'storageLimit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1GB">1 GB</SelectItem>
                    <SelectItem value="5GB">5 GB</SelectItem>
                    <SelectItem value="10GB">10 GB</SelectItem>
                    <SelectItem value="unlimited">Ilimitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Qualidade de download</Label>
                <Select 
                  value={settings.downloadQuality} 
                  onValueChange={(value) => handleSettingChange('', 'downloadQuality', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-normal">Backup automático</Label>
                <p className="text-xs text-muted-foreground">Fazer backup dos seus dados regularmente</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('', 'autoBackup', checked)}
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Uso de armazenamento</p>
              <div className="flex justify-between text-sm">
                <span>2.1 GB usado</span>
                <span>de 5 GB</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};