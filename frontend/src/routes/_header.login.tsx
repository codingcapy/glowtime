import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <main className="flex-1 p-10 pt-[80px]">Hello "/login"!</main>;
}
