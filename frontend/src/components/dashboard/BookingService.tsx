import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";

export default function BookingService() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      fetch("/api/v0/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((res) => res.json()),
  });

  const handleSubmit = () => {
    if (!selectedDate || !time) return;
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes);

    mutation.mutate({
      customerName: "John Doe",
      customerEmail: "john@example.com",
      date: dateTime.toISOString(),
    });
  };

  return (
    <div className="flex flex-col gap-4">
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
