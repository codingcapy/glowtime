import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex-1 p-10 pt-[80px] max-w-[800px] mx-auto">
      <h1 className="pb-5 text-center text-4xl md:text-6xl font-bold">
        Contact us
      </h1>
      <h2 className="text-center pb-10">
        We'd love to hear from you. Send us a message!
      </h2>
      <form action="" className="relative z-2 flex flex-col mx-auto">
        <input
          type="text"
          placeholder="Email"
          className="mx-auto border p-2 my-2 w-[300px] md:w-[400px]"
        />
        <textarea
          placeholder="Your message"
          className="mx-auto border p-2 my-2 w-[300px] md:w-[400px]"
          rows={10}
        />
        <button className="py-2 px-5 my-3 text-2xl tracking-widest font-bold bg-cyan-600 w-[200px] md:w-[300px] mx-auto hover:bg-cyan-300 hover:text-[#202020] transition-all ease-in-out duration-300">
          SEND
        </button>
      </form>
    </main>
  );
}
