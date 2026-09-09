import { useState, useEffect } from "react";

// Barra de progresso de doações
// Passa "atual" e "meta" como props (em euros, ou qualquer moeda)
function BarraDoacoes({meta = 10000, moeda = "€" }) {
  const URL = import.meta.env.VITE_SCRIPT_URL;

  const [atual, setAtual] = useState("");
  const [largura, setLargura] = useState(0);
  const percentagem = Math.min((atual / meta) * 100, 100);

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setAtual(data.total));
  }, []);

  useEffect(() => {
    // pequeno atraso para a barra "encher" com animação ao carregar
    const timer = setTimeout(() => setLargura(percentagem), 150);
    return () => clearTimeout(timer);
  }, [percentagem]);

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 18 }}>
          {moeda}
          {atual.toLocaleString("pt-PT")}
        </span>
        <span style={{ color: "#6b7280", fontSize: 14 }}>
          meta: {moeda}
          {meta.toLocaleString("pt-PT")}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 16,
          background: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${largura}%`,
            height: "100%",
            background: "linear-gradient(90deg, #10b981, #059669)",
            borderRadius: 999,
            transition: "width 1s ease-out",
          }}
        />
      </div>

      <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
        {percentagem.toFixed(0)}% angariado
      </div>
    </div>
  );
}

export default BarraDoacoes;
