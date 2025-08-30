import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_header/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex-1 p-10 pt-[80px] text-center max-w-[1000px] mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Where Beauty Meets Business</h1>
        <p className="py-5">
          Running a salon is more than hair, nails, and skincare—it’s about
          creating an experience. GlowTime is here to make sure your business
          side runs just as beautifully as the services you provide.
        </p>
        <p>
          We built GlowTime as the ultimate CRM for beauty salons, blending all
          the tools you need to stay booked, stay connected, and stay
          profitable—without the stress.
        </p>
      </div>
      <div className="mb-10">
        <h2 className="text-4xl font-bold">Book. Glow. Repeat.</h2>
        <p className="py-5">
          Say goodbye to messy calendars and no-shows. With GlowTime’s smart
          scheduling and online booking, clients can book whenever they want,
          and you can manage appointments effortlessly.
        </p>
      </div>
      <div className="mb-10">
        <h2 className="text-4xl font-bold">Every Client, A VIP</h2>
        <p className="py-5">
          Keep track of preferences, past services, and notes—all in one place.
          GlowTime makes every visit feel personal, so your clients feel seen,
          valued, and pampered.
        </p>
      </div>
      <div className="mb-10">
        <h2 className="text-4xl font-bold">Beauty Boss, Backed by Data</h2>
        <p className="py-5">
          From sales tracking to easy-to-read reports, GlowTime shows you
          exactly how your salon is performing. Spot trends, measure growth, and
          make smarter business moves with confidence.
        </p>
      </div>
      <div className="mb-10">
        <h2 className="text-4xl font-bold">Email That Turns Heads</h2>
        <p className="py-5">
          GlowTime gives you built-in email marketing tools to send promos,
          seasonal offers, and appointment reminders. Stay top of mind—and keep
          chairs full.
        </p>
      </div>
      <div className="mb-10">
        <h2 className="text-4xl font-bold">Stress-Free Finances</h2>
        <p className="py-5">
          No more juggling spreadsheets. GlowTime’s accounting integration keeps
          your books balanced and your business on track, so you can focus on
          what you love.
        </p>
      </div>
      <div className="mb-10">
        <h2 className="text-4xl font-bold">Your Salon’s Glow-Up Starts Here</h2>
        <p className="py-5">
          GlowTime isn’t just software—it’s your behind-the-scenes partner. We
          help you shine in what you do best while making sure your business
          runs smoothly, profitably, and beautifully.
        </p>
      </div>
      <Link
        to="/signup"
        className="px-5 py-3 mt-5 bg-cyan-600 rounded font-bold text-center hover:bg-cyan-300 hover:text-[#202020] transition-all ease-in-out duration-300"
      >
        Get Started
      </Link>
    </main>
  );
}
