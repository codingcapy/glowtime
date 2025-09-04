import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/dashboard/Header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // drag, click
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Hair Cut (Men)",
      start: new Date().toISOString(),
      end: new Date(new Date().getTime() + 30 * 60000).toISOString(),
    },
    {
      id: "2",
      title: "Hair Cut (Women)",
      start: new Date(new Date().getTime() + 60 * 60000).toISOString(),
      end: new Date(new Date().getTime() + 120 * 60000).toISOString(),
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col mx-auto p-4 pt-[80px] w-full">
        <Header />

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          editable={true}
          selectable={true}
          events={events}
          eventClick={(info) => {
            alert(`Clicked on: ${info.event.title}`);
          }}
          dateClick={(info) => {
            alert(`Clicked date: ${info.dateStr}`);
          }}
        />
      </main>
    </div>
  );
}
