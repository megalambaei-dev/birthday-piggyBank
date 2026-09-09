import { useState } from "react";

function FormularioDoacoes() {
  const [valor, setValor] = useState(5);
  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;

    const nome = form.nome.value;
    const email = form.email.value;
    const emailV = form.emailV.value;

    //const telemovel = telemovel.value;

    if (email !== emailV) {
      alert("Os emails não coincidem.");
      return;
    }

    try {
      await enviarDoacao(nome, email, valor);
      alert("Obrigada pelo teu contributo! <3");

      // carrega outro elemento? e tapa o form?
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar a doação.");
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
        <button type="submit">Doar</button>
      </form>
    </>
  );
}

async function enviarDoacao(nome, email, valor) {
  const URL = import.meta.env.VITE_SCRIPT_URL;
  console.log(import.meta.env.VITE_SCRIPT_URL);
  await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ nome, email, valor }),
    headers: { "Content-Type": "text/plain" },
  });
}

export default FormularioDoacoes;
