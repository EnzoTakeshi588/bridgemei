import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .login-page {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0f;
    overflow: hidden;
  }

  .login-left {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    background: #0d0d15;
  }

  .login-left::before {
    content: '';
    position: absolute;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: glowPulse 6s ease-in-out infinite;
  }

  .login-left::after {
    content: '';
    position: absolute;
    bottom: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%);
    border-radius: 50%;
    animation: glowPulse 8s ease-in-out infinite reverse;
  }

  @keyframes glowPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
  }

  .left-content {
    position: relative;
    z-index: 1;
    max-width: 420px;
  }

  .brand-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #6366f1;
    border: 1px solid rgba(99,102,241,0.3);
    padding: 6px 14px;
    border-radius: 20px;
    margin-bottom: 40px;
    background: rgba(99,102,241,0.05);
    opacity: 0;
    animation: fadeInUp 0.6s 0.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .left-title {
    font-family: 'DM Serif Display', serif;
    font-size: 52px;
    line-height: 1.1;
    color: #f8f8ff;
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeInUp 0.6s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .left-title em { font-style: italic; color: #6366f1; }

  .left-subtitle {
    font-size: 15px;
    color: rgba(248,248,255,0.4);
    line-height: 1.7;
    font-weight: 300;
    margin-bottom: 50px;
    opacity: 0;
    animation: fadeInUp 0.6s 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .features { display: flex; flex-direction: column; gap: 16px; }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    color: rgba(248,248,255,0.5);
    font-size: 14px;
    opacity: 0;
    animation: fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .feature-item:nth-child(1) { animation-delay: 0.45s; }
  .feature-item:nth-child(2) { animation-delay: 0.55s; }
  .feature-item:nth-child(3) { animation-delay: 0.65s; }

  .feature-dot {
    width: 6px; height: 6px;
    background: #6366f1;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(99,102,241,0.6);
    animation: dotFloat 3s ease-in-out infinite;
  }
  .feature-item:nth-child(2) .feature-dot { animation-delay: 0.5s; }
  .feature-item:nth-child(3) .feature-dot { animation-delay: 1s; }

  @keyframes dotFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .login-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.07), transparent);
  }

  .login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    background: #0a0a0f;
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    opacity: 0;
    animation: fadeInUp 0.7s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  /* Tabs login / cadastro */
  .tabs {
    display: flex;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 36px;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    background: transparent;
    color: rgba(248,248,255,0.35);
    position: relative;
    overflow: hidden;
  }

  .tab-btn.active {
    background: #6366f1;
    color: white;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
  }

  .tab-btn:not(.active):hover {
    color: rgba(248,248,255,0.6);
    background: rgba(255,255,255,0.03);
  }

  .card-header { margin-bottom: 28px; }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 28px;
    color: #f8f8ff;
    margin-bottom: 6px;
  }

  .card-subtitle {
    font-size: 13.5px;
    color: rgba(248,248,255,0.35);
    font-weight: 300;
  }

  .form-group { margin-bottom: 18px; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 18px;
  }

  .form-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(248,248,255,0.4);
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 13px 15px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #f8f8ff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
  }

  .form-input::placeholder { color: rgba(248,248,255,0.2); }

  .form-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .form-input.error {
    border-color: rgba(239,68,68,0.5);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  .form-error { font-size: 12px; color: #ef4444; margin-top: 5px; display: block; animation: fadeInUp 0.2s ease; }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    margin-top: -4px;
  }

  .remember-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(248,248,255,0.4);
    cursor: pointer;
    user-select: none;
  }

  .remember-label input[type="checkbox"] { accent-color: #6366f1; width: 14px; height: 14px; }

  .forgot-link {
    font-size: 13px;
    color: #6366f1;
    text-decoration: none;
    transition: opacity 0.2s;
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .forgot-link:hover { opacity: 0.7; }

  .terms-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 24px;
    font-size: 12.5px;
    color: rgba(248,248,255,0.35);
    line-height: 1.5;
  }

  .terms-row input[type="checkbox"] { accent-color: #6366f1; width: 14px; height: 14px; margin-top: 2px; flex-shrink: 0; }

  .terms-link { color: #6366f1; text-decoration: none; }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: #6366f1;
    border: none;
    border-radius: 10px;
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }

  .btn-primary:hover {
    background: #5254cc;
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(99,102,241,0.35);
  }

  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .btn-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .divider-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }

  .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .divider-text { font-size: 12px; color: rgba(248,248,255,0.25); white-space: nowrap; }

  .btn-google {
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: rgba(248,248,255,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  .btn-google:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.2);
    color: #f8f8ff;
  }

  .switch-row {
    text-align: center;
    font-size: 13px;
    color: rgba(248,248,255,0.3);
  }

  .switch-link {
    color: #6366f1;
    font-weight: 500;
    margin-left: 4px;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
  }

  .switch-link:hover { text-decoration: underline; }

  .success-msg {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: rgba(34,197,94,0.08);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 10px;
    color: #22c55e;
    font-size: 14px;
    margin-bottom: 20px;
    animation: fadeInUp 0.3s ease;
  }

  /* Password strength */
  .strength-bar-wrap {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  .strength-bar {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.08);
    transition: background 0.3s;
  }

  .strength-label {
    font-size: 11px;
    margin-top: 5px;
    color: rgba(248,248,255,0.3);
  }

  /* Form transition */
  .form-wrap {
    animation: fadeInUp 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (max-width: 768px) {
    .login-left { display: none; }
    .login-divider { display: none; }
    .login-right { padding: 40px 24px; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

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

const strengthColors = ["", "#ef4444", "#f59e0b", "#6366f1", "#22c55e"];
const strengthLabels = ["", "Fraca", "Razoável", "Boa", "Forte"];

export default function Login({ onLogin }) {
  const [modo, setModo] = useState("login");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formKey, setFormKey] = useState(0);

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Cadastro
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [emailC, setEmailC] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [termos, setTermos] = useState(false);

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
    if (!termos) e.termos = "Aceite os termos para continuar";
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
        response = await fetch("http://localhost:5009/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      } else {
        response = await fetch("http://localhost:5009/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, sobrenome, email: emailC, password: passwordC }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);

        if (modo === "login") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("nome", data.name || data.nome || "");
        }

        setTimeout(() => {
          onLogin && onLogin();
        }, 1000);
      } else {
        setErrors({ geral: data.message || "Erro no login. Tente novamente." });
      }
    } catch (err) {
      setErrors({ geral: "Ocorreu um erro ao conectar com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  const leftContent = modo === "login" ? {
    tag: "Bem-vinda de volta",
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
      <style>{styles}</style>
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
                Entrar
              </button>
              <button className={`tab-btn ${modo === "cadastro" ? "active" : ""}`} onClick={() => trocarModo("cadastro")}>
                Criar conta
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
                    <label className="form-label">E-mail</label>
                    <input className={`form-input ${errors.email ? "error" : ""}`} type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input className={`form-input ${errors.password ? "error" : ""}`} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                    {errors.password && <span className="form-error">{errors.password}</span>}
                  </div>

                  <div className="form-options">
                    <label className="remember-label">
                      <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                      Lembrar de mim
                    </label>
                    <button className="forgot-link">Esqueci a senha</button>
                  </div>
                </>
              )}

              {/* FORMULÁRIO CADASTRO */}
              {modo === "cadastro" && (
                <>
                  <div className="form-row">
                    <div>
                      <label className="form-label">Nome</label>
                      <input className={`form-input ${errors.nome ? "error" : ""}`} type="text" placeholder="Tassi" value={nome} onChange={e => setNome(e.target.value)} />
                      {errors.nome && <span className="form-error">{errors.nome}</span>}
                    </div>
                    <div>
                      <label className="form-label">Sobrenome</label>
                      <input className="form-input" type="text" placeholder="Takeshi" value={sobrenome} onChange={e => setSobrenome(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input className={`form-input ${errors.emailC ? "error" : ""}`} type="email" placeholder="seu@email.com" value={emailC} onChange={e => setEmailC(e.target.value)} />
                    {errors.emailC && <span className="form-error">{errors.emailC}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Senha</label>
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

                  <div className="terms-row">
                    <input type="checkbox" checked={termos} onChange={e => setTermos(e.target.checked)} />
                    <span>
                      Concordo com os <a href="#" className="terms-link">Termos de Uso</a> e a <a href="#" className="terms-link">Política de Privacidade</a>
                    </span>
                  </div>
                  {errors.termos && <span className="form-error" style={{ marginTop: -8, marginBottom: 12, display: "block" }}>{errors.termos}</span>}
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
              <span className="divider-text">ou continue com</span>
              <div className="divider-line" />
            </div>

            <button className="btn-google">
              <GoogleIcon />
              {modo === "login" ? "Entrar com Google" : "Cadastrar com Google"}
            </button>

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
  
