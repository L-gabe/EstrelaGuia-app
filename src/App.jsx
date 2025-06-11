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
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const printRef = useRef();

  useEffect(() => { localStorage.setItem("mesas", JSON.stringify(mesas)); }, [mesas]);
  useEffect(() => { localStorage.setItem("comandas", JSON.stringify(comandas)); }, [comandas]);
  useEffect(() => { localStorage.setItem("dataSelecionada", dataSelecionada); }, [dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Funções

  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim()) setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim()) setMesas(prev => prev.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
  };

  const excluirMesa = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir essa mesa? Isso também removerá a comanda associada.")) return;

    setMesas(prev => prev.filter(m => m.id !== id));

    const novasComandasDoDia = { ...comandasDoDia };
    if (novasComandasDoDia[id]) {
      delete novasComandasDoDia[id];
      setComandas(prev => ({
        ...prev,
        [dataSelecionada]: novasComandasDoDia
      }));
    }

    if (mesaSelecionada === id) setMesaSelecionada(null);
  };

  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }
    const mesaId = mesaSelecionada;
    const com = comandasDoDia[mesaId];
    const comanda = com && !Array.isArray(com) ? { ...com } : { status: "Aberta", itens: [] };
    if (!Array.isArray(comanda.itens)) comanda.itens = [];

    const idx = comanda.itens.findIndex(i => i.nome === item.nome);
    if (idx >= 0) comanda.itens[idx].quantidade += 1;
    else comanda.itens.push({ ...item, quantidade: 1 });

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      }
    }));
  };

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

  const excluirComanda = (mesaId) => {
    if (!window.confirm("Excluir essa comanda?")) return;

    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandasDoDia,
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  const limparTudo = () => {
    if (!window.confirm("Tem certeza que deseja limpar todas as mesas e comandas do dia selecionado?")) return;
    setMesas([]);
    setComandas(prev => ({ ...prev, [dataSelecionada]: {} }));
    setMesaSelecionada(null);
  };

  // Cálculo do total geral do dia
  const totalGeral = Object.values(comandasDoDia).reduce((acc, com) => {
    if (!com || Array.isArray(com)) return acc;
    return acc + com.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  }, 0);

  // Dividir mesas abertas e finalizadas
  const mesasAbertas = mesas.filter(m => !comandasDoDia[m.id] || comandasDoDia[m.id]?.status !== "Finalizada");
  const mesasFinalizadas = mesas.filter(m => comandasDoDia[m.id]?.status === "Finalizada");

  // Função para imprimir mesa
  const imprimirMesa = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda || Array.isArray(comanda)) {
      alert("Não há comanda para esta mesa.");
      return;
    }
    const printContent = `
      <h3>Comanda Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h3>
      <ul>
        ${comanda.itens.map(i => `<li>${i.nome} x${i.quantidade} = R$${(i.preco * i.quantidade).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total: R$${comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0).toFixed(2)}</strong></p>
    `;
    const printWindow = window.open('', '', 'width=400,height=600');
    printWindow.document.write('<html><head><title>Imprimir Comanda</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
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

      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
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

        <button onClick={adicionarMesa} style={{ padding: "8px 12px", cursor: "pointer" }}>
          + Adicionar Mesa
        </button>

        <button
          onClick={limparTudo}
          style={{ padding: "8px 12px", cursor: "pointer", backgroundColor: "#e55353", color: "#fff", border: "none", borderRadius: 4 }}
          title="Limpar todas as mesas e comandas do dia selecionado"
        >
          Limpar Tudo
        </button>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Listagem Mesas Abertas */}
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
                    <button onClick={e => { e.stopPropagation(); editarNomeMesa(mesa.id); }} title="Editar Nome" style={{ cursor: "pointer" }}>✏️</button>
                    <button onClick={e => { e.stopPropagation(); excluirMesa(mesa.id); }} title="Excluir Mesa" style={{ cursor: "pointer" }}>🗑️</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Área Cardápio */}
        <div style={{ flex: 2, minWidth: 320, maxHeight: "70vh", overflowY: "auto", background: "#fff", padding: 15, borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
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
                    {produto.nome} - R$ {produto.preco.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comanda da Mesa Selecionada */}
        <div style={{ flex: 1, minWidth: 280, maxHeight: "70vh", overflowY: "auto", background: "#fff", padding: 15, borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h2>Comanda</h2>
          {!mesaSelecionada && <p>Selecione uma mesa para ver a comanda.</p>}

          {mesaSelecionada && (() => {
            const com = comandasDoDia[mesaSelecionada];
            if (!com) return <p>Comanda vazia.</p>;
            if (Array.isArray(com)) return <p>Comanda vazia.</p>;

            const total = com.itens.reduce((a, i) => a + i.preco * i.quantidade, 0);
            return (
              <>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {com.itens.map(item => (
                    <li
                      key={item.nome}
                      style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, cursor: "pointer" }}
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
                  <button onClick={() => limparComanda(mesaSelecionada)} style={{ cursor: "pointer" }}>Limpar Comanda</button>
                  <button onClick={() => excluirComanda(mesaSelecionada)} style={{ cursor: "pointer", color: "red" }}>Excluir Comanda</button>
                  <button onClick={() => imprimirMesa(mesaSelecionada)} style={{ cursor: "pointer" }}>Imprimir</button>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Mesas Finalizadas */}
      <div style={{ marginTop: 30, background: "#fff", padding: 15, borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
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
                      <button onClick={e => { e.stopPropagation(); editarNomeMesa(mesa.id); }} title="Editar Nome" style={{ cursor: "pointer" }}>✏️</button>
                      <button onClick={e => { e.stopPropagation(); excluirMesa(mesa.id); }} title="Excluir Mesa" style={{ cursor: "pointer" }}>🗑️</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Total Geral */}
      <footer style={{ marginTop: 30, textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
        Total Geral do Dia: R$ {totalGeral.toFixed(2)}
      </footer>
    </div>
  );
}

export default App;
