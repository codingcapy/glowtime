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
      className="absolute top-0 right-[-10px] bg-[#202020] z-[100] min-h-screen p-5 flex flex-col gap-4"
    >
      <form className="flex flex-col">
        <h2 className="text-2xl font-bold mt-5">Select a Service</h2>
        <div>Search service</div>
        <div className="text-xl font-bold mt-5">Hair Salon</div>
        <div className="my-1 p-1">Hair cut</div>
        <div className="my-1 p-1">Hair dye</div>
        <div className="text-xl font-bold mt-5">Nail Salon</div>
        <div className="text-xl font-bold mt-5">Makeup Salon</div>
        <h2 className="text-2xl font-bold mt-5">Select a Time</h2>
        <button className="px-5 py-3 mt-5 bg-cyan-600 rounded font-bold text-center hover:bg-cyan-300 hover:text-[#202020] transition-all ease-in-out duration-300 mx-auto w-[300px]">
          Save
        </button>
      </form>
    </div>
  );
}
