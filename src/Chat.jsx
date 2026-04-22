import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  .chat-page { display: flex; height: 100vh; font-family: 'DM Sans', sans-serif; background: #0a0a0f; color: #f8f8ff; }
  .chat-list-panel { width: 300px; border-right: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; background: #0d0d15; flex-shrink: 0; }
  .chat-list-header { padding: 28px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .chat-list-title { font-family: 'DM Serif Display', serif; font-size: 22px; color: #f8f8ff; }
  .chat-list-sub { font-size: 12px; color: rgba(248,248,255,0.3); margin-top: 3px; }
  .chat-contacts { flex: 1; overflow-y: auto; padding: 8px; }
  .contact-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; cursor: pointer; transition: background 0.15s; border: 1px solid transparent; }
  .contact-item:hover { background: rgba(255,255,255,0.04); }
  .contact-item.active { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.25); }
  .contact-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; flex-shrink: 0; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); color: #6366f1; }
  .contact-name { font-size: 13.5px; font-weight: 500; color: #f8f8ff; }
  .contact-preview { font-size: 12px; color: rgba(248,248,255,0.35); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
  .contact-time { font-size: 11px; color: rgba(248,248,255,0.25); margin-left: auto; flex-shrink: 0; }
  .unread-dot { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; flex-shrink: 0; }
  .chat-window { flex: 1; display: flex; flex-direction: column; }
  .chat-topbar { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px; }
  .chat-topbar-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: #6366f1; }
  .chat-topbar-name { font-size: 14px; font-weight: 500; }
  .chat-topbar-status { font-size: 11px; color: rgba(248,248,255,0.35); margin-top: 1px; }
  .messages-area { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .msg { max-width: 65%; display: flex; flex-direction: column; gap: 4px; }
  .msg.mine { align-self: flex-end; align-items: flex-end; }
  .msg.theirs { align-self: flex-start; align-items: flex-start; }
  .msg-bubble { padding: 12px 16px; border-radius: 14px; font-size: 13.5px; line-height: 1.5; }
  .msg.mine .msg-bubble { background: #6366f1; color: #fff; border-bottom-right-radius: 4px; }
  .msg.theirs .msg-bubble { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: rgba(248,248,255,0.85); border-bottom-left-radius: 4px; }
  .msg-time { font-size: 11px; color: rgba(248,248,255,0.25); }
  .chat-input-area { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; gap: 10px; }
  .chat-input { flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #f8f8ff; font-family: 'DM Sans', sans-serif; font-size: 13.5px; outline: none; transition: border-color 0.15s; }
  .chat-input::placeholder { color: rgba(248,248,255,0.2); }
  .chat-input:focus { border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.05); }
  .send-btn { padding: 12px 20px; background: #6366f1; border: none; border-radius: 10px; color: white; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .send-btn:hover { background: #5254cc; box-shadow: 0 4px 15px rgba(99,102,241,0.3); }
  .empty-chat { flex: 1; display: flex; align-items: center; justify-content: center; color: rgba(248,248,255,0.2); font-size: 14px; flex-direction: column; gap: 8px; }
`;

const contatos = [
  { id: 1, init: "C", nome: "Contador Silva", status: "Online agora", preview: "Enviei o boleto do DAS", time: "10:42", unread: true },
  { id: 2, init: "🤖", nome: "Assistente IA", status: "Sempre disponível", preview: "Posso te ajudar com dúvidas", time: "09:15", unread: true },
];

const msgIniciais = {
  1: [
    { de: "theirs", texto: "Olá! Enviei o boleto do DAS de maio para você.", hora: "10:30" },
    { de: "theirs", texto: "Lembre-se que vence no dia 20. Qualquer dúvida é só falar!", hora: "10:31" },
    { de: "mine", texto: "Obrigada! Já vi aqui, vou pagar ainda hoje.", hora: "10:42" },
  ],
  2: [
    { de: "theirs", texto: "Olá! Sou o assistente IA do BridgeMEI. Como posso ajudar?", hora: "09:00" },
    { de: "mine", texto: "Qual o prazo da DASN?", hora: "09:10" },
    { de: "theirs", texto: "A DASN-SIMEI deve ser entregue até 31 de maio de cada ano, referente ao ano anterior. Está em dia! ✅", hora: "09:15" },
  ],
};

export default function Chat() {
  const [ativo, setAtivo] = useState(1);
  const [mensagens, setMensagens] = useState(msgIniciais);
  const [input, setInput] = useState("");

  const contato = contatos.find(c => c.id === ativo);

  const enviar = () => {
    if (!input.trim()) return;
    const nova = { de: "mine", texto: input, hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    setMensagens(prev => ({ ...prev, [ativo]: [...(prev[ativo] || []), nova] }));
    setInput("");
    if (ativo === 2) {
      setTimeout(() => {
        const resp = { de: "theirs", texto: "Entendido! Vou encaminhar sua dúvida ao contador caso precise de mais detalhes. 😊", hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
        setMensagens(prev => ({ ...prev, [ativo]: [...prev[ativo], resp] }));
      }, 1000);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="chat-page">
        <div className="chat-list-panel">
          <div className="chat-list-header">
            <div className="chat-list-title">Mensagens</div>
            <div className="chat-list-sub">Seus atendimentos</div>
          </div>
          <div className="chat-contacts">
            {contatos.map(c => (
              <div key={c.id} className={`contact-item ${ativo === c.id ? "active" : ""}`} onClick={() => setAtivo(c.id)}>
                <div className="contact-avatar">{c.init}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="contact-name">{c.nome}</div>
                  <div className="contact-preview">{c.preview}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                  <span className="contact-time">{c.time}</span>
                  {c.unread && <span className="unread-dot" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-window">
          {contato && (
            <>
              <div className="chat-topbar">
                <div className="chat-topbar-avatar">{contato.init}</div>
                <div>
                  <div className="chat-topbar-name">{contato.nome}</div>
                  <div className="chat-topbar-status">{contato.status}</div>
                </div>
              </div>
              <div className="messages-area">
                {(mensagens[ativo] || []).map((m, i) => (
                  <div key={i} className={`msg ${m.de}`}>
                    <div className="msg-bubble">{m.texto}</div>
                    <div className="msg-time">{m.hora}</div>
                  </div>
                ))}
              </div>
              <div className="chat-input-area">
                <input className="chat-input" placeholder="Digite uma mensagem..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && enviar()} />
                <button className="send-btn" onClick={enviar}>Enviar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
