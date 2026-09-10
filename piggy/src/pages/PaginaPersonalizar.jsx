import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const URL = import.meta.env.VITE_SCRIPT_URL;

// área reservada na t-shirt (ajusta às coordenadas do teu mockup)
const AREA = { x: 150, y: 120, largura: 150, altura: 180 };
const TAMANHO_IMAGEM = 100; // tamanho fixo da imagem do utilizador

function PaginaPersonalizar() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [estado, setEstado] = useState("a-verificar"); // a-verificar | valido | invalido
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState(null);
  const [pos, setPos] = useState({ x: AREA.x + 25, y: AREA.y + 40 });
  const [aArrastar, setAArrastar] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setEstado("invalido");
      return;
    }
    fetch(`${URL}?acao=verificarToken&token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.valido) {
          setNome(res.nome);
          setEstado("valido");
        } else {
          setEstado("invalido");
        }
      })
      .catch(() => setEstado("invalido"));
  }, [token]);

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
    const x = clamp(
      e.clientX - container.left - TAMANHO_IMAGEM / 2,
      AREA.x,
      AREA.x + AREA.largura - TAMANHO_IMAGEM,
    );
    const y = clamp(
      e.clientY - container.top - TAMANHO_IMAGEM / 2,
      AREA.y,
      AREA.y + AREA.altura - TAMANHO_IMAGEM,
    );
    setPos({ x, y });
  }

  async function handleGuardar() {
    setAGuardar(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const shirt = new Image();
    shirt.src = "/tshirt-mockup.png"; // coloca este ficheiro em /public
    await new Promise((res) => (shirt.onload = res));
    ctx.drawImage(shirt, 0, 0, canvas.width, canvas.height);

    if (imagem) {
      const userImg = new Image();
      userImg.src = imagem;
      await new Promise((res) => (userImg.onload = res));
      ctx.drawImage(userImg, pos.x, pos.y, TAMANHO_IMAGEM, TAMANHO_IMAGEM);
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

  if (estado === "a-verificar") return <p>A verificar o teu link...</p>;
  if (estado === "invalido")
    return <p>Este link é inválido ou já foi utilizado.</p>;
  if (estado === "concluido")
    return <p>O teu design foi guardado. Obrigado, {nome}! 🎉</p>;

  return (
    <div>
      <h2>Personaliza a tua t-shirt, {nome}!</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />

      <div
        onPointerMove={handlePointerMove}
        onPointerUp={() => setAArrastar(false)}
        style={{
          position: "relative",
          width: 400,
          height: 450,
          backgroundImage: "url(/tshirt-mockup.png)",
          backgroundSize: "cover",
        }}
      >
        {/* área reservada, visível como referência */}
        <div
          style={{
            position: "absolute",
            left: AREA.x,
            top: AREA.y,
            width: AREA.largura,
            height: AREA.altura,
            border: "2px dashed rgba(255,255,255,0.6)",
          }}
        />
        {imagem && (
          <img
            src={imagem}
            onPointerDown={() => setAArrastar(true)}
            draggable={false}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: TAMANHO_IMAGEM,
              height: TAMANHO_IMAGEM,
              cursor: "grab",
              touchAction: "none",
            }}
          />
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={450}
        style={{ display: "none" }}
      />

      <button onClick={handleGuardar} disabled={aGuardar || !imagem}>
        {aGuardar ? "A guardar..." : "Guardar design"}
      </button>
    </div>
  );
}

export default PaginaPersonalizar;
