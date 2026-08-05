import { createRouteFn, Outlet } from "@/lib/tanstack-shim";
import { EaStyles } from "@/components/rsp-ethical-auction";
import { GlossarySheetProvider } from "@/components/rsp-macro/MacroGlossary";

export const Route = createRouteFn("/rsp/ethical-auction")({
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
