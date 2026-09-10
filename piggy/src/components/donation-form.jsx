import { useState } from "react";

const URL = import.meta.env.VITE_SCRIPT_URL;

function FormularioDoacoes({ onSubmit }) {
  // valor a ver se por cima da barra
  const [valor, setValor] = useState(5);
  const [aCarregar, setACarregar] = useState(false);
  const regexTelemovel = /^(?:\+351|00351)?9[1236]\d{7}$/;

  async function handleSubmit(e) {
    e.preventDefault();

    setACarregar(true);

    const form = e.target;

    const nome = form.nome.value;
    const email = form.email.value;
    const emailV = form.emailV.value;
    const telemovel = form.telemovel.value;

    if (email !== emailV) {
      alert("Os emails não coincidem.");
      setACarregar(false);
      return;
    }

    if (telemovel && !regexTelemovel.test(telemovel)) {
      alert("Número de telemóvel inválido");
      form.telemovel.value = "";
      setACarregar(false);
      return;
    }

    // Verificar se o email já doou
    try {
      const resposta = await fetch(
        `${URL}?acao=verificarDoador&email=${encodeURIComponent(email)}&telemovel=${encodeURIComponent(telemovel)}`,
      );
      const resultado = await resposta.json();

      if (resultado.emailExiste) {
        alert("Este email já efetuou uma doação anteriormente.");
        setACarregar(false);
        return;
      }

      if (resultado.telemovelExiste) {
        alert("Este número de telemóvel já foi usado numa doação anterior.");
        form.telemovel.value = "";
        form.telemovel.focus();
        setACarregar(false);
        return;
      }

      await enviarDoacao(nome, email, telemovel, valor);
      alert("Obrigada pelo teu contributo! <3");
      onSubmit(valor);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar a doação.");
    } finally {
      setACarregar(false); 
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <label htmlFor="nome">Nome</label>
        <input id="nome" type="text" placeholder="Primeiro nome" required />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Exemplo: xxx@gmail.com"
          required
        ></input>
        <label>Email</label>
        <input
          id="emailV"
          type="email"
          placeholder="Exemplo: xxx@gmail.com"
          required
        ></input>
        <label>Email</label>
        <input
          id="telemovel"
          type="tel"
          placeholder=" +351 xxx xxx xxx"
          required
        ></input>

        <label htmlFor="doacao">Valor a doar </label>
        <input
          type="range"
          id="doacao"
          name="doacao"
          min="0.5"
          max="25"
          step="0.5"
          defaultValue="5"
          onChange={(e) => setValor(e.target.value)}
        />
        <label>{valor}</label>
        <button type="submit" disabled={aCarregar}>
          {aCarregar ? "A processar..." : "Doar"}
        </button>
      </form>
    </>
  );
}

async function enviarDoacao(nome, email, telemovel, valor) {
  await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ nome, email, telemovel, valor }),
    headers: { "Content-Type": "text/plain" },
  });
}

export default FormularioDoacoes;
