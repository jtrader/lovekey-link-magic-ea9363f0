import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/rsp_/macro/")({
  beforeLoad: () => {
    throw redirect({ to: "/rsp/macro/overview" });
  },
});
