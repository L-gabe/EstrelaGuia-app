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

const styles = {
  container: {
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    color: "#333",
  },
  header: {
    marginBottom: 20,
    fontWeight: "700",
    fontSize: 28,
    color: "#2c3e50",
  },
  topControls: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  inputDate: {
    padding: "6px 10px",
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  buttonPrimary: {
    padding: "8px 15px",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  buttonPrimaryHover: {
    backgroundColor: "#2980b9",
  },
  buttonDanger: {
    padding: "8px 15px",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#e74c3c",
    color: "#fff",
    fontWeight: "600",
  },
  layoutMain: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
  },
  sidebar: {
    flex: "1 1 220px",
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 0 8px rgb(0 0 0 / 0.1)",
    padding: 15,
    maxHeight: "70vh",
    overflowY: "auto",
  },
  sidebarTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "700",
    borderBottom: "1px solid #ddd",
    paddingBottom: 8,
  },
  mesaButton: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "8px 12px",
    marginBottom: 6,
    borderRadius: 5,
    border: "1px solid #3498db",
    backgroundColor: "#ecf6fd",
    color: "#3498db",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  mesaButtonSelected: {
    backgroundColor: "#3498db",
    color: "#fff",
  },
  mesasFinalizadasTitle: {
    fontSize: 16,
    marginTop: 15,
    cursor: "pointer",
    color: "#7f8c8d",
    userSelect: "none",
  },
  contentArea: {
    flex: "3 1 600px",
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 0 12px rgb(0 0 0 / 0.1)",
    padding: 20,
    maxHeight: "70vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  comandaHeader: {
    marginBottom: 15,
    fontWeight: "700",
    fontSize: 22,
    color: "#2c3e50",
  },
  itensContainer: {
    flexGrow: 1,
    marginBottom: 15,
    overflowY: "auto",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    borderBottom: "1px solid #eee",
    fontSize: 16,
  },
  btnRemoveItem: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer",
    padding: "4px 8px",
    fontWeight: "600",
  },
  actionsRow: {
    display: "flex",
    gap: 12,
    marginBottom: 15,
  },
  btnAction: {
    flexGrow: 1,
    padding: "10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 15,
    transition: "background-color 0.3s",
  },
  btnStatusAberta: {
    backgroundColor: "#27ae60",
    color: "#fff",
  },
  btnStatusFinalizada: {
    backgroundColor: "#95a5a6",
    color: "#fff",
  },
  btnLimpar: {
    backgroundColor: "#f39c12",
    color: "#fff",
  },
  btnExcluir: {
    backgroundColor: "#e74c3c",
    color: "#fff",
  },
  btnImprimir: {
    backgroundColor: "#2980b9",
    color: "#fff",
  },
  categoriasContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: 12,
    maxHeight: "350px",
    overflowY: "auto",
  },
  categoriaBox: {
    backgroundColor: "#fafafa",
    borderRadius: 6,
    padding: 10,
    boxShadow: "inset 0 0 5px rgb(0 0 0 / 0.05)",
  },
  categoriaTitle: {
    marginBottom: 8,
    fontWeight: "700",
    fontSize: 16,
    borderBottom: "1px solid #ddd",
    paddingBottom: 4,
    color: "#34495e",
  },
  produtoBtn: {
    display: "block",
    width: "100%",
    padding: "8px 5px",
    marginBottom: 6,
    borderRadius: 5,
    border: "1px solid #2980b9",
    backgroundColor: "#3498db",
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    cursor: "pointer",
    transition: "background-color 0.25s",
    textAlign: "center",
  },
  produtoBtnHover: {
    backgroundColor: "#1c5980",
  },
  footer: {
    marginTop: 20,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "right",
    color: "#2c3e50",
  },
};

function App() {
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || {});
  const [dataSelecionada, setDataSelecionada] = useState(() => localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10));
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);

  useEffect(() => { localStorage.setItem("mesas", JSON.stringify(mesas)); }, [mesas]);
  useEffect(() => { localStorage.setItem("comandas", JSON.stringify(comandas)); }, [comandas]);
  useEffect(() => { localStorage.setItem("dataSelecionada", dataSelecionada); }, [dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim()) setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim()) setMesas(prev => prev.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
  };

  const excluirMesa = (id) => {
    if (!window.confirm("Excluir mesa? Isso remove a comanda também.")) return;
    setMesas(prev => prev.filter(m => m.id !== id));
    const novasComandas = { ...comandasDoDia };
    delete novasComandas[id];
    setComandas(prev => ({ ...prev, [dataSelecionada]: novasComandas }));
    if (mesaSelecionada === id) setMesaSelecionada(null);
  };

  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes.");
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
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: comanda },
    }));
  };

  const removerItem = (mesaId, nomeItem) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;
    const comanda = { ...com };
    comanda.itens = comanda.itens.filter(i => i.nome !== nomeItem);
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: comanda },
    }));
  };

  const toggleStatus = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;
    const novoStatus = com.status === "Finalizada" ? "Aberta" : "Finalizada";
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: { ...com, status: novoStatus } },
    }));
  };

  const limparComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;
    const comanda = { ...com, itens: [], status: "Aberta" };
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: comanda },
    }));
  };

  const excluirComanda = (mesaId) => {
    if (!window.confirm("Excluir essa comanda?")) return;
    const novas = { ...comandasDoDia };
    delete novas[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novas,
    }));
    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  const limparTudo = () => {
    if (!window.confirm("Deseja realmente limpar tudo?")) return;
    setMesas([]);
    setComandas(prev => ({ ...prev, [dataSelecionada]: {} }));
    setMesaSelecionada(null);
  };

  const imprimirTodasComandas = () => {
    const todas = comandasDoDia;
    if (Object.keys(todas).length === 0) {
      alert("Nenhuma comanda para imprimir.");
      return;
    }

    let printContent = `<h2>Comandas do Dia ${dataSelecionada}</h2>`;
    Object.entries(todas).forEach(([mesaId, comanda]) => {
      if (!comanda || Array.isArray(comanda)) return;
      const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;
      printContent += `
        <div style="margin-bottom:10px; padding:4px; border-bottom:1px dashed #000;">
        <h4>Mesa: ${nomeMesa} (${comanda.status})</h4>
        <ul>
          ${comanda.itens.map(i => `<li>${i.nome} x${i.quantidade} = R$${(i.preco * i.quantidade).toFixed(2)}</li>`).join("")}
        </ul>
        <strong>Total: R$${comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0).toFixed(2)}</strong>
        </div>
      `;
    });

    const janela = window.open("", "", "width=400,height=600");
    janela.document.write(`<html><head><title>Imprimir Todas</title></head><body>`);
    janela.document.write(printContent);
    janela.document.write(`</body></html>`);
    janela.document.close();
    janela.print();
  };

  const totalGeral = Object.values(comandasDoDia).reduce((acc, com) => {
    if (!com || Array.isArray(com)) return acc;
    return acc + com.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  }, 0);

  const mesasAbertas = mesas.filter(m => !comandasDoDia[m.id] || comandasDoDia[m.id]?.status !== "Finalizada");
  const mesasFinalizadas = mesas.filter(m => comandasDoDia[m.id]?.status === "Finalizada");

  const imprimirMesa = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda || Array.isArray(comanda)) {
      alert("Não há comanda para esta mesa.");
      return;
    }
    const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;
    const content = `
      <div>
        <h3>Comanda Mesa: ${nomeMesa}</h3>
        <ul>
          ${comanda.itens.map(i => `<li>${i.nome} x${i.quantidade} = R$${(i.preco * i.quantidade).to

