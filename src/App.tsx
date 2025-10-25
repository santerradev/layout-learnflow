import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/MainLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Course } from "./pages/Course";
import { Lesson } from "./pages/Lesson";
import { Courses } from "./pages/Courses";
import { Activities } from "./pages/Activities";
import { People } from "./pages/Users";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Materials } from "./pages/Materials";
import { Profile } from "./pages/Profile";
import { Notifications } from "./pages/Notifications";
import { Settings } from "./pages/Settings";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="learnflow-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Index />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cursos" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Courses />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/atividades" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Activities />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/usuarios" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <People />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/materiais" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Materials />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/curso/:id" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Course />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/curso/:id/aula/:lessonId" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Lesson />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notificacoes" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Notifications />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
