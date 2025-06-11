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

    // Evita erro se comanda.itens for undefined
    if (!Array.isArray(comanda.itens)) {
      comanda.itens = [];
    }

    // Atualiza ou adiciona o item
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

  // Excluir comanda
  const excluirComanda = (mesaId) => {
    if (!window.confirm("Deseja realmente excluir esta comanda?")) return;

    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandasDoDia,
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Limpar histórico do dia
  const limparHistorico = () => {
    if (!window.confirm("Deseja limpar todas as comandas do dia?")) return;

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {},
    }));

    setMesaSelecionada(null);
  };

  // Total da comanda
  const totalComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return 0;

    return com.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  // Total geral do dia
  const totalGeral = () => {
    if (!comandasDoDia) return 0;

    return Object.values(comandasDoDia).reduce((acc, com) => {
      if (!com || Array.isArray(com) || !com.itens) return acc;
      return acc + com.itens.reduce((a, i) => a + i.preco * i.quantidade, 0);
    }, 0);
  };

  // Impressão - só imprime a div ref
  const imprimir = () => {
    if (!printRef.current) return;
    const conteudo = printRef.current.innerHTML;
    const win = window.open("", "PRINT", "width=600,height=600");
    win.document.write(`<html><head><title>Comandas</title></head><body>${conteudo}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Controle de Comandas do Restaurante</h1>

      <div style={{ marginBottom: 20 }}>
        <label>
          Data:
          <input
            type="date"
            value={dataSelecionada}
            onChange={e => setDataSelecionada(e.target.value)}
            style={{ marginLeft: 10 }}
          />
        </label>
        <button onClick={limparHistorico} style={{ marginLeft: 20, backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
          Limpar Histórico do Dia
        </button>
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <h2>Mesas</h2>
          <button onClick={adicionarMesa} style={{ marginBottom: 10 }}>Adicionar Mesa</button>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {mesas.map(mesa => (
              <li key={mesa.id} style={{ marginBottom: 6, cursor: "pointer" }}>
                <button
                  onClick={() => setMesaSelecionada(mesa.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: mesaSelecionada === mesa.id ? "#007bff" : "#eee",
                    color: mesaSelecionada === mesa.id ? "white" : "black",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    cursor: "pointer",
                    marginRight: 5,
                  }}
                >
                  {mesa.nome}
                </button>
                <button
                  onClick={() => editarNomeMesa(mesa.id)}
                  title="Editar nome"
                  style={{ cursor: "pointer" }}
                >
                  ✏️
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>Cardápio</h2>
          {categoriasOrdenadas.map(categoria => (
            <div key={categoria} style={{ marginBottom: 10 }}>
              <h3>{categoria}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {produtosPorCategoria[categoria].map(produto => (
                  <button
                    key={produto.nome}
                    onClick={() => adicionarItem(produto)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      backgroundColor: "#f0f0f0",
                    }}
                    title={`Adicionar ${produto.nome} - R$ ${produto.preco.toFixed(2)}`}
                  >
                    {produto.nome} - R$ {produto.preco.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>Comanda da Mesa {mesaSelecionada ? (mesas.find(m => m.id === mesaSelecionada)?.nome || "") : "(Nenhuma selecionada)"}</h2>
          {!mesaSelecionada && <p>Selecione uma mesa para ver ou editar a comanda.</p>}

          {mesaSelecionada && (
            <>
              {comandasDoDia[mesaSelecionada] && comandasDoDia[mesaSelecionada].itens.length > 0 ? (
                <>
                  <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {comandasDoDia[mesaSelecionada].itens.map(item => (
                      <li
                        key={item.nome}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                          borderBottom: "1px solid #ccc",
                          paddingBottom: 4,
                        }}
                      >
                        <span>{item.nome} x {item.quantidade}</span>
                        <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                        <button
                          onClick={() => removerItem(mesaSelecionada, item.nome)}
                          style={{
                            marginLeft: 10,
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: 3,
                            padding: "2px 6px",
                          }}
                          title="Remover item"
                        >
                          ✖
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Total: R$ {totalComanda(mesaSelecionada).toFixed(2)}</strong>
                  </p>
                  <p>Status: <strong>{comandasDoDia[mesaSelecionada].status}</strong></p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={() => toggleStatus(mesaSelecionada)}>
                      {comandasDoDia[mesaSelecionada].status === "Aberta" ? "Finalizar" : "Reabrir"}
                    </button>
                    <button onClick={() => limparComanda(mesaSelecionada)}>Limpar Itens</button>
                    <button onClick={() => excluirComanda(mesaSelecionada)} style={{ backgroundColor: "red", color: "white" }}>
                      Excluir Comanda
                    </button>
                  </div>
                </>
              ) : (
                <p>Esta comanda está vazia.</p>
              )}
            </>
          )}
        </div>
      </div>

      <hr />

      <div style={{ marginTop: 20 }}>
        <label>
          Mostrar comandas finalizadas:
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={e => setMostrarFinalizadas(e.target.checked)}
            style={{ marginLeft: 10 }}
          />
        </label>
      </div>

      <div ref={printRef} style={{ marginTop: 20 }}>
        <h2>Comandas do Dia ({dataSelecionada})</h2>
        {Object.keys(comandasDoDia).length === 0 && <p>Nenhuma comanda registrada neste dia.</p>}
        {Object.entries(comandasDoDia).map(([mesaId, comanda]) => {
          if (!comanda || !comanda.itens || !Array.isArray(comanda.itens)) return null;
          if (!mostrarFinalizadas && comanda.status === "Finalizada") return null;

          const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;

          return (
            <div
              key={mesaId}
              style={{
                border: "1px solid #ccc",
                marginBottom: 12,
                padding: 10,
                borderRadius: 6,
                backgroundColor: comanda.status === "Finalizada" ? "#d3ffd3" : "#fff",
              }}
            >
              <h3>
                Mesa: {nomeMesa} - Status: <strong>{comanda.status}</strong>
              </h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {comanda.itens.map(item => (
                  <li key={item.nome}>
                    {item.nome} x {item.quantidade} = R$ {(item.preco * item.quantidade).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p><strong>Total: R$ {totalComanda(mesaId).toFixed(2)}</strong></p>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Total Geral do Dia: R$ {totalGeral().toFixed(2)}</h2>
        <button onClick={imprimir} style={{ padding: "8px 15px", cursor: "pointer" }}>
          Imprimir Comandas Visíveis
        </button>
      </div>
    </div>
  );
}

export default App;
