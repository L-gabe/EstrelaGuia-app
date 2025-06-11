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
  const printRef = useRef();

  // Persistência no localStorage
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem("comandas", JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Funções para mesas
  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim()) {
      setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
    }
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim()) {
      setMesas(prev => prev.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
    }
  };

  // Adicionar item na comanda
  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }
    const mesaId = mesaSelecionada;
    const com = comandasDoDia[mesaId];
    const comanda = com && !Array.isArray(com)
      ? { ...com }
      : { status: "Aberta", itens: [] };

    if (!Array.isArray(comanda.itens)) {
      comanda.itens = [];
    }

    const idx = comanda.itens.findIndex(i => i.nome === item.nome);
    if (idx >= 0) {
      comanda.itens[idx].quantidade += 1;
    } else {
      comanda.itens.push({ ...item, quantidade: 1 });
    }

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      }
    }));
  };

  // Remover item da comanda
  const removerItem = (mesaId, nomeItem) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;

    const comanda = { ...com };
    if (!Array.isArray(comanda.itens)) return;

    const itensFiltrados = comanda.itens.filter(i => i.nome !== nomeItem);
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: itensFiltrados },
      },
    }));
  };

  // Alternar status da comanda
  const toggleStatus = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;

    const comanda = { ...com };
    const novoStatus = comanda.status === "Finalizada" ? "Aberta" : "Finalizada";

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, status: novoStatus },
      }
    }));
  };

  // Limpar itens da comanda
  const limparComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;

    const comanda = { ...com, itens: [], status: "Aberta" };
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      }
    }));
  };

  // Excluir comanda (remove a chave da comanda para a mesa)
  const excluirComanda = (mesaId) => {
    if (!window.confirm("Tem certeza que deseja excluir essa comanda?")) return;

    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandasDoDia
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Limpar histórico do dia (todas as comandas do dia)
  const limparHistorico = () => {
    if (!window.confirm(`Deseja limpar todo o histórico do dia ${dataSelecionada}?`)) return;
    const novasComandas = { ...comandas };
    delete novasComandas[dataSelecionada];
    setComandas(novasComandas);
    setMesaSelecionada(null);
  };

  // Total de vendas geral do dia
  const totalVendasDoDia = () => {
    const dia = comandasDoDia;
    if (!dia) return 0;
    let total = 0;
    for (const mesaId in dia) {
      const com = dia[mesaId];
      if (!com || Array.isArray(com)) continue;
      if (com.status === "Finalizada") {
        total += com.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
      }
    }
    return total.toFixed(2);
  };

  // Impressão das comandas do dia
  const imprimirTodasComandas = () => {
    if (!printRef.current) return;

    const conteudo = printRef.current.innerHTML;
    const janela = window.open("", "_blank");
    janela.document.write(`
      <html>
        <head><title>Imprimir Comandas</title></head>
        <body>${conteudo}</body>
      </html>
    `);
    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  };

  // Selecionar data
  const alterarData = (evt) => {
    setDataSelecionada(evt.target.value);
    setMesaSelecionada(null);
  };

  // Mesas que tem comanda
  const mesasComComanda = Object.keys(comandasDoDia);

  // Separar comandas abertas e finalizadas
  const comandasAbertas = mesasComComanda.filter(id => comandasDoDia[id]?.status === "Aberta");
  const comandasFinalizadas = mesasComComanda.filter(id => comandasDoDia[id]?.status === "Finalizada");

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 1200, margin: "auto", padding: 20 }}>
      <h1>Controle de Vendas e Comandas - Restaurante</h1>

      <section style={{ marginBottom: 20 }}>
        <label>
          Data:{" "}
          <input type="date" value={dataSelecionada} onChange={alterarData} />
        </label>

        <button style={{ marginLeft: 10 }} onClick={adicionarMesa}>Adicionar Mesa</button>
        <button style={{ marginLeft: 10, backgroundColor: "#ff4d4d", color: "white" }} onClick={limparHistorico}>
          Limpar Histórico do Dia
        </button>
      </section>

      <section style={{ display: "flex", gap: 20 }}>
        {/* Listagem de mesas */}
        <div style={{ flex: "1 1 200px" }}>
          <h2>Mesas</h2>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {mesas.map(mesa => (
              <li
                key={mesa.id}
                style={{
                  marginBottom: 6,
                  cursor: "pointer",
                  backgroundColor: mesaSelecionada === mesa.id ? "#def" : "#eee",
                  padding: "6px 10px",
                  borderRadius: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => setMesaSelecionada(mesa.id)}
              >
                <span>{mesa.nome}</span>
                <button
                  style={{ marginLeft: 10 }}
                  onClick={e => {
                    e.stopPropagation();
                    editarNomeMesa(mesa.id);
                  }}
                  title="Editar nome da mesa"
                >
                  ✏️
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Cardápio */}
        <div style={{ flex: 2 }}>
          <h2>Cardápio (clique para adicionar)</h2>
          {categoriasOrdenadas.map(categoria => (
            <div key={categoria} style={{ marginBottom: 12 }}>
              <h3>{categoria}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {produtosPorCategoria[categoria].map(produto => (
                  <button
                    key={produto.nome}
                    onClick={() => adicionarItem(produto)}
                    disabled={!mesaSelecionada}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      cursor: mesaSelecionada ? "pointer" : "not-allowed",
                      backgroundColor: mesaSelecionada ? "#fff" : "#f9f9f9",
                    }}
                    title={mesaSelecionada ? "" : "Selecione uma mesa para adicionar itens"}
                  >
                    {produto.nome} - R$ {produto.preco.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comanda da mesa selecionada */}
        <div style={{ flex: "1 1 350px", border: "1px solid #ddd", padding: 10, borderRadius: 6 }}>
          <h2>Comanda</h2>
          {!mesaSelecionada && <p>Selecione uma mesa para ver a comanda.</p>}
          {mesaSelecionada && (
            <>
              <h3>Mesa: {mesas.find(m => m.id === mesaSelecionada)?.nome || "Desconhecida"}</h3>
              {(!comandasDoDia[mesaSelecionada] || comandasDoDia[mesaSelecionada].itens.length === 0) && (
                <p>Comanda vazia.</p>
              )}
              {comandasDoDia[mesaSelecionada]?.itens && comandasDoDia[mesaSelecionada].itens.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "1px solid #ddd", paddingBottom: 4, textAlign: "left" }}>Item</th>
                      <th style={{ borderBottom: "1px solid #ddd", paddingBottom: 4, textAlign: "right" }}>Qtd</th>
                      <th style={{ borderBottom: "1px solid #ddd", paddingBottom: 4, textAlign: "right" }}>Preço</th>
                      <th style={{ borderBottom: "1px solid #ddd", paddingBottom: 4, textAlign: "right" }}>Total</th>
                      <th style={{ borderBottom: "1px solid #ddd", paddingBottom: 4, textAlign: "center" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comandasDoDia[mesaSelecionada].itens.map(item => (
                      <tr key={item.nome}>
                        <td>{item.nome}</td>
                        <td style={{ textAlign: "right" }}>{item.quantidade}</td>
                        <td style={{ textAlign: "right" }}>R$ {item.preco.toFixed(2)}</td>
                        <td style={{ textAlign: "right" }}>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                        <td style={{ textAlign: "center" }}>
                          <button onClick={() => removerItem(mesaSelecionada, item.nome)} title="Remover item">
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ fontWeight: "bold", textAlign: "right" }}>Total:</td>
                      <td style={{ fontWeight: "bold", textAlign: "right" }}>
                        R$ {comandasDoDia[mesaSelecionada].itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              )}

              <div style={{ marginTop: 10 }}>
                <button onClick={() => toggleStatus(mesaSelecionada)}>
                  {comandasDoDia[mesaSelecionada]?.status === "Finalizada" ? "Reabrir" : "Finalizar"}
                </button>
                <button onClick={() => limparComanda(mesaSelecionada)} style={{ marginLeft: 6 }}>
                  Limpar
                </button>
                <button onClick={() => excluirComanda(mesaSelecionada)} style={{ marginLeft: 6, color: "red" }}>
                  Excluir Comanda
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Listagem geral das comandas do dia */}
      <section style={{ marginTop: 30 }}>
        <h2>Comandas do Dia ({dataSelecionada})</h2>

        <label>
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={e => setMostrarFinalizadas(e.target.checked)}
          />{" "}
          Mostrar comandas finalizadas
        </label>

        <div
          ref={printRef}
          style={{
            marginTop: 10,
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            maxHeight: 400,
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: 10,
            borderRadius: 6,
          }}
        >
          {/* Comandas abertas */}
          {comandasAbertas.length === 0 && <p>Não há comandas abertas.</p>}
          {comandasAbertas.map(mesaId => {
            const mesa = mesas.find(m => m.id === mesaId);
            const comanda = comandasDoDia[mesaId];
            if (!mesa || !comanda) return null;
            return (
              <div
                key={mesaId}
                style={{
                  flex: "1 1 300px",
                  border: "2px solid #28a745",
                  borderRadius: 6,
                  padding: 8,
                  backgroundColor: "#e6ffe6",
                }}
              >
                <h3>{mesa.nome} (Aberta)</h3>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {comanda.itens.map(item => (
                    <li key={item.nome}>
                      {item.nome} x {item.quantidade} = R$ {(item.preco * item.quantidade).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p style={{ fontWeight: "bold" }}>
                  Total: R$ {comanda.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2)}
                </p>
              </div>
            );
          })}

          {/* Comandas finalizadas */}
          {mostrarFinalizadas && (
            <>
              {comandasFinalizadas.length === 0 && <p>Não há comandas finalizadas.</p>}
              {comandasFinalizadas.map(mesaId => {
                const mesa = mesas.find(m => m.id === mesaId);
                const comanda = comandasDoDia[mesaId];
                if (!mesa || !comanda) return null;
                return (
                  <div
                    key={mesaId}
                    style={{
                      flex: "1 1 300px",
                      border: "2px solid #999",
                      borderRadius: 6,
                      padding: 8,
                      backgroundColor: "#f0f0f0",
                      opacity: 0.7,
                    }}
                  >
                    <h3>{mesa.nome} (Finalizada)</h3>
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      {comanda.itens.map(item => (
                        <li key={item.nome}>
                          {item.nome} x {item.quantidade} = R$ {(item.preco * item.quantidade).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <p style={{ fontWeight: "bold" }}>
                      Total: R$ {comanda.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div style={{ marginTop: 10, fontWeight: "bold", fontSize: 18 }}>
          Total Geral das Comandas Finalizadas: R$ {totalVendasDoDia()}
        </div>

        <button
          onClick={imprimirTodasComandas}
          style={{ marginTop: 10, padding: "8px 16px", cursor: "pointer" }}
        >
          Imprimir Todas as Comandas do Dia
        </button>
      </section>
    </div>
  );
}

export default App;
