import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./PaginaPersonalizar.css";

const URL = import.meta.env.VITE_SCRIPT_URL;

// área reservada, agora em percentagem do container (0 a 100)
// x e y quando comeca a area e altura e largura ocupados do container
const AREA = { x: 31, y: 20.7, largura: 37.5, altura: 40 }; // 150/400=37.5%, 120/450≈26.7%, etc.
const TAMANHO_IMAGEM_PERC = 25; // 25% da largura do container

function PaginaPersonalizar() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [estado, setEstado] = useState("a-verificar"); // a-verificar | valido | invalido
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState(null);
  const [face, setFace] = useState("frente");
  const [pos, setPos] = useState({ x: AREA.x + 6, y: AREA.y + 10 });
  const [aArrastar, setAArrastar] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const canvasRef = useRef(null);

  //   useEffect(() => {
  //     if (!token) {
  //       setEstado("invalido");
  //       return;
  //     }
  //     fetch(`${URL}?acao=verificarToken&token=${encodeURIComponent(token)}`)
  //       .then((r) => r.json())
  //       .then((res) => {
  //         if (res.valido) {
  //           setNome(res.nome);
  //           setEstado("valido");
  //         } else {
  //           setEstado("invalido");
  //         }
  //       })
  //       .catch(() => setEstado("invalido"));
  //   }, [token]);

  function handleUpload(e) {
    const ficheiro = e.target.files[0];
    if (!ficheiro) return;
    const leitor = new FileReader();
    leitor.onload = () => setImagem(leitor.result);
    leitor.readAsDataURL(ficheiro);
  }

  function clamp(valor, min, max) {
    return Math.min(Math.max(valor, min), max);
  }

  function handlePointerMove(e) {
    if (!aArrastar) return;
    const container = e.currentTarget.getBoundingClientRect();

    // posição do rato em % relativo ao container (não em pixels fixos)
    const xPerc = ((e.clientX - container.left) / container.width) * 100;
    const yPerc = ((e.clientY - container.top) / container.height) * 100;

    const x = clamp(
      xPerc - TAMANHO_IMAGEM_PERC / 2,
      AREA.x,
      AREA.x + AREA.largura - TAMANHO_IMAGEM_PERC,
    );
    const y = clamp(
      yPerc - TAMANHO_IMAGEM_PERC / 2,
      AREA.y,
      AREA.y + AREA.altura - TAMANHO_IMAGEM_PERC,
    );

    setPos({ x, y });
  }

  async function handleGuardar() {
    setAGuardar(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const shirt = new Image();
    shirt.src = "/frente.png"; // ficheiro em /public
    await new Promise((res) => (shirt.onload = res));
    ctx.drawImage(shirt, 0, 0, canvas.width, canvas.height);

    if (imagem) {
      const userImg = new Image();
      userImg.src = imagem;
      await new Promise((res) => (userImg.onload = res));
      ctx.drawImage(
        userImg,
        (pos.x / 100) * canvas.width,
        (pos.y / 100) * canvas.height,
        // usa a largura para manter proporção quadrada
        (TAMANHO_IMAGEM_PERC / 100) * canvas.width,
        (TAMANHO_IMAGEM_PERC / 100) * canvas.width, 
      );
    }

    const dataUrl = canvas.toDataURL("image/png");

    try {
      const resposta = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({ acao: "guardarDesign", token, imagem: dataUrl }),
        headers: { "Content-Type": "text/plain" },
      });
      const resultado = await resposta.json();
      if (resultado.status === "ok") {
        setEstado("concluido");
      } else {
        alert("Não foi possível guardar: " + resultado.motivo);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao guardar o design.");
    } finally {
      setAGuardar(false);
    }
  }

  //   if (estado === "a-verificar") return <p>A verificar o teu link...</p>;
  //   if (estado === "invalido")
  //     return <p>Este link é inválido ou já foi utilizado.</p>;
  //   if (estado === "concluido")
  //     return <p>O teu design foi guardado. Obrigado, {nome}! 🎉</p>;

  return (
    <div>
      <h2>Personaliza a t-shirt!</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {/* div da imagem */}
      <div
        onPointerMove={handlePointerMove}
        onPointerUp={() => setAArrastar(false)}
        className="containerImagem"
        style={{
          backgroundImage:
            face === "frente" ? "url(/frente.png)" : "url(/costas.png)",
        }}
      >
        {/* área reservada visível */}
        <div className="picotado"
          style={{
            left: face === "frente" ? `${AREA.x}%` : `${AREA.x - 1}%`,
            top: `${AREA.y}%`,
            width: `${AREA.largura}%`,
            height: `${AREA.altura}%`,
            
          }}
        />

        {imagem && (
          <img
            src={imagem}
            onPointerDown={() => setAArrastar(true)}
            draggable={false}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${TAMANHO_IMAGEM_PERC}%`,
            }}
          />
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={450}
      />

      <button onClick={() => setFace("frente")}>frente</button>
      <button onClick={() => setFace("costas")}>costedo</button>

      <button onClick={handleGuardar} disabled={aGuardar || !imagem}>
        {aGuardar ? "A guardar..." : "Guardar design"}
      </button>
    </div>
  );
}

export default PaginaPersonalizar;
