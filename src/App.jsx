import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import Registration from "./pages/Registration";
import Performances from "./pages/Performances";
import PerformanceDetail from "./pages/PerformanceDetail";
import Admin from "./pages/Admin";
import Entry from "./pages/Entry";
import BTCLogin from "./pages/BTCLogin";

function BTCGuard({ children }) {
  const authenticated =
    localStorage.getItem("hicd_btc_authenticated") === "true";

  return authenticated ? children : <Navigate to="/btc-login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Màn hình chọn Guest / Ban Tổ chức */}
      <Route path="/" element={<Entry />} />

      {/* Website chính */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/gioi-thieu" element={<About />} />
        <Route path="/dang-ky-tiet-muc" element={<Registration />} />
        <Route path="/cac-tiet-muc" element={<Performances />} />
        <Route path="/cac-tiet-muc/:id" element={<PerformanceDetail />} />

        {/* Khu vực BTC */}
        <Route
          path="/admin"
          element={
            <BTCGuard>
              <Admin />
            </BTCGuard>
          }
        />
      </Route>

      {/* Đăng nhập BTC */}
      <Route path="/btc-login" element={<BTCLogin />} />

      {/* Route không tồn tại */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
