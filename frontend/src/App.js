import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import FindVendors from "@/pages/FindVendors";
import VendorProfile from "@/pages/VendorProfile";
import PlanEvent from "@/pages/PlanEvent";
import ScrollToTop from "@/components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SmoothScroll>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vendors" element={<FindVendors />} />
            <Route path="/vendors/:id" element={<VendorProfile />} />
            <Route path="/plan" element={<PlanEvent />} />
          </Routes>
          <Footer />
        </SmoothScroll>
        <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
