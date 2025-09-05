import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reset")({
  component: ResetPage,
});

function ResetPage() {
  return <div>Hello "/reset"!</div>;
}
