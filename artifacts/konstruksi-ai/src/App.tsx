import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import HomePage from "@/app/page";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import DashboardPage from "@/app/dashboard/page";
import ProfilePage from "@/app/profile/page";
import ChatPage from "@/app/chat/page";
import KonstruksiPage from "@/app/konstruksi/page";
import EnergiPage from "@/app/energi/page";
import MigasPage from "@/app/migas/page";
import TenderPage from "@/app/tender/page";
import ManajemenPage from "@/app/manajemen/page";
import PerijinanPage from "@/app/perijinan/page";
import PricingPage from "@/app/pricing/page";
import MatrixPage from "@/app/matrix/page";
import BrainPage from "@/app/brain/page";
import BimtekPage from "@/app/bimtek/page";
import CertifyPage from "@/app/certify/page";
import LearnPage from "@/app/learn/page";
import LearnSlugPage from "@/app/learn/[slug]/page";
import SolvePage from "@/app/solve/page";
import SolveSlugPage from "@/app/solve/[slug]/page";
import SolverPage from "@/app/solver/page";
import ToolsPage from "@/app/tools/page";
import SimulasiPage from "@/app/simulasi/page";
import EvidenceMappingPage from "@/app/evidence-mapping/page";
import KnowledgePage from "@/app/knowledge/page";
import KnowledgeArticlePage from "@/app/knowledge/article/[slug]/page";
import LegalLicensingPage from "@/app/legal-licensing/page";
import SbuReadinessPage from "@/app/sbu-readiness/page";
import SkkReadinessPage from "@/app/skk-readiness/page";
import TenderEligibilityPage from "@/app/tender-eligibility/page";
import TenderIntelligencePage from "@/app/tender-intelligence/page";
import WorkforceAssignmentPage from "@/app/workforce-assignment/page";
import AgentPage from "@/app/agent/[businessId]/[columnId]/page";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/konstruksi" component={KonstruksiPage} />
      <Route path="/energi" component={EnergiPage} />
      <Route path="/migas" component={MigasPage} />
      <Route path="/tender" component={TenderPage} />
      <Route path="/manajemen" component={ManajemenPage} />
      <Route path="/perijinan" component={PerijinanPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/matrix" component={MatrixPage} />
      <Route path="/brain" component={BrainPage} />
      <Route path="/bimtek" component={BimtekPage} />
      <Route path="/certify" component={CertifyPage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/learn/:slug" component={LearnSlugPage} />
      <Route path="/solve" component={SolvePage} />
      <Route path="/solve/:slug" component={SolveSlugPage} />
      <Route path="/solver" component={SolverPage} />
      <Route path="/tools" component={ToolsPage} />
      <Route path="/simulasi" component={SimulasiPage} />
      <Route path="/evidence-mapping" component={EvidenceMappingPage} />
      <Route path="/knowledge" component={KnowledgePage} />
      <Route path="/knowledge/article/:slug" component={KnowledgeArticlePage} />
      <Route path="/legal-licensing" component={LegalLicensingPage} />
      <Route path="/sbu-readiness" component={SbuReadinessPage} />
      <Route path="/skk-readiness" component={SkkReadinessPage} />
      <Route path="/tender-eligibility" component={TenderEligibilityPage} />
      <Route path="/tender-intelligence" component={TenderIntelligencePage} />
      <Route path="/workforce-assignment" component={WorkforceAssignmentPage} />
      <Route path="/agent/:businessId/:columnId" component={AgentPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
