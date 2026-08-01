import { createFileRoute, Outlet } from "@tanstack/react-router";
import { EaStyles } from "@/components/rsp-ethical-auction";

export const Route = createFileRoute("/rsp/ethical-auction")({
  component: EthicalAuctionLayout,
});

function EthicalAuctionLayout() {
  return (
    <>
      <EaStyles />
      <Outlet />
    </>
  );
}
