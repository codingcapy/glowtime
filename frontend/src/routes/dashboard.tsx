import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/dashboard/Header";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col mx-auto p-10 pt-[80px]">
        <Header />
        <div>Hello "/dashboard"!</div>
      </main>
    </div>
  );
}
