
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
    const itens = Array.isArray(comanda) ? comanda : comanda.itens || [];
    return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const totalVendasGeral = () => {
    return Object.keys(comandasDoDia).reduce((total, mesaId) => {
      return total + totalComanda(mesaId);
    }, 0);
  };

  // Função para imprimir comanda individual
  const imprimirComandaIndividual = (mesaId) => {
    const mesa = mesas.find(m => m.id === Number(mesaId));
    const nomeMesa = mesa ? mesa.nome : `Mesa ${mesaId}`;
    const comanda = comandasDoDia[mesaId];
    if (!comanda) {
      alert("Comanda vazia.");
      return;
    }
    const status = comanda.status || "Aberta";
    const itens = Array.isArray(comanda) ? comanda : comanda.itens || [];

    let html = `<html><head><title>Comanda - ${nomeMesa} - ${dataSelecionada}</title><style>
      body { font-family: Arial, sans-serif; margin: 10px; }
      h1 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
    </style></head><body>`;

    html += `<h1>Comanda - ${nomeMesa}</h1>`;
    html += `<h2>Status: ${status}</h2>`;
    html += `<table><thead><tr><th>Item</th><th>Quantidade</th><th>Preço Unitário</th><th>Subtotal</th></tr></thead><tbody>`;

    itens.forEach(({ nome, quantidade, preco }) => {
      html += `<tr><td>${nome}</td><td>${quantidade}</td><td>R$ ${preco.toFixed(2)}</td><td>R$ ${(quantidade * preco).toFixed(2)}</td></tr>`;
    });

    html += `</tbody><tfoot><tr><td colspan="3"><strong>Total</strong></td><td><strong>R$ ${totalComanda(mesaId).toFixed(2)}</strong></td></tr></tfoot></table>`;
    html += `</body></html>`;

    const printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Comandas do Restaurante</h1>

      <div style={{ marginBottom: 15 }}>
        <label>
          Data:{" "}
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: 15 }}>
        <button onClick={adicionarMesa}>Adicionar Mesa</button>{" "}
        <button onClick={limparHistorico} style={{ backgroundColor: "#f44336", color: "white" }}>
          Limpar Histórico do Dia
        </button>{" "}
        <label style={{ marginLeft: 20 }}>
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
          />{" "}
          Mostrar comandas finalizadas
        </label>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2>Mesas</h2>
          <ul>
            {mesas.map((mesa) => (
              <li key={mesa.id} style={{ marginBottom: 5 }}>
                <button
                  style={{
                    fontWeight: mesaSelecionada === mesa.id ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                  onClick={() => setMesaSelecionada(mesa.id)}
                >
                  {mesa.nome}
                </button>{" "}
                <button
                  onClick={() => editarNomeMesa(mesa.id)}
                  style={{ marginLeft: 5 }}
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 2, minWidth: 300 }}>
          <h2>Itens do Cardápio</h2>
          {categoriasOrdenadas.map((categoria) => (
            <div key={categoria} style={{ marginBottom: 15 }}>
              <h3>{categoria}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {produtosPorCategoria[categoria].map((produto) => (
                  <button
                    key={produto.nome}
                    onClick={() => adicionarItem(produto)}
                    style={{ cursor: "pointer" }}
                    title={`R$ ${produto.preco.toFixed(2)}`}
                  >
                    {produto.nome} - R$ {produto.preco.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 2, minWidth: 300 }}>
          {!mostrarFinalizadas && (
            <>
              <h2>Comandas Abertas</h2>
              {Object.entries(comandasDoDia)
                .filter(([_, comanda]) => (comanda.status || "Aberta") === "Aberta")
                .map(([mesaId, comanda]) => {
                  const mesa = mesas.find((m) => m.id === Number(mesaId));
                  const nomeMesa = mesa ? mesa.nome : `Mesa ${mesaId}`;
                  const itens = Array.isArray(comanda) ? comanda : comanda.itens || [];
                  return (
                    <div
                      key={mesaId}
                      style={{
                        marginBottom: 15,
                        padding: 10,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                      }}
                    >
                      <h3>{nomeMesa}</h3>
                      <ul>
                        {itens.map((item, idx) => (
                          <li key={idx}>
                            {item.nome} x {item.quantidade}{" "}
                            <button
                              onClick={() => removerItem(mesaId, item.nome)}
                              style={{ marginLeft: 5 }}
                            >
                              Remover
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div>
                        <strong>Total: R$ {totalComanda(mesaId).toFixed(2)}</strong>
                      </div>
                      <button
                        onClick={() => imprimirComandaIndividual(mesaId)}
                        style={{ marginRight: 10 }}
                      >
                        Imprimir
                      </button>
                      <button onClick={() => toggleStatus(mesaId)}>Finalizar</button>{" "}
                      <button onClick={() => limparComanda(mesaId)}>Limpar</button>{" "}
                      <button onClick={() => excluirComanda(mesaId)}>Excluir</button>
                    </div>
                  );
                })}
            </>
          )}

          {mostrarFinalizadas && (
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <h2>Comandas Abertas</h2>
                {Object.entries(comandasDoDia)
                  .filter(([_, comanda]) => (comanda.status || "Aberta") === "Aberta")
                  .map(([mesaId, comanda]) => {
                    const mesa = mesas.find((m) => m.id === Number(mesaId));
                    const nomeMesa = mesa ? mesa.nome : `Mesa ${mesaId}`;
                    const itens = Array.isArray(comanda) ? comanda : comanda.itens || [];
                    return (
                      <div
                        key={mesaId}
                        style={{
                          marginBottom: 15,
                          padding: 10,
                          border: "1px solid #ccc",
                          borderRadius: 6,
                        }}
                      >
                        <h3>{nomeMesa}</h3>
                        <ul>
                          {itens.map((item, idx) => (
                            <li key={idx}>
                              {item.nome} x {item.quantidade}{" "}
                              <button
                                onClick={() => removerItem(mesaId, item.nome)}
                                style={{ marginLeft: 5 }}
                              >
                                Remover
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div>
                          <strong>Total: R$ {totalComanda(mesaId).toFixed(2)}</strong>
                        </div>
                        <button
                          onClick={() => imprimirComandaIndividual(mesaId)}
                          style={{ marginRight: 10 }}
                        >
                          Imprimir
                        </button>
                        <button onClick={() => toggleStatus(mesaId)}>Finalizar</button>{" "}
                        <button onClick={() => limparComanda(mesaId)}>Limpar</button>{" "}
                        <button onClick={() => excluirComanda(mesaId)}>Excluir</button>
                      </div>
                    );
                  })}
              </div>

              <div style={{ flex: 1, minWidth: 300 }}>
                <h2>Comandas Finalizadas</h2>
                {Object.entries(comandasDoDia)
                  .filter(([_, comanda]) => (comanda.status || "Aberta") === "Finalizada")
                  .map(([mesaId, comanda]) => {
                    const mesa = mesas.find((m) => m.id === Number(mesaId));
                    const nomeMesa = mesa ? mesa.nome : `Mesa ${mesaId}`;
                    const itens = Array.isArray(comanda) ? comanda : comanda.itens || [];
                    return (
                      <div
                        key={mesaId}
                        style={{
                          marginBottom: 15,
                          padding: 10,
                          border: "1px solid #ccc",
                          borderRadius: 6,
                          backgroundColor: "#f9e6e6",
                        }}
                      >
                        <h3>{nomeMesa}</h3>
                        <ul>
                          {itens.map((item, idx) => (
                            <li key={idx}>
                              {item.nome} x {item.quantidade}{" "}
                              <button
                                onClick={() => removerItem(mesaId, item.nome)}
                                style={{ marginLeft: 5 }}
                              >
                                Remover
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div>
                          <strong>Total: R$ {totalComanda(mesaId).toFixed(2)}</strong>
                        </div>
                        <button
                          onClick={() => imprimirComandaIndividual(mesaId)}
                          style={{ marginRight: 10 }}
                        >
                          Imprimir
                        </button>
                        <button onClick={() => toggleStatus(mesaId)}>Reabrir</button>{" "}
                        <button onClick={() => limparComanda(mesaId)}>Limpar</button>{" "}
                        <button onClick={() => excluirComanda(mesaId)}>Excluir</button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Total Geral de Vendas: R$ {totalVendasGeral().toFixed(2)}</h2>
      </div>
    </div>
  );
}

export default App;
