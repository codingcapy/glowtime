import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/AuthStore";
import { useCreateAppointmentMutation } from "../../lib/api/appointment";
import { GridMode } from "../../routes/dashboard";

type AppointmentSubtype = "haircut" | "hairdye";

export default function BookingService(props: {
  setShowBookingService: (state: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedDate: string | null;
  gridType: GridMode;
}) {
  const { user } = useAuthStore((state) => state);
  const { mutate: createAppointment } = useCreateAppointmentMutation();
  const [subtype, setSubtype] = useState<AppointmentSubtype>("haircut");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const bookingServiceRef = useRef<HTMLDivElement | null>(null);
  const [notification, setNotification] = useState("");
  const [successNotification, setSuccessNotification] = useState("");

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!props.selectedDate) return;
    let duration = 0;
    switch (subtype) {
      case "haircut": {
        duration = 45;
        break;
      }
      case "hairdye": {
        duration = 60;
      }
    }
    let price = 0;
    switch (subtype) {
      case "haircut": {
        price = 40;
        break;
      }
      case "hairdye": {
        price = 50;
      }
    }
    const inputDate = props.selectedDate;
    const inputTime = selectedTime;
    const [hours, minutes] = inputTime.split(":").map(Number);
    const date = new Date(inputDate); // this will be at midnight local time
    date.setHours(hours, minutes, 0, 0);
    const newAppointment = {
      userId: user!.userId,
      date: date.toISOString(),
      type: subtype,
      duration: duration,
      price: price,
    };
    createAppointment(newAppointment, {
      onSuccess: (result) => {
        setNotification("");
        setSuccessNotification("Appointment added successfully!");
      },
      onError: (errorMessage) => {
        setNotification(errorMessage.toString());
        console.log(newAppointment);
      },
    });
  }

  return (
    <div
      ref={bookingServiceRef}
      className="absolute top-0 right-[-10px] bg-[#202020] z-[100] min-h-screen p-5 flex flex-col gap-4"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="text-2xl font-bold mt-5">Select a Service</h2>
        <div className="my-2">
          <input
            type="text"
            placeholder="Search service"
            className="px-2 py-1 outline-none border border-[#5a5a5a]"
          />
        </div>
        <div className="text-xl font-bold mt-5">Hair Salon</div>
        <div
          onClick={() => setSubtype("haircut")}
          className={`my-1 p-1 cursor-pointer hover:bg-[#686868] transition-all ease-in-out duration-300 ${subtype === "haircut" && "bg-[#636363]"}`}
        >
          Hair cut
        </div>
        <div
          onClick={() => setSubtype("hairdye")}
          className={`my-1 p-1 cursor-pointer hover:bg-[#686868] transition-all ease-in-out duration-300 ${subtype === "hairdye" && "bg-[#636363]"}`}
        >
          Hair dye
        </div>
        <div className="text-xl font-bold mt-5">Nail Salon</div>
        <div className="text-xl font-bold mt-5">Makeup Salon</div>
        {props.gridType === "dayGridMonth" && (
          <div className="mt-5">
            <h2 className="text-2xl font-bold">Select a Time</h2>
            {Array.from({ length: 12 }).map((_, i) => {
              const hour = 9 + Math.floor(i / 4); // start at 9 AM
              const minute = (i % 4) * 15;
              const time = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
              return (
                <div
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`cursor-pointer hover:bg-gray-600 p-2 rounded ${selectedTime === time && "bg-[636363]"}`}
                >
                  {time}
                </div>
              );
            })}
          </div>
        )}
        <button className="px-5 py-3 mt-5 bg-cyan-600 rounded font-bold text-center hover:bg-cyan-300 hover:text-[#202020] transition-all ease-in-out duration-300 mx-auto w-[300px]">
          Save
        </button>
      </form>
      <p className="text-center text-red-500">{notification}</p>
      <p className="text-center text-green-500">{successNotification}</p>
    </div>
  );
}
