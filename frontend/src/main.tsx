import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { createRouter, Link, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./components/auth/Auth";

export const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultNotFoundComponent: () => {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-[#040406] text-white p-3 pt-[100px]">
          <p className="text-white text-xl md:text-4xl text-center pt-10 md:pt-32">
            Whoops! This isn't what you're looking for 😅
          </p>
          <div className="flex flex-col my-10 md:my-20 mx-auto w-[250px]">
            <Link
              to="/"
              className="py-2 px-10 rounded bg-cyan-600 text-center tracking-widest"
            >
              LET'S GO HOME
            </Link>
          </div>
        </main>
      </div>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <Auth>
        <RouterProvider router={router} />
      </Auth>
    </QueryClientProvider>
  );
}
