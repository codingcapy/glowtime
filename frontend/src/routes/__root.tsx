import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className="bg-[#202020] text-white px-5">
        <Outlet />
      </div>
    </React.Fragment>
  );
}
