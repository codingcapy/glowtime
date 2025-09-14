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
    if (
      !props.selectedDate ||
      (props.gridType === "dayGridMonth" && selectedTime === "")
    )
      return setNotification("Please select a time");
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
    const [year, month, day] = inputDate.split("-").map(Number);
    const inputTime = selectedTime;
    const [hours, minutes] = inputTime.split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
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
        setNotification("Appointment added successfully!");
        props.setShowBookingService(false);
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
      className="fixed top-0 right-[-10px] bg-[#202020] border-l border-[#4c4c4c] z-[100] h-screen px-5 flex flex-col gap-4 overflow-y-auto scrollbar-thin"
    >
      <div
        onClick={() => props.setShowBookingService(false)}
        className="text-right font-bold p-5 cursor-pointer"
      >
        x
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold">Select a Service</h2>
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
            {Array.from({ length: 48 }).map((_, i) => {
              const hour = 9 + Math.floor(i / 4); // start at 9 AM
              const minute = (i % 4) * 15;
              const time = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
              return (
                <div
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`cursor-pointer hover:bg-gray-600 p-2 rounded ${selectedTime === time && "bg-[#636363]"}`}
                >
                  {time}
                </div>
              );
            })}
          </div>
        )}
        <div className="fixed bottom-0 right-0 bg-[#202020] w-[250px] h-[120px] flex flex-col">
          <button className="px-5 py-3 mt-5 bg-cyan-600 rounded font-bold text-center hover:bg-cyan-300 hover:text-[#202020] transition-all ease-in-out duration-300 mx-auto w-[100px]">
            Save
          </button>
          <p
            className={`${notification === "Appointment added successfully!" ? "text-green-500" : "text-yellow-500"} text-center pt-2`}
          >
            {notification}
          </p>
        </div>
      </form>
    </div>
  );
}
