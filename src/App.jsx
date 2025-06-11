
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

  const totalGeral = Object.keys(comandasDoDia).reduce(
    (total, mesaId) => total + totalComanda(mesaId),
    0
  );

  const imprimirTodasComandas = () => {
    let html = `<html><head><title>Comandas - ${dataSelecionada}</title><style>
      body { font-family: Arial, sans-serif; margin: 10px; }
      h2 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
    </style></head><body><h1>Comandas - ${dataSelecionada}</h1>`;

    for (const mesaId in comandasDoDia) {
      const mesa = mesas.find(m => m.id === Number(mesaId));
      const nomeMesa = mesa ? mesa.nome : `Mesa ${mesaId}`;
      const comanda = comandasDoDia[mesaId];
      const status = comanda.status || "Aberta";
      const itens = Array.isArray(comanda) ? comanda : comanda.itens || [];

      html += `<h2>${nomeMesa} - ${status}</h2><table><thead><tr><th>Item</th><th>Quantidade</th><th>Preço Unitário</th><th>Subtotal</th></tr></thead><tbody>`;

      itens.forEach(({ nome, quantidade, preco }) => {
        html += `<tr><td>${nome}</td><td>${quantidade}</td><td>${preco.toFixed(2)}</td><td>${(quantidade * preco).toFixed(2)}</td></tr>`;
      });

      html += `</tbody><tfoot><tr><td colspan="3"><strong>Total</strong></td><td><strong>${totalComanda(mesaId).toFixed(2)}</strong></td></tr></tfoot></table>`;
    }

    html += `<h3>Total Geral: R$ ${totalGeral.toFixed(2)}</h3></body></html>`;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // CSS Estilizado no JS para layout moderno
  const styles = {
    container: {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f9f9f9",
      padding: 20,
      minHeight: "100vh",
      color: "#333",
    },
    header: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 20,
      textAlign: "center",
      color: "#2c3e50",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
      flexWrap: "wrap",
      gap: "10px",
    },
    buttonPrimary: {
      backgroundColor: "#27ae60",
      border: "none",
      padding: "10px 18px",
      borderRadius: 6,
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 14,
      transition: "background-color 0.3s ease",
    },
    buttonPrimaryHover: {
      backgroundColor: "#219150",
    },
    buttonSecondary: {
      backgroundColor: "#2980b9",
      border: "none",
      padding: "10px 16px",
      borderRadius: 6,
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 14,
      transition: "background-color 0.3s ease",
    },
    inputDate: {
      padding: 8,
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 16,
      minWidth: 160,
    },
    checkbox: {
      marginLeft: 8,
      transform: "scale(1.3)",
      cursor: "pointer",
    },
    flexRow: {
      display: "flex",
      gap: 20,
      marginTop: 20,
      flexWrap: "wrap",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
      flex: 1,
      minWidth: 280,
      maxHeight: "70vh",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 10,
      color: "#34495e",
    },
    mesaButton: (selected) => ({
      backgroundColor: selected ? "#27ae60" : "#ecf0f1",
      border: "none",
      padding: "10px",
      borderRadius: 6,
      width: "100%",
      textAlign: "left",
      fontWeight: selected ? "700" : "500",
      cursor: "pointer",
      color: selected ? "#fff" : "#34495e",
      transition: "background-color 0.3s ease",
    }),
    mesaEditBtn: {
      marginLeft: 8,
      backgroundColor: "#3498db",
      border: "none",
      borderRadius: 6,
      color: "#fff",
      cursor: "pointer",
      padding: "6px 8px",
      fontWeight: "600",
      fontSize: 12,
      transition: "background-color 0.3s ease",
    },
    itemButton: {
      backgroundColor: "#2980b9",
      border: "none",
      padding: "8px 10px",
      borderRadius: 6,
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 14,
      width: "100%",
      textAlign: "left",
      marginBottom: 6,
      transition: "background-color 0.3s ease",
    },
    itemButtonHover: {
      backgroundColor: "#1c5980",
    },
    itemList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      flexGrow: 1,
      overflowY: "auto",
    },
    comandaItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      padding: "6px 8px",
      borderRadius: 6,
      backgroundColor: "#ecf0f1",
      fontWeight: "600",
      color: "#2c3e50",
    },
    btnSmall: {
      backgroundColor: "#e74c3c",
      border: "none",
      borderRadius: 6,
      color: "#fff",
      cursor: "pointer",
      padding: "2px 6px",
      fontWeight: "700",
      marginLeft: 10,
      transition: "background-color 0.3s ease",
    },
    btnSmallHover: {
      backgroundColor: "#c0392b",
    },
    statusText: {
      fontWeight: "700",
      color: "#27ae60",
    },
    statusFinalizada: {
      color: "#e74c3c",
    },
    comandaFooter: {
      marginTop: "auto",
      fontWeight: "700",
      fontSize: 16,
      textAlign: "right",
      color: "#2c3e50",
    },
    actionButtons: {
      marginTop: 10,
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      justifyContent: "flex-end",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Controle de Comandas</h1>

      <div style={styles.topBar}>
        <div>
          <label htmlFor="data">Data: </label>
          <input
            id="data"
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            style={styles.inputDate}
          />
        </div>

        <div>
          <button
            onClick={adicionarMesa}
            style={styles.buttonPrimary}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#219150")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#27ae60")}
          >
            + Adicionar Mesa
          </button>
          <button
            onClick={limparHistorico}
            style={{ ...styles.buttonSecondary, marginLeft: 10 }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#2471a3")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#2980b9")}
          >
            Limpar Histórico
          </button>
          <button
            onClick={imprimirTodasComandas}
            style={{ ...styles.buttonSecondary, marginLeft: 10 }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#2471a3")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#2980b9")}
          >
            Imprimir Todas
          </button>
        </div>
      </div>

      <div style={styles.topBar}>
        <label>
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
            style={styles.checkbox}
          />
          Mostrar comandas finalizadas
        </label>
      </div>

      <div style={styles.flexRow}>
        <div style={{ ...styles.card, maxWidth: 200 }}>
          <h2 style={styles.cardTitle}>Mesas</h2>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada</p>}
          {mesas.map(({ id, nome }) => (
            <div key={id} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <button
                onClick={() => setMesaSelecionada(id)}
                style={styles.mesaButton(mesaSelecionada === id)}
              >
                {nome}
              </button>
              <button
                onClick={() => editarNomeMesa(id)}
                style={styles.mesaEditBtn}
                title="Editar nome da mesa"
              >
                ✏️
              </button>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, flexGrow: 1 }}>
          <h2 style={styles.cardTitle}>Cardápio</h2>
          {categoriasOrdenadas.map((categoria) => (
            <div key={categoria}>
              <h3 style={{ color: "#2980b9", marginTop: 10 }}>{categoria}</h3>
              {produtosPorCategoria[categoria].map((item) => (
                <button
                  key={item.nome}
                  onClick={() => adicionarItem(item)}
                  style={styles.itemButton}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = "#1c5980")}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = "#2980b9")}
                >
                  {item.nome} - R$ {item.preco.toFixed(2)}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, maxWidth: 320, flexShrink: 0 }}>
          <h2 style={styles.cardTitle}>Comanda {mesaSelecionada ? `- ${mesas.find(m => m.id === mesaSelecionada)?.nome}` : ""}</h2>

          {mesaSelecionada && comandasDoDia[mesaSelecionada] ? (
            <>
              <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
                {(comandasDoDia[mesaSelecionada].itens || comandasDoDia[mesaSelecionada]).map(({ nome, quantidade, preco }) => (
                  <div key={nome} style={styles.comandaItem}>
                    <span>{nome} x{quantidade}</span>
                    <span>R$ {(quantidade * preco).toFixed(2)}</span>
                    <button
                      onClick={() => removerItem(mesaSelecionada, nome)}
                      style={styles.btnSmall}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = "#c0392b")}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = "#e74c3c")}
                      title="Remover item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div style={styles.comandaFooter}>
                Total: R$ {totalComanda(mesaSelecionada).toFixed(2)}
              </div>

              <div style={styles.actionButtons}>
                <button
                  onClick={() => toggleStatus(mesaSelecionada)}
                  style={styles.buttonPrimary}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = "#219150")}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = "#27ae60")}
                >
                  {comandasDoDia[mesaSelecionada].status === "Finalizada" ? "Reabrir" : "Finalizar"}
                </button>

                <button
                  onClick={() => limparComanda(mesaSelecionada)}
                  style={{ ...styles.buttonSecondary }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = "#2471a3")}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = "#2980b9")}
                >
                  Limpar Comanda
                </button>

                <button
                  onClick={() => excluirComanda(mesaSelecionada)}
                  style={{ ...styles.btnSmall, backgroundColor: "#e67e22" }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = "#d35400")}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = "#e67e22")}
                >
                  Excluir Comanda
                </button>
              </div>
            </>
          ) : mesaSelecionada ? (
            <p>Comanda vazia.</p>
          ) : (
            <p>Selecione uma mesa para visualizar a comanda.</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: "right", fontWeight: "700", fontSize: 18, color: "#2c3e50" }}>
        Total Geral: R$ {totalGeral.toFixed(2)}
      </div>
    </div>
  );
}

export default App;
