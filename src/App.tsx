
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RefundPolicy from "./pages/RefundPolicy";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MyAccount from "./pages/MyAccount";
import Admin from "./pages/Admin";
import AdminAddNew from "./pages/AdminAddNew";
import AdminAllPDFs from "./pages/AdminAllPDFs";
import AdminUsers from "./pages/AdminUsers";
import AdminDownloads from "./pages/AdminDownloads";
import AdminTrash from "./pages/AdminTrash";
import AdminPricing from "./pages/AdminPricing";
import AdminMiniWebsite from "./pages/AdminMiniWebsite";
import ImportData from "./pages/ImportData";
import NotFound from "./pages/NotFound";
import EmailVerification from "./pages/EmailVerification";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/home" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/add-new" element={<AdminAddNew />} />
              <Route path="/admin/all-pdfs" element={<AdminAllPDFs />} />
              <Route path="/admin/pricing" element={<AdminPricing />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/downloads" element={<AdminDownloads />} />
              <Route path="/admin/trash" element={<AdminTrash />} />
              <Route path="/admin/mini-website" element={<AdminMiniWebsite />} />
              <Route path="/admin/import-data" element={<ImportData />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
