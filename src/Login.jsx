import { useState } from "react";
import { login, register } from "./services/api";
import { useTranslation } from "react-i18next";
import "./styles/Login.css";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

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
    tag: "Bem-vindo de volta",
    title: <>Acesse sua <em>conta</em> agora</>,
    sub: "Continue de onde parou. Seus dados, declarações e faturamento estão todos aqui.",
    features: ["Segurança com criptografia de ponta", "Acesso em qualquer dispositivo", "Suporte 24 horas por dia"],
  } : {
    tag: "Comece agora, é grátis",
    title: <>Crie sua <em>conta</em> MEI</>,
    sub: "Gerencie seu CNPJ, DAS e faturamento de forma simples e inteligente.",
    features: ["Cadastro rápido em menos de 1 minuto", "Sem burocracia, sem custo", "Alertas automáticos de vencimento"],
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
              <h2 className="card-title">{modo === "login" ? "Bem-vindo de volta 👋" : "Crie sua conta 🚀"}</h2>
              <p className="card-subtitle">{modo === "login" ? "Use seu e-mail e senha para acessar" : "Preencha os dados abaixo para começar"}</p>
            </div>

            {success && (
              <div className="success-msg">
                ✓ {modo === "login" ? "Login realizado com sucesso!" : "Conta criada com sucesso!"}
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
                      Lembrar de mim
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
                          Força da senha: {strengthLabels[strength]}
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
                  {modo === "login" ? "Entrando..." : "Criando conta..."}
                </>
              ) : (
                modo === "login" ? "Entrar" : "Criar conta grátis"
              )}
            </button>

            <div className="divider-row">
              <div className="divider-line" />
            </div>

            <p className="switch-row">
              {modo === "login" ? "Não tem conta?" : "Já tem conta?"}
              <button className="switch-link" onClick={() => trocarModo(modo === "login" ? "cadastro" : "login")}>
                {modo === "login" ? "Criar conta grátis" : "Entrar"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </>
  );
  }
  
