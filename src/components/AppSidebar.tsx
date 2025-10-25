import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  MdHome, 
  MdSchool, 
  MdAssignment, 
  MdPeople, 
  MdFolder,
  MdSettings,
  MdNotifications,
  MdAdminPanelSettings,
  MdDashboard,
  MdChat
} from "react-icons/md";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const mainItems = [
  { title: "Início", url: "/", icon: MdHome },
  { title: "Dashboard", url: "/admin", icon: MdDashboard },
  { title: "Meus Cursos", url: "/cursos", icon: MdSchool },
  { title: "Atividades", url: "/atividades", icon: MdAssignment },
  { title: "Usuários", url: "/usuarios", icon: MdPeople },
  { title: "Materiais", url: "/materiais", icon: MdFolder },
  { title: "Chat", url: "/chat", icon: MdChat },
];

const settingsItems = [
  { title: "Perfil", url: "/perfil", icon: MdPeople },
  { title: "Notificações", url: "/notificacoes", icon: MdNotifications },
  { title: "Configurações", url: "/configuracoes", icon: MdSettings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id)
        .eq('role', 'admin')
        .single();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            L
          </div>
          {state === "expanded" && (
            <span className="font-semibold text-foreground">LearnFlow</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administrador</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin" className={getNavClass}>
                      <MdAdminPanelSettings className="h-4 w-4" />
                      <span>Dashboard Admin</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}