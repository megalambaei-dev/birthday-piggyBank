import { useEffect, useState } from "react";

function FormularioDoacoes() {
  return (
    <>
      <form style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <label htmlFor="name">Nome</label>
        <input type="text" placeholder="Primeiro nome"></input>
        <label htmlFor="email">Email</label>
        <input type="email" placeholder="Exemplo: xxx@gmail.com"></input>
        <label htmlFor="emailV">Email</label>
        <input type="email" placeholder="Exemplo: xxx@gmail.com"></input>
        <label htmlFor="donation">Valor a doar </label>
        <input type="number" placeholder="Valor"></input>
      </form>
    </>
  );
}

export default FormularioDoacoes;
