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
  const [dataSelecionada, setDataSelecionada] = useState(() =>
    localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10)
  );
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
    if (nome && nome.trim()) {
      setMesas([...mesas, { id: Date.now(), nome: nome.trim() }]);
    }
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim()) {
      setMesas(mesas.map((m) => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
    }
  };

  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }
    const mesaId = mesaSelecionada;
    const com = comandasDoDia[mesaId];
    let comanda = !com
      ? { status: "Aberta", itens: [] }
      : Array.isArray(com)
      ? { status: "Aberta", itens: com }
      : { ...com };

    const idx = comanda.itens.findIndex((i) => i.nome === item.nome);
    if (idx >= 0) comanda.itens[idx].quantidade += 1;
    else comanda.itens.push({ ...item, quantidade: 1 });

    setComandas({
      ...comandas,
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: comanda },
    });
  };

  const removerItem = (mesaId, nomeItem) => {
    const com = comandasDoDia[mesaId];
    if (!com) return;
    const comanda = Array.isArray(com)
      ? { status: "Aberta", itens: com }
      : { ...com };
    const itensFiltrados = comanda.itens.filter((i) => i.nome !== nomeItem);

    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: itensFiltrados },
      },
    });
  };

  const toggleStatus = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com) return;
    const comanda = Array.isArray(com) ? { status: "Aberta", itens: com } : { ...com };
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
    const com = comandasDoDia[mesaId];
    if (!com) return;
    const comanda = Array.isArray(com) ? { status: "Aberta", itens: com } : { ...com };
    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: [], status: "Aberta" },
      },
    });
  };

  const excluirComanda = (mesaId) => {
    const novas = { ...comandasDoDia };
    delete novas[mesaId];
    setComandas({ ...comandas, [dataSelecionada]: novas });
    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  const limparHistorico = () => {
    if (confirm("Confirma limpeza do histórico de comandas do dia?")) {
      const novas = { ...comandas };
      delete novas[dataSelecionada];
      setComandas(novas);
      setMesaSelecionada(null);
    }
  };

  const totalComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    const itens = com ? (Array.isArray(com) ? com : com.itens) : [];
    return itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
  };

  const totalGeral = () => {
    return Object.entries(comandasDoDia).reduce((acc, [mid, com]) => {
      const itens = Array.isArray(com) ? com : com.itens || [];
      const status = com.status || "Aberta";
      if (mostrarFinalizadas ? status !== "Finalizada" : status !== "Aberta") return acc;
      return acc + itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
    }, 0);
  };

  const imprimirComanda = (mesaId) => {
    const win = window.open("", "_blank");
    const com = comandasDoDia[mesaId];
    if (!com) {
      alert("Comanda vazia");
      return;
    }
    const itens = Array.isArray(com) ? com : com.itens;
    const status = com.status || "Aberta";
    win.document.write(`<h1>Comanda Mesa: ${
      mesas.find((m) => m.id === mesaId)?.nome || mesaId
    }</h1>`);
    win.document.write(`<p>Data: ${dataSelecionada}</p><p>Status: ${status}</p><ul>`);
    itens.forEach((i) => win.document.write(`<li>${i.nome} - ${i.quantidade} x R$${i.preco.toFixed(2)} = R$${(i.preco * i.quantidade).toFixed(2)}</li>`));
    win.document.write(`</ul><strong>Total: R$${totalComanda(mesaId).toFixed(2)}</strong>`);
    win.document.close(); win.print();
  };

  const imprimirTodasComandas = () => {
    const win = window.open("", "_blank");
    win.document.write(`<h1>Comandas do dia ${dataSelecionada}</h1>`);
    Object.entries(comandasDoDia).forEach(([mesaId, com]) => {
      const itens = Array.isArray(com) ? com : com.itens;
      const status = com.status || "Aberta";
      if (mostrarFinalizadas ? status !== "Finalizada" : status !== "Aberta") return;
      win.document.write(`<h2>Mesa: ${
        mesas.find((m) => m.id === mesaId)?.nome || mesaId
      } (${status})</h2><ul>`);
      itens.forEach((i) =>
        win.document.write(`<li>${i.nome} - ${i.quantidade} x R$${i.preco.toFixed(2)} = R$${(i.preco * i.quantidade).toFixed(2)}</li>`)
      );
      win.document.write(`</ul><strong>Total: R$${totalComanda(mesaId).toFixed(2)}</strong><hr>`);
    });
    win.document.write(`<h2>Total Geral: R$${totalGeral().toFixed(2)}</h2>`);
    win.document.close(); win.print();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Sistema de Comandas</h1>

      <label>
        Data: <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
      </label>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <button onClick={adicionarMesa}>Adicionar Mesa</button>{" "}
        <button onClick={limparHistorico}>Limpar Histórico do Dia</button>{" "}
        <button onClick={imprimirTodasComandas}>Imprimir Todas Comandas</button>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 250 }}>
          <h2>Mesas</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mesas.map(({ id, nome }) => (
              <li
                key={id}
                onClick={() => setMesaSelecionada(id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: mesaSelecionada === id ? "#def" : "#eee",
                  padding: "6px 10px",
                  marginBottom: 4,
                  borderRadius: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span onDoubleClick={() => editarNomeMesa(id)}>{nome}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    excluirComanda(id);
                  }}
                  title="Excluir comanda"
                  style={{ marginLeft: 8 }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 2, minWidth: 300 }}>
          <h2>Cardápio</h2>
          {categoriasOrdenadas.map((categoria) => (
            <div key={categoria} style={{ marginBottom: 12 }}>
              <h3>{categoria}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {produtosPorCategoria[categoria].map((produto) => (
                  <button
                    key={produto.nome}
                    onClick={() => adicionarItem(produto)}
                    style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #ccc", cursor: "pointer" }}
                  >
                    {produto.nome} - R${produto.preco.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 2, minWidth: 300 }}>
          <h2>
            Comanda {mesaSelecionada ? `- ${
              mesas.find((m) => m.id === mesaSelecionada)?.nome
            }` : ""}
          </h2>
          {mesaSelecionada ? (
            <>
              <button onClick={() => imprimirComanda(mesaSelecionada)}>Imprimir Comanda</button>{" "}
              <button onClick={() => limparComanda(mesaSelecionada)}>Limpar Comanda</button>{" "}
              <button onClick={() => toggleStatus(mesaSelecionada)}>
                {comandasDoDia[mesaSelecionada]?.status === "Finalizada"
                  ? "Reabrir"
                  : "Finalizar"}{" "}
                Comanda
              </button>

              <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
                {(comandasDoDia[mesaSelecionada]?.itens || []).map(({ nome, preco, quantidade }) => (
                  <li key={nome} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#f9f9f9",
                    marginBottom: 4,
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}>
                    <span>{nome}</span>
                    <span>
                      {quantidade} x R${preco.toFixed(2)} = R${
                        (preco * quantidade).toFixed(2)
                      }{" "}
                      <button onClick={() => removerItem(mesaSelecionada, nome)} style={{ marginLeft: 6 }}>
                        −
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <p><strong>Total: R${totalComanda(mesaSelecionada).toFixed(2)}</strong></p>
            </>
          ) : (
            <p>Selecione uma mesa para visualizar a comanda.</p>
          )}
        </div>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <label>
        <input type="checkbox" checked={mostrarFinalizadas} onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)} />{" "}
        Mostrar comandas finalizadas
      </label>

      <div style={{ marginTop: 10 }}>
        <h2>Comandas {mostrarFinalizadas ? "(Finalizadas)" : "(Abertas)"} do Dia</h2>
        {Object.entries(comandasDoDia)
          .filter(([mesaId, com]) => {
            const status = com.status || "Aberta";
            return mostrarFinalizadas ? status === "Finalizada" : status === "Aberta";
          })
          .map(([mesaId, com]) => {
            const itens = com.itens || (Array.isArray(com) ? com : []);
            const status = com.status || "Aberta";
            return (
              <div key={mesaId} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10, borderRadius: 6 }}>
                <h3>
                  Mesa: {mesas.find((m) => m.id === mesaId)?.nome || mesaId} - Status: {status}
                </h3>
                <ul>
                  {itens.map(({ nome, preco, quantidade }) => (
                    <li key={nome}>
                      {nome} - {quantidade} x R${preco.toFixed(2)} = R${(preco * quantidade).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p><strong>Total: R${totalComanda(mesaId).toFixed(2)}</strong></p>
                <button onClick={() => imprimirComanda(mesaId)}>Imprimir</button>{" "}
                <button onClick={() => toggleStatus(mesaId)}>
                  {status === "Finalizada" ? "Reabrir" : "Finalizar"}
                </button>{" "}
                <button onClick={() => limparComanda(mesaId)}>Limpar</button>{" "}
                <button onClick={() => excluirComanda(mesaId)}>Excluir</button>
              </div>
            );
          })}
      </div>

      <hr />

      <h2>Total Geral: R${totalGeral().toFixed(2)}</h2>
    </div>
  );
}

export default App;
