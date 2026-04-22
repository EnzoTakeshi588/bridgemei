import { useState } from "react";

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

  /* Lado esquerdo - decorativo */
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
    top: -200px;
    left: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 6s ease-in-out infinite;
  }

  .login-left::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 8s ease-in-out infinite reverse;
  }

  @keyframes pulse {
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
  }

  .left-title {
    font-family: 'DM Serif Display', serif;
    font-size: 52px;
    line-height: 1.1;
    color: #f8f8ff;
    margin-bottom: 20px;
  }

  .left-title em {
    font-style: italic;
    color: #6366f1;
  }

  .left-subtitle {
    font-size: 15px;
    color: rgba(248,248,255,0.4);
    line-height: 1.7;
    font-weight: 300;
    margin-bottom: 50px;
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    color: rgba(248,248,255,0.5);
    font-size: 14px;
  }

  .feature-dot {
    width: 6px;
    height: 6px;
    background: #6366f1;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(99,102,241,0.6);
  }

  /* Divisor */
  .login-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.07), transparent);
  }

  /* Lado direito - formulário */
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
    animation: fadeUp 0.6s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card-header {
    margin-bottom: 40px;
  }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 30px;
    color: #f8f8ff;
    margin-bottom: 8px;
  }

  .card-subtitle {
    font-size: 14px;
    color: rgba(248,248,255,0.35);
    font-weight: 300;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(248,248,255,0.4);
    margin-bottom: 10px;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #f8f8ff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
  }

  .form-input::placeholder {
    color: rgba(248,248,255,0.2);
  }

  .form-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .form-input.error {
    border-color: rgba(239,68,68,0.5);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
  }

  .form-error {
    font-size: 12px;
    color: #ef4444;
    margin-top: 6px;
    display: block;
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
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

  .remember-label input[type="checkbox"] {
    accent-color: #6366f1;
    width: 14px;
    height: 14px;
  }

  .forgot-link {
    font-size: 13px;
    color: #6366f1;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .forgot-link:hover { opacity: 0.7; }

  .btn-login {
    width: 100%;
    padding: 15px;
    background: #6366f1;
    border: none;
    border-radius: 10px;
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .btn-login:hover {
    background: #5254cc;
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(99,102,241,0.35);
  }

  .btn-login:active {
    transform: translateY(0);
  }

  .btn-login:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .divider-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .divider-text {
    font-size: 12px;
    color: rgba(248,248,255,0.25);
    white-space: nowrap;
  }

  .btn-google {
    width: 100%;
    padding: 13px;
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
    margin-bottom: 32px;
  }

  .btn-google:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.2);
    color: #f8f8ff;
  }

  .register-row {
    text-align: center;
    font-size: 13px;
    color: rgba(248,248,255,0.3);
  }

  .register-link {
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    margin-left: 4px;
  }

  .register-link:hover { text-decoration: underline; }

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
    animation: fadeUp 0.3s ease;
  }

  @media (max-width: 768px) {
    .login-left { display: none; }
    .login-divider { display: none; }
    .login-right { padding: 40px 24px; }
  }
`;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Digite seu e-mail";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Digite sua senha";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => onLogin && onLogin(), 1000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <div className="login-left">
          <div className="left-content">
            <span className="brand-tag">Bem-vindo de volta</span>
            <h1 className="left-title">Acesse sua <em>conta</em> agora</h1>
            <p className="left-subtitle">
              Continue de onde parou. Seus dados, projetos e configurações estão todos aqui esperando por você.
            </p>
            <div className="features">
              {["Segurança com criptografia de ponta", "Acesso em qualquer dispositivo", "Suporte 24 horas por dia"].map(f => (
                <div className="feature-item" key={f}>
                  <span className="feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="login-divider" />

        <div className="login-right">
          <div className="login-card">
            <div className="card-header">
              <h2 className="card-title">Entrar</h2>
              <p className="card-subtitle">Use seu e-mail e senha para acessar</p>
            </div>

            {success && (
              <div className="success-msg">
                ✓ Login realizado com sucesso!
              </div>
            )}

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                className={`form-input ${errors.email ? "error" : ""}`}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                className={`form-input ${errors.password ? "error" : ""}`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-label">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Lembrar de mim
              </label>
              <a href="#" className="forgot-link">Esqueci a senha</a>
            </div>

            <button className="btn-login" onClick={handleSubmit} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">ou continue com</span>
              <div className="divider-line" />
            </div>

            <button className="btn-google">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </button>

            <p className="register-row">
              Não tem conta?
              <a href="#" className="register-link">Criar conta grátis</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
