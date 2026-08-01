import { createFileRoute, Outlet } from "@tanstack/react-router";
import { EaStyles } from "@/components/rsp-ethical-auction";
import { GlossarySheetProvider } from "@/components/rsp-macro/MacroGlossary";

export const Route = createFileRoute("/rsp/ethical-auction")({
  component: EthicalAuctionLayout,
});

function EthicalAuctionLayout() {
  return (
    <GlossarySheetProvider showOnDesktop>
      <EaStyles />
      <Outlet />
    </GlossarySheetProvider>
  );
}
