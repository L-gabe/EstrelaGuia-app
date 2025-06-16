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
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);

  const comandasDoDia = comandas[dataSelecionada] || {};

  useEffect(() => { localStorage.setItem("mesas", JSON.stringify(mesas)); }, [mesas]);
  useEffect(() => { localStorage.setItem("comandas", JSON.stringify(comandas)); }, [comandas]);
  useEffect(() => { localStorage.setItem("dataSelecionada", dataSelecionada); }, [dataSelecionada]);

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

  const excluirMesa = (id) => {
    if (!window.confirm("Excluir essa mesa e sua comanda?")) return;
    setMesas(prev => prev.filter(m => m.id !== id));
    const novasComandas = { ...comandasDoDia };
    delete novasComandas[id];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandas,
    }));
    if (mesaSelecionada === id) setMesaSelecionada(null);
  };

  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa para adicionar.");
      return;
    }
    const mesaId = mesaSelecionada;
    const comanda = comandasDoDia[mesaId] || { status: "Aberta", itens: [] };
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

  const removerItem = (mesaId, nomeItem) => {
    const comanda = { ...comandasDoDia[mesaId] };
    comanda.itens = comanda.itens.filter(i => i.nome !== nomeItem);
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      },
    }));
  };

  const toggleStatus = (mesaId) => {
    const comanda = { ...comandasDoDia[mesaId] };
    comanda.status = comanda.status === "Finalizada" ? "Aberta" : "Finalizada";
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      },
    }));
  };

  const limparComanda = (mesaId) => {
    const comanda = { ...comandasDoDia[mesaId], itens: [], status: "Aberta" };
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      }
    }));
  };

  const excluirComanda = (mesaId) => {
    const novasComandas = { ...comandasDoDia };
    delete novasComandas[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandas,
    }));
    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  const limparTudo = () => {
    if (!window.confirm("Deseja limpar todas as mesas e comandas do dia?")) return;
    setMesas([]);
    setComandas(prev => ({ ...prev, [dataSelecionada]: {} }));
    setMesaSelecionada(null);
  };
  const imprimirMesa = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda) {
      alert("Comanda vazia.");
      return;
    }
    const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;
    const itens = comanda.itens.map(i => `${i.nome} x${i.quantidade} - R$${(i.preco * i.quantidade).toFixed(2)}`).join('<br>');

    const conteudo = `
      <div style="font-family: monospace; font-size: 12px;">
        <h3>Comanda - ${nomeMesa}</h3>
        <p>Data: ${dataSelecionada}</p>
        <hr/>
        ${itens}
        <hr/>
        <strong>Total: R$${comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0).toFixed(2)}</strong>
      </div>
    `;
    const janela = window.open('', '', 'width=300,height=600');
    janela.document.write(conteudo);
    janela.document.close();
    janela.print();
  };
  const imprimirTodasComandas = () => {
    const mesasIds = Object.keys(comandasDoDia);
    if (mesasIds.length === 0) {
      alert("Não há comandas para imprimir.");
      return;
    }

    let conteudo = `<div style="font-family: monospace; font-size: 12px;">`;
    mesasIds.forEach((mesaId) => {
      const comanda = comandasDoDia[mesaId];
      if (!comanda) return;
      const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;
      conteudo += `
        <h3>Comanda - ${nomeMesa}</h3>
        <p>Data: ${dataSelecionada}</p>
        <hr/>
      `;
      comanda.itens.forEach(item => {
        conteudo += `${item.nome} x${item.quantidade} - R$${(item.preco * item.quantidade).toFixed(2)}<br>`;
      });
      const total = comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0);
      conteudo += `<hr/><strong>Total: R$${total.toFixed(2)}</strong><br><br><hr/><br>`;
    });
    conteudo += `</div>`;

    const janela = window.open('', '', 'width=300,height=600');
    janela.document.write(conteudo);
    janela.document.close();
    janela.print();
  };
  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: 1200,
      margin: "0 auto",
      padding: 20,
      background: "#f9f9f9",
      color: "#222"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Sistema de Comandas</h1>

      {/* Topo */}
      <div style={{
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10
      }}>
        <div>
          <label>Data: </label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={e => {
              setDataSelecionada(e.target.value);
              setMesaSelecionada(null);
            }}
            style={{ padding: "6px 8px", fontSize: 16 }}
          />
        </div>

        <button
          onClick={adicionarMesa}
          style={{ padding: "8px 12px", cursor: "pointer" }}>
          + Adicionar Mesa
        </button>

        <button
          onClick={imprimirTodasComandas}
          style={{
            padding: "8px 12px",
            backgroundColor: "#2d91f0",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}>
          🖨️ Imprimir Todas as Comandas
        </button>

        <button
          onClick={limparTudo}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: "#e55353",
            color: "#fff",
            border: "none",
            borderRadius: 4
          }}>
          🗑️ Limpar Tudo
        </button>
      </div>

      {/* Corpo */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Mesas Abertas */}
        <div style={{
          flex: 1,
          minWidth: 280,
          maxHeight: "70vh",
          overflowY: "auto",
          background: "#fff",
          padding: 10,
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h2>Mesas Abertas</h2>
          {mesasAbertas.length === 0 && <p>Nenhuma mesa aberta.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mesasAbertas.map(mesa => {
              const com = comandasDoDia[mesa.id];
              const itensCount = com?.itens?.reduce((a, i) => a + i.quantidade, 0) || 0;
              return (
                <li
                  key={mesa.id}
                  onClick={() => setMesaSelecionada(mesa.id)}
                  style={{
                    cursor: "pointer",
                    padding: 10,
                    marginBottom: 6,
                    borderRadius: 4,
                    backgroundColor: mesaSelecionada === mesa.id ? "#d0ebff" : "#f0f0f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #ccc"
                  }}
                >
                  <span>{mesa.nome} ({itensCount} itens)</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={e => { e.stopPropagation(); editarNomeMesa(mesa.id); }}
                      title="Editar Nome" style={{ cursor: "pointer" }}>✏️</button>
                    <button onClick={e => { e.stopPropagation(); excluirMesa(mesa.id); }}
                      title="Excluir Mesa" style={{ cursor: "pointer" }}>🗑️</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Cardápio */}
        <div style={{
          flex: 2,
          minWidth: 320,
          maxHeight: "70vh",
          overflowY: "auto",
          background: "#fff",
          padding: 15,
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h2>Cardápio</h2>
          {!mesaSelecionada && <p style={{ color: "#999" }}>Selecione uma mesa para adicionar itens.</p>}

          {mesaSelecionada && categoriasOrdenadas.map(categoria => (
            <div key={categoria} style={{ marginBottom: 20 }}>
              <h3>{categoria}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {produtosPorCategoria[categoria].map(produto => (
                  <button
                    key={produto.nome}
                    onClick={() => adicionarItem(produto)}
                    style={{
                      padding: "6px 10px",
                      cursor: "pointer",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      backgroundColor: "#fafafa",
                      flex: "1 0 45%",
                      maxWidth: "45%",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    {produto.nome} <br /> <strong>R$ {produto.preco.toFixed(2)}</strong>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comanda */}
        <div style={{
          flex: 1,
          minWidth: 280,
          maxHeight: "70vh",
          overflowY: "auto",
          background: "#fff",
          padding: 15,
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h2>Comanda</h2>
          {!mesaSelecionada && <p>Selecione uma mesa para ver a comanda.</p>}

          {mesaSelecionada && (() => {
            const com = comandasDoDia[mesaSelecionada];
            if (!com) return <p>Comanda vazia.</p>;

            const total = com.itens.reduce((a, i) => a + i.preco * i.quantidade, 0);
            return (
              <>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {com.itens.map(item => (
                    <li
                      key={item.nome}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                        cursor: "pointer"
                      }}
                      onClick={() => removerItem(mesaSelecionada, item.nome)}
                      title="Clique para remover o item"
                    >
                      <span>{item.nome} x{item.quantidade}</span>
                      <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <p><strong>Total: R$ {total.toFixed(2)}</strong></p>
                <p>Status: <strong>{com.status}</strong></p>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button onClick={() => toggleStatus(mesaSelecionada)} style={{ cursor: "pointer" }}>
                    {com.status === "Aberta" ? "Finalizar" : "Reabrir"}
                  </button>
                  <button onClick={() => limparComanda(mesaSelecionada)} style={{ cursor: "pointer" }}>Limpar</button>
                  <button onClick={() => excluirComanda(mesaSelecionada)} style={{ cursor: "pointer", color: "red" }}>Excluir</button>
                  <button onClick={() => imprimirMesa(mesaSelecionada)} style={{ cursor: "pointer" }}>Imprimir</button>
                </div>
              </>
            );
          })()}
        </div>
      </div>
      {/* Mesas Finalizadas */}
      <div style={{
        marginTop: 30,
        background: "#fff",
        padding: 15,
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2
          onClick={() => setMostrarFinalizadas(prev => !prev)}
          style={{ cursor: "pointer", userSelect: "none" }}
          title="Clique para expandir/ocultar mesas finalizadas"
        >
          Mesas Finalizadas {mostrarFinalizadas ? "▲" : "▼"}
        </h2>
        {mostrarFinalizadas && (
          <>
            {mesasFinalizadas.length === 0 && <p>Nenhuma mesa finalizada.</p>}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {mesasFinalizadas.map(mesa => {
                const com = comandasDoDia[mesa.id];
                const itensCount = com?.itens?.reduce((a, i) => a + i.quantidade, 0) || 0;
                return (
                  <li
                    key={mesa.id}
                    onClick={() => setMesaSelecionada(mesa.id)}
                    style={{
                      cursor: "pointer",
                      padding: 10,
                      marginBottom: 6,
                      borderRadius: 4,
                      backgroundColor: mesaSelecionada === mesa.id ? "#d0ebff" : "#f0f0f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #ccc"
                    }}
                  >
                    <span>{mesa.nome} ({itensCount} itens)</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={e => { e.stopPropagation(); editarNomeMesa(mesa.id); }}
                        title="Editar Nome"
                        style={{ cursor: "pointer" }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); excluirMesa(mesa.id); }}
                        title="Excluir Mesa"
                        style={{ cursor: "pointer" }}
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Total Geral */}
      <footer style={{
        marginTop: 30,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18
      }}>
        Total Geral do Dia: <span style={{ color: "#27ae60" }}>R$ {totalGeral.toFixed(2)}</span>
      </footer>
    </div>
  );
}

export default App;
