import { useState, useEffect, useRef } from "react";

const produtosPorCategoria = {
  "Refeição": [
    { nome: "Camaroada P", preco: 80 },
    { nome: "Camaroada G", preco: 140 },
    { nome: "Camarão ao Alho P", preco: 50 },
    { nome: "Camarão ao Alho G", preco: 100 },
    { nome: "Pescada Cozida P", preco: 80 },
    { nome: "Pescada Cozida G", preco: 150 },
    { nome: "Pescada Frita P", preco: 70 },
    { nome: "Pescada Frita G", preco: 130 },
    { nome: "Carne de Sol P", preco: 60 },
    { nome: "Carne de Sol G", preco: 120 },
    { nome: "Mocotó P", preco: 30 },
    { nome: "Mocotó G", preco: 50 },
    { nome: "Galinha Caipira (encomenda)", preco: 170 },
  ],
  "Tira Gosto": [
    { nome: "Batata Frita", preco: 25 },
    { nome: "Carne de Sol", preco: 50 },
    { nome: "Calabresa", preco: 30 },
    { nome: "Azeitona com queijo", preco: 30 },
    { nome: "Camarão ao Alho", preco: 40 },
  ],
  "Cervejas": [
    { nome: "SKOL", preco: 10 },
    { nome: "BRAHMA", preco: 10 },
    { nome: "HEINEKEN", preco: 15 },
    { nome: "STELLA", preco: 15 },
    { nome: "HEINEKEN LONG NK", preco: 10 },
    { nome: "STELLA LONG NK", preco: 10 },
    { nome: "BRAHMA LONG NK", preco: 5.5 },
    { nome: "ICE", preco: 10 },
  ],
  "Bebidas": [
    { nome: "Refrigerante 2L", preco: 15 },
    { nome: "Refrigerante 1,5L", preco: 10 },
    { nome: "Refrigerante 1L", preco: 8 },
    { nome: "Refrigerante Lata", preco: 5 },
    { nome: "Refrigerante 290ml", preco: 5 },
  ],
  "Sucos": [
    { nome: "Acerola Copo (300ml)", preco: 6 },
    { nome: "Bacuri Copo (300ml)", preco: 8 },
    { nome: "Goiaba Copo (300ml)", preco: 6 },
    { nome: "Acerola Jarra", preco: 20 },
    { nome: "Bacuri Jarra", preco: 20 },
    { nome: "Goiaba Jarra", preco: 20 },
  ],
  "Agua/Energético": [
    { nome: "Agua mineral P", preco: 3 },
    { nome: "Agua mineral G", preco: 5 },
    { nome: "Energético", preco: 10 },
  ],
  "Picolé": [
    { nome: "Picolé de 5", preco: 5 },
    { nome: "Picolé de 6", preco: 6 },
    { nome: "Picolé de 8", preco: 8 },
    { nome: "Picolé de 10", preco: 10 },
    { nome: "Picolé de 12", preco: 12 },
  ],
};

const categoriasOrdenadas = [
  "Refeição",
  "Tira Gosto",
  "Cervejas",
  "Bebidas",
  "Sucos",
  "Agua/Energético",
  "Picolé",
];

function App() {
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || {});
  const [dataSelecionada, setDataSelecionada] = useState(() => localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10));
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  // Sincroniza com localStorage
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
    localStorage.setItem("comandas", JSON.stringify(comandas));
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [mesas, comandas, dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Funções (adicionar mesa, editar mesa, adicionar item, remover item, etc) - igual ao que você já passou

  // -- Código das funções igual ao que você já enviou --

  // Vou incluir o header finalizado e render completo com tudo integrado

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", fontFamily: "Arial, sans-serif", padding: "0 16px" }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ textAlign: "center", marginBottom: 10 }}>Sistema de Comandas - Restaurante</h1>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <button onClick={adicionarMesa} type="button">
            Adicionar Mesa
          </button>
          <div>
            <label htmlFor="dataSelecionada">Data:</label>{" "}
            <input
              id="dataSelecionada"
              type="date"
              value={dataSelecionada}
              onChange={e => {
                setDataSelecionada(e.target.value);
                setMesaSelecionada(null);
              }}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={mostrarFinalizadas}
                onChange={e => {
                  setMostrarFinalizadas(e.target.checked);
                  setMesaSelecionada(null);
                }}
              />
              Mostrar Finalizadas
            </label>
          </div>
          <button onClick={imprimirTodas} type="button">
            Imprimir Todas Finalizadas
          </button>
          <button onClick={limparHistorico} type="button" style={{ color: "red" }}>
            Limpar Histórico
          </button>
        </div>
      </header>

      <main style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <section style={{ flex: 1, minWidth: 300 }}>
          <h2>Mesas / Comandas ({mostrarFinalizadas ? "Finalizadas" : "Abertas"})</h2>
          {renderComandas()}
          <div style={{ marginTop: 20, fontWeight: "bold" }}>
            Total Geral Vendas: R$ {totalGeralVendas().toFixed(2)}
          </div>
        </section>

        <section style={{ flex: 1, minWidth: 300 }}>
          <h2>Cardápio</h2>
          {renderCardapio()}
        </section>
      </main>
    </div>
  );
}

export default App;
