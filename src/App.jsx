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
  const [ocultarFinalizadas, setOcultarFinalizadas] = useState(false); // NOVO: controle para ocultar mesas finalizadas
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

  // NOVO: Excluir mesa junto com suas comandas
  const excluirMesa = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir essa mesa e todas as suas comandas?")) return;

    setMesas(prev => prev.filter(m => m.id !== id));

    // Remove a comanda da mesa excluída também
    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[id];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandasDoDia
    }));

    if (mesaSelecionada === id) setMesaSelecionada(null);
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

  // Excluir comanda da mesa
  const excluirComanda = (mesaId) => {
    if (!window.confirm("Excluir comanda desta mesa?")) return;

    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandasDoDia,
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Calcular total da comanda
  const totalComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return 0;
    return com.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  // Total geral das vendas do dia (todas comandas finalizadas)
  const totalGeral = () => {
    let total = 0;
    for (const mesaId in comandasDoDia) {
      const com = comandasDoDia[mesaId];
      if (com && !Array.isArray(com) && com.status === "Finalizada") {
        total += totalComanda(mesaId);
      }
    }
    return total;
  };

  // --- NOVO: Impressão individual e impressão geral ---

  // Função para imprimir uma comanda individual (já existe, só uso o printRef)
  const imprimirComanda = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // NOVO: Função para imprimir todas as comandas finalizadas do dia
  const imprimirTodasComandas = () => {
    if (!printRef.current) return;

    // Gerar conteúdo com todas as comandas finalizadas
    const todasComandas = Object.entries(comandasDoDia)
      .filter(([_, com]) => com && !Array.isArray(com) && com.status === "Finalizada")
      .map(([mesaId, com]) => {
        const mesa = mesas.find(m => m.id === mesaId);
        const nomeMesa = mesa ? mesa.nome : "Mesa removida";

        const itensHTML = com.itens.map(item => 
          `<tr>
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
          </tr>`
        ).join("");

        return `
          <div style="page-break-after: always; margin-bottom: 20px;">
            <h2>Comanda: ${nomeMesa}</h2>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qtd</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itensHTML}
              </tbody>
            </table>
            <p><strong>Total: R$ ${totalComanda(mesaId).toFixed(2)}</strong></p>
          </div>
        `;
      }).join("");

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = `<div>${todasComandas || "<p>Não há comandas finalizadas para imprimir.</p>"}</div>`;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Filtrar mesas que estão abertas para exibir (considerando ocultar as finalizadas)
  const mesasFiltradas = ocultarFinalizadas
    ? mesas.filter(mesa => {
      const com = comandasDoDia[mesa.id];
      if (!com || Array.isArray(com)) return true; // mesas sem comanda contam como abertas
      return com.status !== "Finalizada";
    })
    : mesas;

  return (
    <div style={{ padding: 15, fontFamily: "Arial, sans-serif" }}>
      <h1>Controle de Mesas e Comandas</h1>

      <label>
        Data:
        <input
          type="date"
          value={dataSelecionada}
          onChange={e => setDataSelecionada(e.target.value)}
          style={{ marginLeft: 10, marginBottom: 15 }}
        />
      </label>

      <button onClick={adicionarMesa} style={{ marginLeft: 20 }}>
        + Adicionar Mesa
      </button>

      <label style={{ marginLeft: 20 }}>
        <input
          type="checkbox"
          checked={ocultarFinalizadas}
          onChange={e => setOcultarFinalizadas(e.target.checked)}
        />
        Ocultar mesas finalizadas
      </label>

      <button
        onClick={imprimirTodasComandas}
        style={{ marginLeft: 20, backgroundColor: "#007bff", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
      >
        Imprimir todas as comandas
      </button>

      <hr />

      <div style={{ display: "flex", gap: 30 }}>
        {/* LISTA DE MESAS */}
        <div style={{ minWidth: 220 }}>
          <h2>Mesas</h2>
          {mesasFiltradas.length === 0 && <p>Nenhuma mesa disponível.</p>}
          {mesasFiltradas.map(mesa => {
            const com = comandasDoDia[mesa.id];
            const status = com && !Array.isArray(com) ? com.status : "Aberta";

            return (
              <div
                key={mesa.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  marginBottom: 10,
                  padding: 10,
                  cursor: "pointer",
                  backgroundColor: mesa.id === mesaSelecionada ? "#def" : "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => setMesaSelecionada(mesa.id)}
              >
                <div>
                  <strong>{mesa.nome}</strong> <br />
                  <small>Status: {status}</small>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button onClick={e => { e.stopPropagation(); editarNomeMesa(mesa.id); }} title="Editar nome">✏️</button>
                  <button onClick={e => { e.stopPropagation(); excluirMesa(mesa.id); }} title="Excluir mesa" style={{ color: "red" }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMANDA DA MESA SELECIONADA */}
        <div style={{ flex: 1 }}>
          <h2>Comanda</h2>
          {mesaSelecionada ? (
            <>
              <p><strong>Mesa:</strong> {mesas.find(m => m.id === mesaSelecionada)?.nome || "Mesa removida"}</p>
              <button onClick={() => toggleStatus(mesaSelecionada)}>
                {comandasDoDia[mesaSelecionada]?.status === "Finalizada" ? "Reabrir Comanda" : "Finalizar Comanda"}
              </button>
              <button onClick={() => limparComanda(mesaSelecionada)} style={{ marginLeft: 10 }}>
                Limpar Comanda
              </button>
              <button onClick={() => excluirComanda(mesaSelecionada)} style={{ marginLeft: 10, color: "red" }}>
                Excluir Comanda
              </button>

              <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: 10, width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qtd</th>
                    <th>Preço</th>
                    <th>Subtotal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {(comandasDoDia[mesaSelecionada]?.itens || []).map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.nome}</td>
                      <td>{item.quantidade}</td>
                      <td>R$ {item.preco.toFixed(2)}</td>
                      <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removerItem(mesaSelecionada, item.nome)} style={{ color: "red" }}>
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(comandasDoDia[mesaSelecionada]?.itens?.length || 0) === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: "center" }}>Nenhum item adicionado.</td></tr>
                  )}
                </tbody>
              </table>
              <p style={{ marginTop: 10 }}>
                <strong>Total: R$ {totalComanda(mesaSelecionada).toFixed(2)}</strong>
              </p>
              <button onClick={imprimirComanda}>Imprimir Comanda</button>
            </>
          ) : (
            <p>Selecione uma mesa para visualizar ou editar a comanda.</p>
          )}
        </div>

        {/* CARDÁPIO ORGANIZADO POR CATEGORIA */}
        <div style={{ minWidth: 300 }}>
          <h2>Cardápio</h2>
          {categoriasOrdenadas.map(categoria => (
            <div key={categoria} style={{ marginBottom: 20 }}>
              <h3>{categoria}</h3>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {produtosPorCategoria[categoria].map((item, idx) => (
                  <li key={idx} style={{ cursor: "pointer", marginBottom: 5 }} onClick={() => adicionarItem(item)}>
                    {item.nome} - R$ {item.preco.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Ref para impressão */}
      <div ref={printRef} style={{ display: "none" }}></div>

      <hr />

      <p><strong>Total geral de vendas finalizadas no dia:</strong> R$ {totalGeral().toFixed(2)}</p>
    </div>
  );
}

export default App;
