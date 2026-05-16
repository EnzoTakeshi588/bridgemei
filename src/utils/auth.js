export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const nome = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload["name"] || localStorage.getItem("nome");
    return {
      nome,
      email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || payload["email"] || null,
    };
  } catch (e) {
    console.error("Token inválido:", e);
    return {
      nome: localStorage.getItem("nome") || null,
      email: null,
    };
  }
}
