import { createFileRoute, Link } from "@tanstack/react-router";
import logoImg from "/logo-glowtime.png";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col mx-auto p-10 pt-[80px]">
        <div className="flex mx-auto">
          <img src={logoImg} className="w-[30px]" />
          <h1 className="text-4xl text-cyan-300 font-bold text-center pl-2">
            GlowTime
          </h1>
        </div>
        <h2 className="text-xl text-center my-5 mx-auto">
          The #1 CRM software for your business.
        </h2>
        <Link
          to="/signup"
          className="px-5 py-3 mt-5 bg-cyan-600 rounded font-bold text-center hover:bg-cyan-300 hover:text-[#202020] transition-all ease-in-out duration-300"
        >
          Get Started
        </Link>
      </main>
      <Footer />
    </div>
  );
}
