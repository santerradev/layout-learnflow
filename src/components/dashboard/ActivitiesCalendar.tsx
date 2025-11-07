import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Activity {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  data_entrega: string;
  pontos: number;
  course_id: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Activity;
}

export function ActivitiesCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data: activities, error } = await supabase
        .from('activities')
        .select('*')
        .order('data_entrega', { ascending: true });

      if (error) throw error;

      const calendarEvents: CalendarEvent[] = (activities || []).map((activity: Activity) => {
        const dueDate = new Date(activity.data_entrega);
        return {
          id: activity.id,
          title: `${activity.titulo} - ${activity.tipo}`,
          start: dueDate,
          end: dueDate,
          resource: activity,
        };
      });

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: '4px',
        border: 'none',
        padding: '2px 4px',
      },
    };
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[500px]">
          <p className="text-muted-foreground">Carregando calendário...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Calendário de Atividades</h3>
      <div className="h-[500px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="pt-BR"
          messages={{
            next: 'Próximo',
            previous: 'Anterior',
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'Não há atividades neste período.',
            showMore: (total) => `+ ${total} mais`,
          }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </Card>
  );
}
