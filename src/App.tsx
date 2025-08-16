import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import { PublicProfile } from "./pages/PublicProfile";
import { Admin } from "./pages/Admin";
import { Auth } from "./pages/Auth";
import MatchingTest from "./pages/MatchingTest";
import DemoLanding from "./pages/DemoLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<DemoLanding />} />
          <Route path="/profile/:profileId" element={<PublicProfile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/matching-test" element={<MatchingTest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
