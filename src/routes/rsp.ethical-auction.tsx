import { createFileRoute, Outlet } from "@tanstack/react-router";
import { EaStyles } from "@/components/rsp-ethical-auction";
import { EaGlossaryCallout } from "@/components/rsp-ea-glossary";
import { GlossarySheetProvider } from "@/components/rsp-macro/MacroGlossary";

export const Route = createFileRoute("/rsp/ethical-auction")({
  component: EthicalAuctionLayout,
});

function EthicalAuctionLayout() {
  return (
    <GlossarySheetProvider showOnDesktop>
      <EaStyles />
      <EaGlossaryCallout />
      <Outlet />
    </GlossarySheetProvider>
  );
}
