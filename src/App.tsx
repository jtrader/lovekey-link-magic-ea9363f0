import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route as BrowserRoute, Routes, useParams } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import type { AppRoute } from "@/lib/router";

import { Route as HomeRoute } from "@/routes/index";
import { Route as LoginRoute } from "@/routes/login";
import { Route as InviteRoute } from "@/routes/invite.$token";
import { Route as SharedResultRoute } from "@/routes/r.$token";
import { Route as QuizRoute } from "@/routes/quiz";
import { Route as QuizAdminRoute } from "@/routes/quiz_.admin";
import { Route as AdminRoute } from "@/routes/admin";
import { Route as AuthRoute } from "@/routes/_authenticated";
import { Route as AppRouteModule } from "@/routes/_authenticated.app";
import { Route as OnboardingRoute } from "@/routes/_authenticated.onboarding";
import { Route as RspRoute } from "@/routes/rsp";
import { Route as RspIndexRoute } from "@/routes/rsp.index";
import { Route as RspPrinciplesRoute } from "@/routes/rsp.principles";
import { Route as RspHowItWorksRoute } from "@/routes/rsp.how-it-works";
import { Route as RspDimensionsRoute } from "@/routes/rsp.dimensions";
import { Route as RspChecklistRoute } from "@/routes/rsp.checklist";
import { Route as RspImplementationsRoute } from "@/routes/rsp.implementations";
import { Route as RspCaseStudiesRoute } from "@/routes/rsp.case-studies.index";
import { Route as RspCaseStudyRoute } from "@/routes/rsp.case-studies.$slug";
import { Route as RspEventTokenRoute } from "@/routes/rsp.event-token";
import { Route as RspDevelopersRoute } from "@/routes/rsp.for-developers";
import { Route as RspGovernanceRoute } from "@/routes/rsp.governance";
import { Route as RspFaqRoute } from "@/routes/rsp.faq";
import { Route as RspAvatarsRoute } from "@/routes/rsp.avatars";
import { Route as RspAvatarCreatorRoute } from "@/routes/rsp.avatar-creator";
import { Route as RspSpecCheckRoute } from "@/routes/rsp.spec-check";
import { Route as EthicalAuctionRoute } from "@/routes/rsp.ethical-auction";
import { Route as EthicalAuctionIndexRoute } from "@/routes/rsp.ethical-auction.index";
import { Route as EthicalAuctionIntentRoute } from "@/routes/rsp.ethical-auction.intent";
import { Route as EthicalAuctionCapacityRoute } from "@/routes/rsp.ethical-auction.capacity";
import { Route as EthicalAuctionExperienceRoute } from "@/routes/rsp.ethical-auction.experience";
import { Route as EthicalAuctionEquilibriumRoute } from "@/routes/rsp.ethical-auction.equilibrium";
import { Route as EthicalAuctionAdoptionRoute } from "@/routes/rsp.ethical-auction.adoption";
import { Route as MacroIndexRoute } from "@/routes/rsp_.macro.index";
import { Route as MacroOverviewRoute } from "@/routes/rsp_.macro.overview";
import { Route as MacroTelemetryRoute } from "@/routes/rsp_.macro.telemetry";
import { Route as MacroVesFormulaRoute } from "@/routes/rsp_.macro.ves-formula";
import { Route as MacroCalibrationRoute } from "@/routes/rsp_.macro.calibration";
import { Route as MacroGovernanceRoute } from "@/routes/rsp_.macro.governance";
import { PulseOverviewPage } from "@/pages/rsp/pulse/PulseOverviewPage";
import { PulseStrainEnginePage } from "@/pages/rsp/pulse/PulseStrainEnginePage";
import { PulseDisasterAidPage } from "@/pages/rsp/pulse/PulseDisasterAidPage";
import { PulseSpecPage } from "@/pages/rsp/pulse/PulseSpecPage";

const queryClient = new QueryClient();

function RouteView({ route }: { route: AppRoute }) {
  const params = useParams();
  let loaderData: unknown;
  let loadError = false;
  try {
    loaderData = route.loader?.({ params });
  } catch {
    loadError = true;
  }

  useEffect(() => {
    const head = route.head?.({ loaderData, params });
    const title = head?.meta?.find((item) => "title" in item)?.title;
    if (typeof title === "string") document.title = title;
  }, [loaderData, params, route]);

  if (loadError) {
    const NotFound = route.notFoundComponent;
    return NotFound ? <NotFound /> : <NotFoundPage />;
  }

  const Component = route.component;
  return Component ? <Component /> : null;
}

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">Page not found.</p>
        <a className="mt-6 inline-block text-primary hover:underline" href="/">
          Go home
        </a>
      </div>
    </main>
  );
}

