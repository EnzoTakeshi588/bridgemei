import { useState } from "react";
import { login, register } from "./services/api";
import { useTranslation } from "react-i18next";
import "./styles/Login.css";

function getStrength(pwd) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 6) s++;
  if (pwd.length >= 10) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9!@#$%]/.test(pwd)) s++;
  return s;
}

const strengthColors = ["", "var(--color-danger)", "var(--color-warning)", "var(--color-success)", "var(--color-accent)"];
const strengthLabels = ["", "Fraca", "Razoável", "Boa", "Forte"];

export default function Login({ onLogin }) {
  const [modo, setModo] = useState("login");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formKey, setFormKey] = useState(0);
  const { t }  = useTranslation();

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Cadastro
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [emailC, setEmailC] = useState("");
  const [passwordC, setPasswordC] = useState("");
  // const [termos, setTermos] = useState(false);

  const strength = getStrength(passwordC);

  const trocarModo = (m) => {
    setModo(m);
    setErrors({});
    setSuccess(false);
    setFormKey(k => k + 1);
  };

  const validateLogin = () => {
    const e = {};
    if (!email) e.email = "Digite seu e-mail";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Digite sua senha";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres";
    return e;
  };

  const validateCadastro = () => {
    const e = {};
    if (!nome.trim()) e.nome = "Digite seu nome";
    if (!emailC) e.emailC = "Digite seu e-mail";
    else if (!/\S+@\S+\.\S+/.test(emailC)) e.emailC = "E-mail inválido";
    if (!passwordC) e.passwordC = "Digite uma senha";
    else if (passwordC.length < 6) e.passwordC = "Mínimo 6 caracteres";
    // if (!termos) e.termos = "Aceite os termos para continuar";
    return e;
  };

  const handleSubmit = async () => {
    const e = modo === "login" ? validateLogin() : validateCadastro();

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      let response;

      if (modo === "login") {
        response = await login({
          email,
          password,
        });

        localStorage.setItem("token", response.token);

        localStorage.setItem("nome", response.name || response.nome || "");
      } 
      
      else {
        response = await register({
          name: nome,
          surname: sobrenome,
          email: emailC,
          password: passwordC
        });

        setSuccess(true);
      } 
       setSuccess(true);

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
    } catch (err) {
        setErrors({
          geral: err.message,
        });

      } finally {
        setLoading(false);
      }
  };

  const leftContent = modo === "login" ? {
    tag: t("login.leftPageLogin.welcome"),
    title: <>{t("login.leftPageLogin.title-one")}<em>{t("login.leftPageLogin.title-two")}</em>{t("login.leftPageLogin.title-three")}</>,
    sub: t("login.leftPageLogin.subtitle"),
    features: [t("login.leftPageLogin.features.one"), t("login.leftPageLogin.features.two"), ],
  } : {
    tag: t("login.leftPageRegister.welcome"),
    title: <>{t("login.leftPageRegister.title-one")}<em>{t("login.leftPageRegister.title-two")}</em>{t("login.leftPageRegister.title-three")}</>,
    sub: t("login.leftPageRegister.subtitle"),
    features: [t("login.leftPageRegister.features.one"), t("login.leftPageRegister.features.two"), ]
  };
  return (
    <>
      <div className="login-page">

        {/* Esquerda */}
        <div className="login-left">
          <div className="left-content">
            <span className="brand-tag">{leftContent.tag}</span>
            <h1 className="left-title">{leftContent.title}</h1>
            <p className="left-subtitle">{leftContent.sub}</p>
            <div className="features">
              {leftContent.features.map(f => (
                <div className="feature-item" key={f}>
                  <span className="feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="login-divider" />

        {/* Direita */}
        <div className="login-right">
          <div className="login-card">

            {/* Tabs */}
            <div className="tabs">
              <button className={`tab-btn ${modo === "login" ? "active" : ""}`} onClick={() => trocarModo("login")}>
                {t("login.login")}
              </button>
              <button className={`tab-btn ${modo === "cadastro" ? "active" : ""}`} onClick={() => trocarModo("cadastro")}>
                {t("login.register")}
              </button>
            </div>

            <div className="card-header">
              <h2 className="card-title">{modo === "login" ? t("login.formLogin") : t("login.formRegister")}</h2>
              <p className="card-subtitle">{modo === "login" ? t("login.formLoginSub") : t("login.formRegisterSub")}</p>
            </div>

            {success && (
              <div className="success-msg">
                ✓ {modo === "login" ? t("login.LoginSuccess") : t("login.RegisterSuccess")}
              </div>
            )}

            {errors.geral && (
              <div className="form-error" style={{ marginBottom: "15px"}}>
                ✗ {errors.geral}
              </div>
            )}

            <div key={formKey} className="form-wrap">
              {/* FORMULÁRIO LOGIN */}
              {modo === "login" && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t("login.email")}</label>
                    <input className={`form-input ${errors.email ? "error" : ""}`} type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("login.password")}</label>
                    <input className={`form-input ${errors.password ? "error" : ""}`} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                    {errors.password && <span className="form-error">{errors.password}</span>}
                  </div>

                  <div className="form-options">
                    <label className="remember-label">
                      <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                      {t("login.remember")}
                    </label>
                    <button className="forgot-link">{t("login.forgotPassword")}</button>
                  </div>
                </>
              )}

              {/* FORMULÁRIO CADASTRO */}
              {modo === "cadastro" && (
                <>
                  <div className="form-row">
                    <div>
                      <label className="form-label">{t("login.name")}</label>
                      <input className={`form-input ${errors.nome ? "error" : ""}`} type="text" placeholder="Tassi" value={nome} onChange={e => setNome(e.target.value)} />
                      {errors.nome && <span className="form-error">{errors.nome}</span>}
                    </div>
                    <div>
                      <label className="form-label">{t("login.surname")}</label>
                      <input className="form-input" type="text" placeholder="Takeshi" value={sobrenome} onChange={e => setSobrenome(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("login.email")}</label>
                    <input className={`form-input ${errors.emailC ? "error" : ""}`} type="email" placeholder="seu@email.com" value={emailC} onChange={e => setEmailC(e.target.value)} />
                    {errors.emailC && <span className="form-error">{errors.emailC}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("login.password")}</label>
                    <input className={`form-input ${errors.passwordC ? "error" : ""}`} type="password" placeholder="••••••••" value={passwordC} onChange={e => setPasswordC(e.target.value)} />
                    {errors.passwordC && <span className="form-error">{errors.passwordC}</span>}
                    {passwordC && (
                      <>
                        <div className="strength-bar-wrap">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="strength-bar" style={{ background: i <= strength ? strengthColors[strength] : undefined }} />
                          ))}
                        </div>
                        <div className="strength-label" style={{ color: strengthColors[strength] }}>
                          {t("login.PasswordStrength")} {strengthLabels[strength]}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  {modo === "login" ? t("login.LoginButtonLoading") : t("login.RegisterButtonLoading")}
                </>
              ) : (
                modo === "login" ? t("login.LoginButton") : t('login.RegisterButton')
              )}
            </button>

            <div className="divider-row">
              <div className="divider-line" />
            </div>

            <p className="switch-row">
              {modo === "login" ? t("login.formLoginTail.1") : t("login.formRegisterTail.1")}
              <button className="switch-link" onClick={() => trocarModo(modo === "login" ? "cadastro" : "login")}>
                {modo === "login" ? t("login.formLoginTail.2") : t("login.formRegisterTail.2")}
              </button>
            </p>

          </div>
        </div>
      </div>
    </>
  );
  }
  
