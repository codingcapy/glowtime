import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/dashboard/Header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // drag, click
import { useEffect, useRef, useState } from "react";
import { LuCalendar } from "react-icons/lu";
import BookingService from "../components/dashboard/BookingService";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
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
  const [contextMenu, setContextMenu] = useState<{
    title: string;
    visible: boolean;
    x: number;
    y: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showBookingService, setShowBookingService] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setContextMenu(null);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col min-h-screen">
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
            console.log("clicked event");
            setContextMenu({
              title: info.event.title,
              visible: true,
              x: info.jsEvent.clientX,
              y: info.jsEvent.clientY,
            });
          }}
          dateClick={(info) => {
            setContextMenu({
              title: info.dateStr,
              visible: true,
              x: info.jsEvent.clientX - 250,
              y: info.jsEvent.clientY - 50,
            });
          }}
        />
        {contextMenu?.visible && (
          <div
            ref={menuRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="absolute bg-[#1A1A1A] z-[99] border border-[#555555] rounded"
            style={{ top: contextMenu?.y, left: contextMenu?.x }}
          >
            <div className="p-3 bg-[#606060] text-lg font-bold">
              {contextMenu.title}
            </div>
            <div className="p-1">
              <div
                onClick={() => setShowBookingService(true)}
                className="flex p-3 cursor-pointer hover:bg-[#5b5b5b] transition-all ease-in-out duration-300"
              >
                <LuCalendar className="mr-2 mt-1" />
                <div>Add appointment</div>
              </div>
            </div>
          </div>
        )}
        {showBookingService && (
          <BookingService
            setShowBookingService={setShowBookingService}
            containerRef={containerRef}
          />
        )}
      </main>
    </div>
  );
}
