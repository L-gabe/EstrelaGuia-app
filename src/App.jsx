import { useState, useEffect } from "react";

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

  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
    localStorage.setItem("comandas", JSON.stringify(comandas));
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [mesas, comandas, dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim() !== "") {
      setMesas([...mesas, { id: Date.now(), nome: nome.trim() }]);
    }
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim() !== "") {
      setMesas(mesas.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
    }
  };

  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }

    const mesaId = mesaSelecionada;
    let comanda = comandasDoDia[mesaId];

    if (!comanda) {
      comanda = { status: "Aberta", itens: [] };
    } else if (Array.isArray(comanda)) {
      comanda = { status: "Aberta", itens: comanda };
    }

    const indexItem = comanda.itens.findIndex(i => i.nome === item.nome);

    if (indexItem >= 0) {
      comanda.itens[indexItem].quantidade += 1;
    } else {
      comanda.itens.push({ ...item, quantidade: 1 });
    }

    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      },
    });
  };

  const removerItem = (mesaId, nomeItem) => {
    let comanda = comandasDoDia[mesaId];
    if (!comanda) return;
    if (Array.isArray(comanda)) {
      comanda = { status: "Aberta", itens: comanda };
    }
    const novosItens = comanda.itens.filter(i => i.nome !== nomeItem);

    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: novosItens },
      },
    });
  };

  const toggleStatus = (mesaId) => {
    let comanda = comandasDoDia[mesaId];
    if (!comanda) return;
    if (Array.isArray(comanda)) {
      comanda = { status: "Aberta", itens: comanda };
    }
    const novoStatus = comanda.status === "Finalizada" ? "Aberta" : "Finalizada";

    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, status: novoStatus },
      },
    });
  };

  const limparComanda = (mesaId) => {
    let comanda = comandasDoDia[mesaId];
    if (!comanda) return;
    if (Array.isArray(comanda)) {
      comanda = { status: "Aberta", itens: comanda };
    }
    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: [], status: "Aberta" },
      },
    });
  };

  const excluirComanda = (mesaId) => {
    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];

    setComandas({
      ...comandas,
      [dataSelecionada]: novasComandasDoDia,
    });

    if (mesaSelecionada === mesaId) {
      setMesaSelecionada(null);
    }
  };

  const limparHistorico = () => {
    if (window.confirm("Confirma limpeza do histórico de comandas do dia?")) {
      const novasComandas = { ...comandas };
      delete novasComandas[dataSelecionada];
      setComandas(novasComandas);
      setMesaSelecionada(null);
    }
  };

  const totalComanda = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda) return 0;
    const itens = Array.isArray(comanda) ? comanda : comanda.itens;
    return itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  const totalVendasDoDia = () => {
    return Object.keys(comandasDoDia).reduce((acc, mesaId) => acc + totalComanda(mesaId), 0);
  };

  // Separar comandas abertas e finalizadas
  const mesasAberta = Object.entries(comandasDoDia)
    .filter(([, comanda]) => {
      const status = comanda.status || "Aberta";
      return status === "Aberta";
    })
    .map(([mesaId]) => mesaId);

  const mesasFinalizada = Object.entries(comandasDoDia)
    .filter(([, comanda]) => {
      const status = comanda.status || "Aberta";
      return status === "Finalizada";
    })
    .map(([mesaId]) => mesaId);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Controle de Vendas do Restaurante</h1>

      {/* Data Selecionada */}
      <div style={{ marginBottom: 10 }}>
        <label>
          Selecione a data:{" "}
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </label>
      </div>

      {/* Botão Adicionar Mesa */}
      <button onClick={adicionarMesa}>Adicionar Mesa</button>
      <button onClick={limparHistorico} style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}>
        Limpar Histórico do Dia
      </button>

      {/* Lista de Mesas */}
      <h2>Mesas</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            onClick={() => setMesaSelecionada(mesa.id)}
            style={{
              border: mesaSelecionada === mesa.id ? "3px solid blue" : "1px solid #ccc",
              borderRadius: 5,
              padding: 10,
              cursor: "pointer",
              minWidth: 100,
              textAlign: "center",
              userSelect: "none",
              backgroundColor: "#f9f9f9",
            }}
            title="Clique para selecionar. Clique direito para editar."
            onContextMenu={(e) => {
              e.preventDefault();
              editarNomeMesa(mesa.id);
            }}
          >
            {mesa.nome}
          </div>
        ))}
      </div>

      {/* Cardápio por Categoria */}
      <h2>Cardápio</h2>
      <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
        {categoriasOrdenadas.map((categoria) => (
          <div key={categoria} style={{ minWidth: 180, border: "1px solid #ddd", borderRadius: 5, padding: 10 }}>
            <h3>{categoria}</h3>
            {produtosPorCategoria[categoria].map((produto) => (
              <div
                key={produto.nome}
                style={{
                  padding: "5px 10px",
                  borderBottom: "1px solid #eee",
                  cursor: mesaSelecionada ? "pointer" : "not-allowed",
                  color: mesaSelecionada ? "black" : "#aaa",
                  userSelect: "none",
                }}
                onClick={() => adicionarItem(produto)}
                title={mesaSelecionada ? `Adicionar ${produto.nome}` : "Selecione uma mesa primeiro"}
              >
                {produto.nome} - R$ {produto.preco.toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Comandas do dia */}
      <h2>Comandas do Dia ({dataSelecionada})</h2>

      <label>
        <input
          type="checkbox"
          checked={mostrarFinalizadas}
          onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
        />{" "}
        Mostrar comandas finalizadas
      </label>

      <div
        style={{
          display: "flex",
          gap: 15,
          flexWrap: "wrap",
          marginTop: 10,
        }}
      >
        {(mostrarFinalizadas ? mesasFinalizada : mesasAberta).length === 0 && (
          <div>Nenhuma comanda {mostrarFinalizadas ? "finalizada" : "aberta"} no dia.</div>
        )}

        {(mostrarFinalizadas ? mesasFinalizada : mesasAberta).map((mesaId) => {
          const mesa = mesas.find((m) => m.id === Number(mesaId));
          const comanda = comandasDoDia[mesaId];
          if (!mesa || !comanda) return null;

          // Ajustar itens e status
          const status = comanda.status || "Aberta";
          const itens = Array.isArray(comanda) ? comanda : comanda.itens;

          return (
            <div
              key={mesaId}
              style={{
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: 10,
                width: 300,
                backgroundColor: status === "Finalizada" ? "#e0ffe0" : "#fff",
              }}
            >
              <h3>{mesa.nome}</h3>
              <button onClick={() => toggleStatus(mesaId)} style={{ marginBottom: 10 }}>
                {status === "Aberta" ? "Finalizar" : "Reabrir"}
              </button>
              <button onClick={() => limparComanda(mesaId)} style={{ marginLeft: 10, backgroundColor: "orange", color: "black" }}>
                Limpar
              </button>
              <button onClick={() => excluirComanda(mesaId)} style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}>
                Excluir
              </button>
              <ul style={{ listStyle: "none", padding: 0, marginTop: 10, maxHeight: 180, overflowY: "auto" }}>
                {itens.length === 0 && <li>Sem itens na comanda</li>}
                {itens.map((item) => (
                  <li
                    key={item.nome}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}
                  >
                    <span>
                      {item.nome} x {item.quantidade}
                    </span>
                    <span>
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                      <button
                        onClick={() => removerItem(mesaId, item.nome)}
                        style={{
                          marginLeft: 8,
                          cursor: "pointer",
                          background: "transparent",
                          border: "none",
                          color: "red",
                          fontWeight: "bold",
                        }}
                        title="Remover item"
                      >
                        &times;
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <div style={{ fontWeight: "bold", marginTop: 10 }}>
                Total: R$ {totalComanda(mesaId).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      <h2>Total Geral das Vendas do Dia: R$ {totalVendasDoDia().toFixed(2)}</h2>
    </div>
  );
}

export default App;
