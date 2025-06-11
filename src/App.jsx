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
    } else if (!comanda.itens) {
      // Caso o comanda esteja em formato antigo (array)
      comanda = { status: comanda.status || "Aberta", itens: Array.isArray(comanda) ? comanda : comanda.itens || [] };
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
    if (!comanda.itens) {
      comanda = { status: comanda.status || "Aberta", itens: Array.isArray(comanda) ? comanda : [] };
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
    if (!comanda.itens) {
      comanda = { status: comanda.status || "Aberta", itens: Array.isArray(comanda) ? comanda : [] };
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
    if (!comanda.itens) {
      comanda = { status: comanda.status || "Aberta", itens: Array.isArray(comanda) ? comanda : [] };
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
    if (!comanda || !comanda.itens) return 0;
    return comanda.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  };

  const totalGeral = () => {
    if (!comandasDoDia) return 0;
    return Object.entries(comandasDoDia)
      .filter(([_, c]) => c.status === "Finalizada")
      .reduce((acc, [mesaId, c]) => acc + totalComanda(mesaId), 0);
  };

  const imprimirComanda = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda || !comanda.itens || comanda.itens.length === 0) {
      alert("Comanda vazia.");
      return;
    }

    let conteudo = `<h2>Comanda Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h2>`;
    conteudo += `<p>Data: ${dataSelecionada}</p>`;
    conteudo += "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse:collapse; width:100%;'>";
    conteudo += "<thead><tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Total</th></tr></thead><tbody>";

    comanda.itens.forEach(item => {
      conteudo += `<tr>
        <td>${item.nome}</td>
        <td style="text-align:center">${item.quantidade}</td>
        <td style="text-align:right">R$ ${item.preco.toFixed(2)}</td>
        <td style="text-align:right">R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
      </tr>`;
    });

    conteudo += "</tbody></table>";
    conteudo += `<h3>Total: R$ ${totalComanda(mesaId).toFixed(2)}</h3>`;

    const win = window.open("", "", "width=400,height=600");
    win.document.write(`<html><head><title>Comanda</title></head><body>${conteudo}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const mesasOrdenadas = mesas.sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <div style={{ padding: 10, fontFamily: "Arial, sans-serif" }}>
      <h1>Controle de Comandas</h1>

      <label>
        Data:
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => {
            setDataSelecionada(e.target.value);
            setMesaSelecionada(null);
          }}
          style={{ marginLeft: 10, marginBottom: 10 }}
        />
      </label>

      <button onClick={adicionarMesa} style={{ marginLeft: 20 }}>
        + Adicionar Mesa
      </button>

      <button onClick={limparHistorico} style={{ marginLeft: 20 }}>
        Limpar Histórico do Dia
      </button>

      <hr />

      <div style={{ display: "flex", gap: 30 }}>
        {/* Lista de Mesas */}
        <div style={{ flex: 1, maxWidth: 200 }}>
          <h2>Mesas</h2>
          {mesasOrdenadas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {mesasOrdenadas.map((mesa) => (
              <li key={mesa.id} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setMesaSelecionada(mesa.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: mesaSelecionada === mesa.id ? "#cce5ff" : "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: "6px 8px",
                    cursor: "pointer",
                  }}
                >
                  {mesa.nome}
                </button>
                <button
                  onClick={() => editarNomeMesa(mesa.id)}
                  style={{ marginLeft: 5, cursor: "pointer" }}
                  title="Editar nome da mesa"
                >
                  ✎
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Seção Cardápio */}
        <div style={{ flex: 2, maxWidth: 400 }}>
          <h2>Cardápio</h2>
          {mesaSelecionada ? (
            <>
              {categoriasOrdenadas.map((categoria) => (
                <div key={categoria} style={{ marginBottom: 15 }}>
                  <h3>{categoria}</h3>
                  <ul style={{ listStyle: "none", paddingLeft: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {produtosPorCategoria[categoria].map((item) => (
                      <li key={item.nome}>
                        <button
                          onClick={() => adicionarItem(item)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 5,
                            border: "1px solid #ccc",
                            cursor: "pointer",
                            backgroundColor: "#fafafa",
                          }}
                          title={`Adicionar ${item.nome} - R$ ${item.preco.toFixed(2)}`}
                        >
                          {item.nome} <br /> R$ {item.preco.toFixed(2)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <p>Selecione uma mesa para adicionar itens.</p>
          )}
        </div>

        {/* Seção Comandas */}
        <div style={{ flex: 3, maxWidth: 600 }}>
          <h2>Comandas do Dia</h2>
          <label>
            <input
              type="checkbox"
              checked={mostrarFinalizadas}
              onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
            />
            Mostrar comandas finalizadas
          </label>

          <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
            {/* Comandas Abertas */}
            <div style={{ flex: 1 }}>
              <h3>Comandas Abertas</h3>
              {Object.entries(comandasDoDia)
                .filter(([mesaId, c]) => c.status === "Aberta")
                .length === 0 && <p>Sem comandas abertas.</p>}
              {Object.entries(comandasDoDia)
                .filter(([mesaId, c]) => c.status === "Aberta")
                .map(([mesaId, comanda]) => (
                  <div
                    key={mesaId}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 5,
                      padding: 10,
                      marginBottom: 10,
                      backgroundColor: mesaSelecionada === mesaId ? "#e6f7ff" : "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => setMesaSelecionada(mesaId)}
                  >
                    <strong>Mesa: {mesas.find(m => m.id === mesaId)?.nome || mesaId}</strong>{" "}
                    <button onClick={(e) => { e.stopPropagation(); toggleStatus(mesaId); }} style={{ float: "right" }}>
                      Finalizar
                    </button>
                    {comanda.itens && comanda.itens.length > 0 ? (
                      <ul style={{ marginTop: 5, paddingLeft: 20 }}>
                        {comanda.itens.map((item) => (
                          <li key={item.nome} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>
                              {item.nome} x{item.quantidade} - R$ {(item.preco * item.quantidade).toFixed(2)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removerItem(mesaId, item.nome);
                              }}
                              style={{ marginLeft: 10 }}
                              title="Remover item"
                            >
                              ✖
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Sem itens</p>
                    )}
                    <p><b>Total:</b> R$ {totalComanda(mesaId).toFixed(2)}</p>
                    <button onClick={(e) => { e.stopPropagation(); limparComanda(mesaId); }}>Limpar</button>{" "}
                    <button onClick={(e) => { e.stopPropagation(); imprimirComanda(mesaId); }}>Imprimir</button>{" "}
                    <button onClick={(e) => { e.stopPropagation(); excluirComanda(mesaId); }}>Excluir</button>
                  </div>
                ))}
            </div>

            {/* Comandas Finalizadas */}
            {mostrarFinalizadas && (
              <div style={{ flex: 1 }}>
                <h3>Comandas Finalizadas</h3>
                {Object.entries(comandasDoDia)
                  .filter(([mesaId, c]) => c.status === "Finalizada")
                  .length === 0 && <p>Sem comandas finalizadas.</p>}
                {Object.entries(comandasDoDia)
                  .filter(([mesaId, c]) => c.status === "Finalizada")
                  .map(([mesaId, comanda]) => (
                    <div
                      key={mesaId}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: 5,
                        padding: 10,
                        marginBottom: 10,
                        backgroundColor: "#f6f6f6",
                        cursor: "pointer",
                      }}
                      onClick={() => setMesaSelecionada(mesaId)}
                    >
                      <strong>Mesa: {mesas.find(m => m.id === mesaId)?.nome || mesaId}</strong>{" "}
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(mesaId); }} style={{ float: "right" }}>
                        Reabrir
                      </button>
                      {comanda.itens && comanda.itens.length > 0 ? (
                        <ul style={{ marginTop: 5, paddingLeft: 20 }}>
                          {comanda.itens.map((item) => (
                            <li key={item.nome}>
                              {item.nome} x{item.quantidade} - R$ {(item.preco * item.quantidade).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Sem itens</p>
                      )}
                      <p><b>Total:</b> R$ {totalComanda(mesaId).toFixed(2)}</p>
                      <button onClick={(e) => { e.stopPropagation(); imprimirComanda(mesaId); }}>Imprimir</button>{" "}
                      <button onClick={(e) => { e.stopPropagation(); excluirComanda(mesaId); }}>Excluir</button>
                    </div>
                  ))}
                <h4>Total Geral das Finalizadas: R$ {totalGeral().toFixed(2)}</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
