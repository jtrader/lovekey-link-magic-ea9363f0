import { definePage, Outlet } from "@/lib/router";
import { EaStyles } from "@/components/rsp-ethical-auction";
import { GlossarySheetProvider } from "@/components/rsp-macro/MacroGlossary";

export const Route = definePage("/rsp/ethical-auction")({
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
