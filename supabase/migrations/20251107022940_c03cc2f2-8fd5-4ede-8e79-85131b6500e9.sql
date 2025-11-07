-- Criar tabela de cursos
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  professor_id UUID NOT NULL,
  cor_banner TEXT DEFAULT 'bg-primary',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de inscrições em cursos
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Criar tabela de atividades
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL, -- 'tarefa', 'prova', 'projeto', etc
  data_entrega TIMESTAMP WITH TIME ZONE NOT NULL,
  pontos NUMERIC(5, 2) DEFAULT 100.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Políticas para courses
CREATE POLICY "Professores podem criar cursos"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = professor_id);

CREATE POLICY "Professores podem atualizar seus cursos"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = professor_id);

CREATE POLICY "Professores podem deletar seus cursos"
  ON public.courses FOR DELETE
  TO authenticated
  USING (auth.uid() = professor_id);

CREATE POLICY "Usuários podem ver cursos onde estão inscritos ou que são professores"
  ON public.courses FOR SELECT
  TO authenticated
  USING (
    auth.uid() = professor_id OR
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.course_id = courses.id
      AND course_enrollments.user_id = auth.uid()
    )
  );

-- Políticas para course_enrollments
CREATE POLICY "Alunos podem se inscrever em cursos"
  ON public.course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Alunos podem ver suas inscrições"
  ON public.course_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Professores podem ver inscrições de seus cursos"
  ON public.course_enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_enrollments.course_id
      AND courses.professor_id = auth.uid()
    )
  );

CREATE POLICY "Alunos podem cancelar suas inscrições"
  ON public.course_enrollments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para activities
CREATE POLICY "Professores podem criar atividades em seus cursos"
  ON public.activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = activities.course_id
      AND courses.professor_id = auth.uid()
    )
  );

CREATE POLICY "Professores podem atualizar atividades de seus cursos"
  ON public.activities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = activities.course_id
      AND courses.professor_id = auth.uid()
    )
  );

CREATE POLICY "Professores podem deletar atividades de seus cursos"
  ON public.activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = activities.course_id
      AND courses.professor_id = auth.uid()
    )
  );

CREATE POLICY "Usuários inscritos podem ver atividades dos cursos"
  ON public.activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.course_id = activities.course_id
      AND course_enrollments.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = activities.course_id
      AND courses.professor_id = auth.uid()
    )
  );

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();