function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return children;
}

const view = (route: AppRoute) => <RouteView route={route} />;

function AppRoutes() {
  return (
    <Routes>
      <BrowserRoute path="/" element={view(HomeRoute)} />
      <BrowserRoute path="/login" element={view(LoginRoute)} />
      <BrowserRoute path="/invite/:token" element={view(InviteRoute)} />
      <BrowserRoute path="/r/:token" element={view(SharedResultRoute)} />
      <BrowserRoute path="/quiz" element={view(QuizRoute)} />
      <BrowserRoute path="/quiz/admin" element={view(QuizAdminRoute)} />
      <BrowserRoute path="/admin" element={view(AdminRoute)} />

      <BrowserRoute element={view(AuthRoute)}>
        <BrowserRoute path="/app" element={view(AppRouteModule)} />
        <BrowserRoute path="/onboarding" element={view(OnboardingRoute)} />
      </BrowserRoute>

      <BrowserRoute path="/rsp/macro" element={view(MacroIndexRoute)} />
      <BrowserRoute path="/rsp/macro/overview" element={view(MacroOverviewRoute)} />
      <BrowserRoute path="/rsp/macro/telemetry" element={view(MacroTelemetryRoute)} />
      <BrowserRoute path="/rsp/macro/ves-formula" element={view(MacroVesFormulaRoute)} />
      <BrowserRoute path="/rsp/macro/calibration" element={view(MacroCalibrationRoute)} />
      <BrowserRoute path="/rsp/macro/governance" element={view(MacroGovernanceRoute)} />
      <BrowserRoute
        path="/rsp/pulse"
        element={
          <StaticPage title="@rsp/pulse — Global Population Pulse · Love Key Link">
            <PulseOverviewPage />
          </StaticPage>
        }
      />
      <BrowserRoute
        path="/rsp/pulse/strain-engine"
        element={
          <StaticPage title="Event Strain Index · @rsp/pulse">
            <PulseStrainEnginePage />
          </StaticPage>
        }
      />
      <BrowserRoute
        path="/rsp/pulse/applications/disaster-aid"
        element={
          <StaticPage title="Disaster & Humanitarian Aid Framework · @rsp/pulse">
            <PulseDisasterAidPage />
          </StaticPage>
        }
      />
      <BrowserRoute
        path="/rsp/pulse/spec"
        element={
          <StaticPage title="@rsp/pulse v1.0 Open Specification · Love Key Link">
            <PulseSpecPage />
          </StaticPage>
        }
      />

      <BrowserRoute path="/rsp" element={view(RspRoute)}>
        <BrowserRoute index element={view(RspIndexRoute)} />
        <BrowserRoute path="principles" element={view(RspPrinciplesRoute)} />
        <BrowserRoute path="how-it-works" element={view(RspHowItWorksRoute)} />
        <BrowserRoute path="dimensions" element={view(RspDimensionsRoute)} />
        <BrowserRoute path="checklist" element={view(RspChecklistRoute)} />
        <BrowserRoute path="implementations" element={view(RspImplementationsRoute)} />
        <BrowserRoute path="case-studies" element={view(RspCaseStudiesRoute)} />
        <BrowserRoute path="case-studies/:slug" element={view(RspCaseStudyRoute)} />
        <BrowserRoute path="event-token" element={view(RspEventTokenRoute)} />
        <BrowserRoute path="for-developers" element={view(RspDevelopersRoute)} />
        <BrowserRoute path="governance" element={view(RspGovernanceRoute)} />
        <BrowserRoute path="faq" element={view(RspFaqRoute)} />
        <BrowserRoute path="avatars" element={view(RspAvatarsRoute)} />
        <BrowserRoute path="avatar-creator" element={view(RspAvatarCreatorRoute)} />
        <BrowserRoute path="spec-check" element={view(RspSpecCheckRoute)} />
        <BrowserRoute path="ethical-auction" element={view(EthicalAuctionRoute)}>
          <BrowserRoute index element={view(EthicalAuctionIndexRoute)} />
          <BrowserRoute path="intent" element={view(EthicalAuctionIntentRoute)} />
          <BrowserRoute path="capacity" element={view(EthicalAuctionCapacityRoute)} />
          <BrowserRoute path="experience" element={view(EthicalAuctionExperienceRoute)} />
          <BrowserRoute path="equilibrium" element={view(EthicalAuctionEquilibriumRoute)} />
          <BrowserRoute path="adoption" element={view(EthicalAuctionAdoptionRoute)} />
        </BrowserRoute>
      </BrowserRoute>

      <BrowserRoute path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster richColors position="top-center" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
