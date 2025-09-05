import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";

export default function BookingService(props: {
  setShowBookingService: (state: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const bookingServiceRef = useRef<HTMLDivElement | null>(null);

  function handleClickOutside(event: MouseEvent) {
    if (
      bookingServiceRef.current &&
      !bookingServiceRef.current.contains(event.target as Node)
    ) {
      props.setShowBookingService(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (!selectedDate || !time) return;
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes);
  };

  return (
    <div
      ref={bookingServiceRef}
      className="absolute top-0 right-0 bg-[#202020] z-[100] min-h-screen p-3 flex flex-col gap-4"
    >
      <DayPicker mode="single" />
      <div className="grid grid-cols-4 gap-2">
        {["09:00", "10:00", "11:00", "14:00", "15:00"].map((slot) => (
          <button
            key={slot}
            onClick={() => setTime(slot)}
            className={`p-2 rounded ${
              time === slot ? "bg-cyan-600 text-white" : "bg-gray-200"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 p-3 bg-cyan-600 text-white rounded-lg"
      >
        Confirm Appointment
      </button>
    </div>
  );
}
