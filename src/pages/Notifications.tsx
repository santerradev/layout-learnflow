import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MdNotifications,
  MdMarkEmailRead,
  MdMarkEmailUnread,
  MdDelete,
  MdSettings,
  MdSchool,
  MdAssignment,
  MdPeople,
  MdAnnouncement
} from 'react-icons/md';
import { useToast } from '@/hooks/use-toast';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'assignment',
    title: 'Nova atividade postada',
    message: 'Prof. Ana Silva postou uma nova lista de exercícios em Matemática Avançada',
    course: 'Matemática Avançada',
    time: '2 horas atrás',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'announcement',
    title: 'Aviso importante',
    message: 'Lembrete: prova de História do Brasil será na próxima quinta-feira',
    course: 'História do Brasil',
    time: '4 horas atrás',
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'grade',
    title: 'Nota disponível',
    message: 'Sua nota para o trabalho de Física está disponível',
    course: 'Física Moderna',
    time: '1 dia atrás',
    read: true,
    priority: 'low'
  },
  {
    id: '4',
    type: 'message',
    title: 'Nova mensagem',
    message: 'João Pedro enviou uma mensagem sobre o projeto em grupo',
    course: 'Matemática Avançada',
    time: '2 dias atrás',
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'course',
    title: 'Novo curso disponível',
    message: 'Você foi adicionado ao curso de Química Orgânica',
    course: 'Química Orgânica',
    time: '3 dias atrás',
    read: true,
    priority: 'medium'
  }
];

/**
 * Notifications page - Notification center and settings
 */
export const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentNotifications: true,
    announcementNotifications: true,
    gradeNotifications: true,
    messageNotifications: true,
    courseNotifications: false
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <MdAssignment className="h-5 w-5 text-blue-600" />;
      case 'announcement':
        return <MdAnnouncement className="h-5 w-5 text-orange-600" />;
      case 'grade':
        return <MdSchool className="h-5 w-5 text-green-600" />;
      case 'message':
        return <MdPeople className="h-5 w-5 text-purple-600" />;
      case 'course':
        return <MdSchool className="h-5 w-5 text-indigo-600" />;
      default:
        return <MdNotifications className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: false } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      title: "Notificação removida",
      description: "A notificação foi excluída com sucesso.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    toast({
      title: "Todas marcadas como lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    });
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast({
      title: "Configuração atualizada",
      description: "Suas preferências de notificação foram salvas.",
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MdNotifications className="h-8 w-8" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Acompanhe todas as suas notificações e configure suas preferências
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <MdMarkEmailRead className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{notification.course}</span>
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                          className="h-8 w-8"
                        >
                          {notification.read ? (
                            <MdMarkEmailUnread className="h-4 w-4" />
                          ) : (
                            <MdMarkEmailRead className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <MdDelete className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {notifications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <MdNotifications className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium text-foreground">
                    Nenhuma notificação
                  </h3>
                  <p className="text-muted-foreground">
                    Você está em dia! Não há notificações pendentes.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdSettings className="h-5 w-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Métodos de Notificação</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-sm">
                    Notificações por Email
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="text-sm">
                    Notificações Push
                  </Label>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Tipos de Notificação</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="assignment-notifications" className="text-sm">
                    Atividades
                  </Label>
                  <Switch
                    id="assignment-notifications"
                    checked={settings.assignmentNotifications}
                    onCheckedChange={(checked) => handleSettingChange('assignmentNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="announcement-notifications" className="text-sm">
                    Avisos
                  </Label>
                  <Switch
                    id="announcement-notifications"
                    checked={settings.announcementNotifications}
                    onCheckedChange={(checked) => handleSettingChange('announcementNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="grade-notifications" className="text-sm">
                    Notas
                  </Label>
                  <Switch
                    id="grade-notifications"
                    checked={settings.gradeNotifications}
                    onCheckedChange={(checked) => handleSettingChange('gradeNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="message-notifications" className="text-sm">
                    Mensagens
                  </Label>
                  <Switch
                    id="message-notifications"
                    checked={settings.messageNotifications}
                    onCheckedChange={(checked) => handleSettingChange('messageNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="course-notifications" className="text-sm">
                    Novos Cursos
                  </Label>
                  <Switch
                    id="course-notifications"
                    checked={settings.courseNotifications}
                    onCheckedChange={(checked) => handleSettingChange('courseNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Não lidas</span>
                  <Badge variant="destructive">{unreadCount}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total hoje</span>
                  <Badge variant="outline">
                    {notifications.filter(n => n.time.includes('hora')).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <Badge variant="secondary">{notifications.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};