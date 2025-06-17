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
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(true);
  const printRef = useRef();

  useEffect(() => { localStorage.setItem("mesas", JSON.stringify(mesas)); }, [mesas]);
  useEffect(() => { localStorage.setItem("comandas", JSON.stringify(comandas)); }, [comandas]);
  useEffect(() => { localStorage.setItem("dataSelecionada", dataSelecionada); }, [dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Funções (idem seu código original, mantidas sem alterações)...

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

  const totalVendaDia = () => {
    let total = 0;
    Object.values(comandasDoDia).forEach(com => {
      if (com && !Array.isArray(com) && com.itens) {
        com.itens.forEach(item => total += item.preco * item.quantidade);
      }
    });
    return total.toFixed(2);
  };

  const imprimirComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return alert("Comanda vazia ou inexistente.");

    const itens = com.itens.map(item => `<li>${item.quantidade}x ${item.nome} - R$${(item.preco * item.quantidade).toFixed(2)}</li>`).join("");
    const total = com.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2);
    const html = `
      <h1>Comanda Mesa ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h1>
      <ul>${itens}</ul>
      <p><strong>Total: R$${total}</strong></p>
    `;
    const printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const imprimirTodasComandas = () => {
    let html = `<h1>Comandas do Dia ${dataSelecionada}</h1>`;
    Object.entries(comandasDoDia).forEach(([mesaId, com]) => {
      if (com && !Array.isArray(com)) {
        html += `<h2>Mesa ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h2><ul>`;
        com.itens.forEach(item => {
          html += `<li>${item.quantidade}x ${item.nome} - R$${(item.preco * item.quantidade).toFixed(2)}</li>`;
        });
        const total = com.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2);
        html += `</ul><p><strong>Total: R$${total}</strong></p><hr>`;
      }
    });

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Render

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Controle de Comandas - Restaurante</h1>
        <div style={styles.dataInput}>
          <label>Data: </label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            style={styles.inputData}
          />
          <button onClick={adicionarMesa} style={styles.btnAddMesa}>+ Mesa</button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Lista de Mesas */}
        <aside style={styles.sidebar}>
          <h2>Mesas</h2>
          <div style={styles.listaMesas}>
            {mesas.map((mesa) => (
              <div
                key={mesa.id}
                onClick={() => setMesaSelecionada(mesa.id)}
                style={{
                  ...styles.mesaItem,
                  ...(mesaSelecionada === mesa.id ? styles.mesaSelecionada : {}),
                }}
                title={`Editar nome: ${mesa.nome}`}
                onDoubleClick={() => editarNomeMesa(mesa.id)}
              >
                {mesa.nome}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    excluirMesa(mesa.id);
                  }}
                  style={styles.btnExcluirMesa}
                  title="Excluir mesa"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Comanda da Mesa Selecionada */}
        <section style={styles.comandaSection}>
          {mesaSelecionada ? (
            <>
              <h2>Comanda da Mesa: {mesas.find(m => m.id === mesaSelecionada)?.nome || "Mesa"}</h2>
              <div style={styles.comandaBotoes}>
                <button onClick={() => toggleStatus(mesaSelecionada)} style={styles.btnStatus}>
                  {comandasDoDia[mesaSelecionada]?.status === "Finalizada" ? "Reabrir" : "Finalizar"}
                </button>
                <button onClick={() => limparComanda(mesaSelecionada)} style={styles.btnLimpar}>
                  Limpar
                </button>
                <button onClick={() => excluirComanda(mesaSelecionada)} style={styles.btnExcluir}>
                  Excluir Comanda
                </button>
                <button onClick={() => imprimirComanda(mesaSelecionada)} style={styles.btnImprimir}>
                  Imprimir
                </button>
              </div>

              <div style={styles.itensComanda}>
                {comandasDoDia[mesaSelecionada] && comandasDoDia[mesaSelecionada].itens && comandasDoDia[mesaSelecionada].itens.length > 0 ? (
                  comandasDoDia[mesaSelecionada].itens.map((item, idx) => (
                    <div key={idx} style={styles.itemComanda}>
                      <span>{item.quantidade}x {item.nome}</span>
                      <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      <button onClick={() => removerItem(mesaSelecionada, item.nome)} style={styles.btnRemoveItem} title="Remover item">×</button>
                    </div>
                  ))
                ) : (
                  <p>Sem itens na comanda.</p>
                )}
              </div>
              <h3 style={styles.total}>Total: R$ {comandasDoDia[mesaSelecionada]?.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2) || "0.00"}</h3>
            </>
          ) : (
            <p>Selecione uma mesa para ver a comanda.</p>
          )}
        </section>

        {/* Cardápio */}
        <aside style={styles.menuLateral}>
          <h2>Cardápio</h2>
          {categoriasOrdenadas.map(categoria => (
            <div key={categoria} style={styles.categoriaCardapio}>
              <h3>{categoria}</h3>
              <div style={styles.itensCategoria}>
                {produtosPorCategoria[categoria].map(prod => (
                  <button
                    key={prod.nome}
                    onClick={() => adicionarItem(prod)}
                    style={styles.btnProduto}
                    title={`Adicionar ${prod.nome} - R$${prod.preco}`}
                  >
                    {prod.nome} <br /> <small>R$ {prod.preco.toFixed(2)}</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </main>

      <footer style={styles.footer}>
        <button onClick={imprimirTodasComandas} style={styles.btnImprimirTodas}>
          Imprimir todas as comandas
        </button>
        <div style={styles.totalDia}>
          Total Geral do Dia: <strong>R$ {totalVendaDia()}</strong>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 1400,
    margin: "0 auto",
    padding: 16,
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
    borderBottom: "2px solid #333",
    paddingBottom: 12,
  },
  dataInput: {
    marginTop: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  inputData: {
    fontSize: 16,
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  btnAddMesa: {
    padding: "6px 12px",
    fontSize: 16,
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  main: {
    display: "flex",
    flex: 1,
    gap: 20,
  },
  sidebar: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    height: "calc(100vh - 160px)",
    overflowY: "auto",
  },
  listaMesas: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  mesaItem: {
    padding: "8px 12px",
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background-color 0.2s",
    userSelect: "none",
  },
  mesaSelecionada: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    fontWeight: "600",
  },
  btnExcluirMesa: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: 18,
    color: "#e74c3c",
    cursor: "pointer",
    marginLeft: 8,
  },
  comandaSection: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  comandaBotoes: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  btnStatus: {
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnLimpar: {
    backgroundColor: "#f39c12",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
  },
  btnExcluir: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
  },
  btnImprimir: {
    backgroundColor: "#2980b9",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
  },
  itensComanda: {
    flex: 1,
    overflowY: "auto",
    borderTop: "1px solid #ddd",
    paddingTop: 8,
  },
  itemComanda: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 8px",
    borderBottom: "1px solid #eee",
    fontSize: 16,
  },
  btnRemoveItem: {
    backgroundColor: "transparent",
    border: "none",
    color: "#e74c3c",
    fontSize: 22,
    cursor: "pointer",
    marginLeft: 8,
    fontWeight: "bold",
  },
  total: {
    textAlign: "right",
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
  },
  menuLateral: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflowY: "auto",
    height: "calc(100vh - 160px)",
  },
  categoriaCardapio: {
    marginBottom: 20,
  },
  itensCategoria: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
    gap: 10,
    marginTop: 6,
  },
  btnProduto: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 6px",
    cursor: "pointer",
    fontSize: 14,
    textAlign: "center",
    whiteSpace: "normal",
    userSelect: "none",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    transition: "background-color 0.3s",
  },
  btnProdutoHover: {
    backgroundColor: "#2980b9",
  },
  footer: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTop: "2px solid #ccc",
  },
  btnImprimirTodas: {
    backgroundColor: "#34495e",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "600",
  },
  totalDia: {
    fontSize: 18,
    fontWeight: "bold",
  },
};

export default App;
