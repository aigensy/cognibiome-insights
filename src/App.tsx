import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppProvider } from "@/contexts/AppContext";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import Dashboard from "./pages/Dashboard";
import PilotResults from "./pages/PilotResults";
import Simulator from "./pages/Simulator";
import ExportReport from "./pages/ExportReport";
import Methods from "./pages/Methods";
import Compare from "./pages/Compare";
import HelpDocs from "./pages/HelpDocs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <TopBar />
                <main className="flex-1 overflow-auto p-4 md:p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/pilot" element={<PilotResults />} />
                    <Route path="/simulator" element={<Simulator />} />
                    <Route path="/export" element={<ExportReport />} />
                    <Route path="/methods" element={<Methods />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/help" element={<HelpDocs />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
