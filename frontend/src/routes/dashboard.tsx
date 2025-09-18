import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Header from "../components/dashboard/Header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // drag, click
import { useEffect, useRef, useState } from "react";
import { LuCalendar } from "react-icons/lu";
import BookingService from "../components/dashboard/BookingService";
import useAuthStore from "../store/AuthStore";
import { useQuery } from "@tanstack/react-query";
import {
  getAppointmentsByUserIdQueryOptions,
  useDeleteAppointmentMutation,
} from "../lib/api/appointment";
import { Appointment } from "../../../schemas/appointments";
import { FaTrashAlt } from "react-icons/fa";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

export type GridMode = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

function mapAppointmentsToEvents(appointments: Appointment[]) {
  return appointments.map((a) => {
    const start = new Date(a.date);
    const end = new Date(start.getTime() + a.duration * 60 * 1000); // add minutes
    return {
      id: String(a.appointmentId),
      title: a.type, // or something fancier like `${a.type} ($${a.price})`
      start,
      end,
    };
  });
}

function Dashboard() {
  const { user } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const { mutate: deleteAppointment } = useDeleteAppointmentMutation();

  useEffect(() => {
    if (!user) navigate({ to: "/" });
  }, []);

  const { data: appointments } = useQuery(
    getAppointmentsByUserIdQueryOptions(user?.userId || "")
  );

  const eventsData = appointments ? mapAppointmentsToEvents(appointments) : [];

  const [contextMenu, setContextMenu] = useState<{
    title: string;
    visible: boolean;
    isEvent: boolean;
    x: number;
    y: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showBookingService, setShowBookingService] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [gridType, setGridType] = useState<GridMode>("dayGridMonth");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

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
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          editable={true}
          selectable={true}
          events={eventsData}
          datesSet={(arg) => {
            setGridType(arg.view.type as GridMode);
          }}
          eventClick={(info) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const scrollTop = containerRef.current?.scrollTop || 0;
            info.jsEvent.preventDefault();
            info.jsEvent.stopPropagation();
            const appointment = appointments?.find(
              (a) => String(a.appointmentId) === info.event.id
            );

            setSelectedAppointment(appointment || null);
            console.log(appointment);
            setContextMenu({
              title: info.event.title,
              visible: true,
              isEvent: true,
              x: info.jsEvent.clientX - (rect?.left ?? 0) - 250,
              y: info.jsEvent.clientY - (rect?.top ?? 0) + scrollTop - 5,
            });
          }}
          dateClick={(info) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const scrollTop = containerRef.current?.scrollTop || 0;
            const clickedDate = info.date;
            const dateStr = clickedDate.toISOString().split("T")[0]; // YYYY-MM-DD
            const timeStr = clickedDate.toTimeString().slice(0, 5); // HH:mm
            setSelectedDate(dateStr);
            setSelectedAppointment(null);
            if (gridType === "timeGridWeek" || gridType === "timeGridDay") {
              setSelectedTime(timeStr);
            } else {
              setSelectedTime("");
            }
            setContextMenu({
              title: `${dateStr} ${gridType !== "dayGridMonth" ? timeStr : ""}`,
              visible: true,
              isEvent: false,
              x: info.jsEvent.clientX - (rect?.left ?? 0) - 250,
              y: info.jsEvent.clientY - (rect?.top ?? 0) + scrollTop - 50,
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
              {contextMenu.isEvent ? (
                <div>
                  <div
                    onClick={() => setShowBookingService(true)}
                    className="flex p-3 cursor-pointer hover:bg-[#5b5b5b] transition-all ease-in-out duration-300"
                  >
                    <LuCalendar className="mr-2 mt-1" />
                    <div>Edit Appointment</div>
                  </div>
                  <div
                    onClick={() => {
                      deleteAppointment({
                        userId: selectedAppointment?.userId || "",
                        appointmentId: selectedAppointment?.appointmentId || 0,
                      });
                      setContextMenu(null);
                    }}
                    className="flex p-3 cursor-pointer hover:bg-[#5b5b5b] transition-all ease-in-out duration-300 text-red-400"
                  >
                    <FaTrashAlt className="mr-2 mt-1" />
                    <div>Delete Appointment</div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setShowBookingService(true)}
                  className="flex p-3 cursor-pointer hover:bg-[#5b5b5b] transition-all ease-in-out duration-300"
                >
                  <LuCalendar className="mr-2 mt-1" />
                  <div>Add appointment</div>
                </div>
              )}
            </div>
          </div>
        )}
        {showBookingService && (
          <BookingService
            setShowBookingService={setShowBookingService}
            containerRef={containerRef}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            gridType={gridType}
            selectedAppointment={selectedAppointment}
          />
        )}
      </main>
    </div>
  );
}
