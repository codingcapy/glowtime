import { createFileRoute } from "@tanstack/react-router";
import logoImg from "/logo-glowtime.png";
import Footer from "../components/Footer";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col mx-auto min-h-screen">
      <main className="flex-1 mx-auto p-10">
        <div className="flex">
          <img src={logoImg} className="w-[30px]" />
          <div className="text-xl text-cyan-400 text-center pl-2">GlowTime</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
