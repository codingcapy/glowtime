import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Appointment } from "../../../../schemas/appointments";
import { ArgumentTypes, client, ExtractData } from "./client";

type CreateAppointmentArgs = ArgumentTypes<
  typeof client.api.v0.appointments.$post
>[0]["json"];

type SerializeAppointment = ExtractData<
  Awaited<ReturnType<typeof client.api.v0.appointments.$get>>
>["appointments"][number];

export function mapSerializedAppointmentToSchema(
  SerializedAppointment: SerializeAppointment
): Appointment {
  return {
    ...SerializedAppointment,
    date: new Date(SerializedAppointment.date),
    createdAt: new Date(SerializedAppointment.createdAt),
  };
}

async function createAppointment(args: CreateAppointmentArgs) {
  const res = await client.api.v0.appointments.$post({ json: args });
  if (!res.ok) {
    let errorMessage =
      "There was an issue creating your appointment :( We'll look into it ASAP!";
    try {
    } catch (error) {}
    throw new Error(errorMessage);
  }
  const result = await res.json();
  return result.appointment;
}

export const useCreateAppointmentMutation = (
  onError?: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSettled: (_data, _error, args) => {
      if (!args) return console.log(args, "create args, returning");
      queryClient.invalidateQueries({
        queryKey: ["appointments", args.userId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function getAppointmentsByUserId(userId: string) {
  const res = await client.api.v0.appointments[":userId"].$get({
    param: { userId: userId.toString() },
  });
  if (!res.ok) {
    throw new Error("Error getting appointments by userId");
  }
  const { appointments } = await res.json();
  return appointments.map(mapSerializedAppointmentToSchema);
}

export const getAppointmentsByUserIdQueryOptions = (args: string) =>
  queryOptions({
    queryKey: ["appointments", args],
    queryFn: () => getAppointmentsByUserId(args),
  });
