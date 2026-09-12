import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AnniversaryHeader from "../components/AnniversaryHeader";

const BTC_ACCOUNT = "HICD";
const BTC_PASSWORD = "Hcmue@HICD2026";

export default function BTCLogin() {
  const navigate = useNavigate();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (account.trim() === BTC_ACCOUNT && password === BTC_PASSWORD) {
      localStorage.setItem("hicd_btc_authenticated", "true");
      navigate("/admin", { replace: true });
      return;
    }

    setError("Tài khoản hoặc mật khẩu không chính xác.");
  };

  return (
    <main className="btc-login-page">
      <div className="btc-login-background">
        <div className="btc-login-orb btc-login-orb-1" />
        <div className="btc-login-orb btc-login-orb-2" />
        <div className="btc-login-star btc-login-star-1">✦</div>
        <div className="btc-login-star btc-login-star-2">✧</div>
        <div className="btc-login-star btc-login-star-3">✦</div>
      </div>

      <div className="btc-login-shell">
        <AnniversaryHeader className="btc-login-header" />

        <section className="btc-login-content">
          <div className="btc-login-card-wrap">
            <Link to="/" className="btc-back-link">
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </Link>

            <div className="btc-login-card">
            <div className="btc-login-badge">
              <ShieldCheck size={27} strokeWidth={1.8} />
            </div>

            <div className="btc-login-title">
              <span className="btc-login-eyebrow">HICD 2026</span>
              <h1>Đăng nhập Ban Tổ chức</h1>
              <p>
                Khu vực quản lý và theo dõi các tiết mục tham gia ngày hội.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="btc-login-form">
              <label className="btc-login-field">
                <span>Tài khoản</span>
                <div className="btc-login-input-wrap">
                  <UserRound size={19} />
                  <input
                    type="text"
                    value={account}
                    onChange={(event) => {
                      setAccount(event.target.value);
                      setError("");
                    }}
                    placeholder="Nhập tài khoản BTC"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </label>

              <label className="btc-login-field">
                <span>Mật khẩu</span>
                <div className="btc-login-input-wrap">
                  <LockKeyhole size={19} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btc-password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </label>

              {error && (
                <div className="btc-login-error" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="btc-login-submit">
                <span>Đăng nhập</span>
                <ArrowLeft className="btc-login-submit-arrow" size={19} />
              </button>
            </form>

            <div className="btc-login-note">
              <LockKeyhole size={15} />
              <span>Quyền truy cập dành riêng cho Ban Tổ chức</span>
            </div>
            </div>

            <p className="btc-login-footer">
            Chào mừng kỷ niệm 50 năm Ngày truyền thống Trường Đại học Sư phạm
            Thành phố Hồ Chí Minh
              <span>(27/10/1976 - 27/10/2026)</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
