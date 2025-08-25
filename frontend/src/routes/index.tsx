import { createFileRoute } from "@tanstack/react-router";
import logoImg from "/logo-glowtime.png";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col mx-auto min-h-screen">
      <Header />
      <main className="flex-1 mx-auto p-10 pt-[80px]">
        <div className="flex">
          <img src={logoImg} className="w-[30px]" />
          <div className="text-xl text-cyan-300 text-center pl-2">GlowTime</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
