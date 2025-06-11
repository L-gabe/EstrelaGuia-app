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
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    color: "#2c3e50",
    marginBottom: 20,
  },
  flexRow: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgb(0 0 0 / 0.1)",
    padding: 15,
    minWidth: 250,
    flex: 1,
    maxHeight: "80vh",
    overflowY: "auto",
  },
  mesaItem: (selected) => ({
    padding: "8px 12px",
    borderRadius: 6,
    marginBottom: 8,
    cursor: "pointer",
    backgroundColor: selected ? "#007bff" : "#e9ecef",
    color: selected ? "#fff" : "#212529",
    fontWeight: selected ? "600" : "500",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background-color 0.3s",
  }),
  btnSmall: {
    fontSize: 12,
    backgroundColor: "transparent",
    border: "none",
    color: "#17a2b8",
    cursor: "pointer",
    padding: 4,
  },
  btnPrimary: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  btnPrimaryHover: {
    backgroundColor: "#0056b3",
  },
  btnDanger: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
  },
  btnWarning: {
    backgroundColor: "#ffc107",
    color: "#212529",
    border: "none",
    padding: "8px 15px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
  },
  btnLink: {
    backgroundColor: "transparent",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    padding: 0,
  },
  btnCardapio: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1.5px solid #007bff",
    backgroundColor: "#e9f5ff",
    cursor: "pointer",
    flex: "1 0 28%",
    maxWidth: 180,
    fontWeight: "600",
    color: "#007bff",
    textAlign: "center",
    userSelect: "none",
    transition: "background-color 0.3s",
  },
  btnCardapioHover: {
    backgroundColor: "#d0e7ff",
  },
  listItem: {
    borderBottom: "1px solid #ddd",
    padding: "8px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  title4: {
    marginTop: 15,
    marginBottom: 10,
    borderBottom: "2px solid #007bff",
    paddingBottom: 5,
    color: "#007bff",
  },
  footer: {
    marginTop: 30,
    fontWeight: "700",
    fontSize: 18,
    color: "#2c3e50",
  },
  labelCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 15,
    fontWeight: "600",
    color: "#495057",
  },
};

export default function App() {
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || {});
  const [dataSelecionada, setDataSelecionada] = useState(() => localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10));
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [nomeNovaMesa, setNomeNovaMesa] = useState("");

  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem("comandas", JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [dataSelecionada]);

  // Adicionar nova mesa
  function adicionarMesa() {
    if (!nomeNovaMesa.trim()) {
      alert("Digite o nome da mesa antes de adicionar.");
      return;
    }
    if (mesas.includes(nomeNovaMesa.trim())) {
      alert("Essa mesa já existe.");
      return;
    }
    setMesas([...mesas, nomeNovaMesa.trim()]);
    setNomeNovaMesa("");
  }

  // Excluir mesa
  function excluirMesa(mesa) {
    if (!window.confirm(`Tem certeza que deseja excluir a mesa "${mesa}"? Isso removerá todas as comandas associadas.`)) return;

    const novasMesas = mesas.filter(m => m !== mesa);
    setMesas(novasMesas);

    // Remover comandas associadas à mesa excluída na data selecionada
    const novaComandas = { ...comandas };
    if (novaComandas[dataSelecionada]) {
      novaComandas[dataSelecionada] = novaComandas[dataSelecionada].filter(c => c.mesa !== mesa);
      setComandas(novaComandas);
    }

    if (mesaSelecionada === mesa) {
      setMesaSelecionada(null);
    }
  }

  // Obter comandas da data atual
  const comandasDoDia = comandas[dataSelecionada] || [];

  // Filtrar comandas por mesa e status
  const comandasExibidas = mostrarFinalizadas
    ? comandasDoDia.filter(c => c.status === "finalizada")
    : comandasDoDia.filter(c => c.status !== "finalizada");

  // Adicionar item à comanda da mesa selecionada
  function adicionarItem(mesa, item) {
    if (!mesa) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }
    const dataAtual = dataSelecionada;
    const novasComandas = { ...comandas };
    if (!novasComandas[dataAtual]) novasComandas[dataAtual] = [];

    // Buscar a comanda da mesa na data selecionada
    let comanda = novasComandas[dataAtual].find(c => c.mesa === mesa && c.status !== "finalizada");

    if (!comanda) {
      comanda = { mesa, itens: [], status: "aberta", data: dataAtual };
      novasComandas[dataAtual].push(comanda);
    }

    // Adicionar item
    comanda.itens.push(item);
    setComandas(novasComandas);
  }

  // Remover item da comanda
  function removerItem(mesa, index) {
    const dataAtual = dataSelecionada;
    const novasComandas = { ...comandas };
    const comanda = novasComandas[dataAtual].find(c => c.mesa === mesa && c.status !== "finalizada");
    if (!comanda) return;

    comanda.itens.splice(index, 1);
    setComandas(novasComandas);
  }

  // Limpar comanda da mesa
  function limparComanda(mesa) {
    if (!window.confirm(`Deseja realmente limpar a comanda da mesa "${mesa}"?`)) return;
    const dataAtual = dataSelecionada;
    const novasComandas = { ...comandas };
    const comanda = novasComandas[dataAtual].find(c => c.mesa === mesa && c.status !== "finalizada");
    if (!comanda) return;

    comanda.itens = [];
    setComandas(novasComandas);
  }

  // Finalizar comanda
  function finalizarComanda(mesa) {
    if (!window.confirm(`Finalizar comanda da mesa "${mesa}"?`)) return;
    const dataAtual = dataSelecionada;
    const novasComandas = { ...comandas };
    const comanda = novasComandas[dataAtual].find(c => c.mesa === mesa && c.status !== "finalizada");
    if (!comanda) {
      alert("Nenhuma comanda aberta para essa mesa.");
      return;
    }
    if (comanda.itens.length === 0) {
      alert("A comanda está vazia.");
      return;
    }
    comanda.status = "finalizada";
    setComandas(novasComandas);
    setMesaSelecionada(null);
  }

  // Excluir comanda (finalizada)
  function excluirComanda(mesa, indexComanda) {
    if (!window.confirm("Tem certeza que deseja excluir esta comanda?")) return;
    const dataAtual = dataSelecionada;
    const novasComandas = { ...comandas };
    if (!novasComandas[dataAtual]) return;

    novasComandas[dataAtual].splice(indexComanda, 1);
    setComandas(novasComandas);
  }

  // Calcular total comanda
  function totalComanda(comanda) {
    return comanda.itens.reduce((acc, i) => acc + i.preco, 0).toFixed(2);
  }

  // Total geral vendas do dia (somente finalizadas)
  const totalGeralVendas = comandasDoDia
    .filter(c => c.status === "finalizada")
    .reduce((acc, c) => acc + c.itens.reduce((a, i) => a + i.preco, 0), 0)
    .toFixed(2);

  // Impressão comanda individual
  function imprimirComanda(comanda) {
    const printWindow = window.open("", "", "width=400,height=600");
    printWindow.document.write("<html><head><title>Comanda</title>");
    printWindow.document.write(
      `<style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { color: #007bff; margin-bottom: 10px; }
        hr { border: none; border-top: 1px solid #ccc; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { padding: 8px 5px; border-bottom: 1px solid #ddd; }
        th { text-align: left; }
        tfoot td { font-weight: bold; }
      </style>`
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(`<h2>Comanda - Mesa: ${comanda.mesa}</h2>`);
    printWindow.document.write(`<p><strong>Data:</strong> ${comanda.data}</p>`);
    printWindow.document.write("<hr/>");
    printWindow.document.write("<table>");
    printWindow.document.write("<thead><tr><th>Item</th><th>Preço</th></tr></thead>");
    printWindow.document.write("<tbody>");
    comanda.itens.forEach(item => {
      printWindow.document.write(`<tr><td>${item.nome}</td><td>R$ ${item.preco.toFixed(2)}</td></tr>`);
    });
    printWindow.document.write("</tbody>");
    printWindow.document.write(`<tfoot><tr><td>Total</td><td>R$ ${totalComanda(comanda)}</td></tr></tfoot>`);
    printWindow.document.write("</table>");
    printWindow.document.write("<hr/>");
    printWindow.document.write("<p>Obrigado pela preferência!</p>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Sistema de Comandas - Restaurante</h1>

      {/* Controle Data */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="dataSelecionada" style={{ fontWeight: "600", marginRight: 10 }}>
          Selecione a data:
        </label>
        <input
          type="date"
          id="dataSelecionada"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
        />
      </div>

      <div style={styles.flexRow}>

        {/* Lista Mesas */}
        <div style={{ ...styles.card, maxWidth: 280 }}>
          <h3>Mesas</h3>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          {mesas.map((mesa) => (
            <div
              key={mesa}
              onClick={() => setMesaSelecionada(mesa)}
              style={styles.mesaItem(mesa === mesaSelecionada)}
              title="Clique para selecionar a mesa"
            >
              {mesa}
              <button
                onClick={e => {
                  e.stopPropagation();
                  excluirMesa(mesa);
                }}
                style={{ ...styles.btnSmall, color: "#dc3545" }}
                title="Excluir mesa"
              >
                ✕
              </button>
            </div>
          ))}

          <div style={{ marginTop: 10 }}>
            <input
              type="text"
              placeholder="Novo nome da mesa"
              value={nomeNovaMesa}
              onChange={(e) => setNomeNovaMesa(e.target.value)}
              style={{ width: "100%", padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") adicionarMesa();
              }}
            />
            <button
              onClick={adicionarMesa}
              style={{ ...styles.btnPrimary, marginTop: 8, width: "100%" }}
              title="Adicionar nova mesa"
            >
              Adicionar Mesa
            </button>
          </div>
        </div>

        {/* Comanda da Mesa Selecionada */}
        <div style={{ ...styles.card, flex: 1 }}>
          <h3>Comanda {mesaSelecionada ? `- Mesa: ${mesaSelecionada}` : ""}</h3>
          {!mesaSelecionada && <p>Selecione uma mesa para visualizar e adicionar itens.</p>}

          {mesaSelecionada && (
            <>
              {/* Itens da comanda */}
              <ul style={{ listStyle: "none", padding: 0, maxHeight: 350, overflowY: "auto" }}>
                {(comandas[dataSelecionada]?.find(c => c.mesa === mesaSelecionada && c.status !== "finalizada")?.itens || []).map((item, i) => (
                  <li
                    key={i}
                    style={{
                      ...styles.listItem,
                      backgroundColor: i % 2 === 0 ? "#f1f3f5" : "#fff",
                    }}
                    title="Clique para remover item"
                    onClick={() => removerItem(mesaSelecionada, i)}
                  >
                    <span>{item.nome}</span>
                    <span>R$ {item.preco.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 10 }}>
                <strong>Total: R$ {totalComanda(comandas[dataSelecionada]?.find(c => c.mesa === mesaSelecionada && c.status !== "finalizada") || { itens: [] })}</strong>
              </div>

              <div style={{ marginTop: 15, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => limparComanda(mesaSelecionada)}
                  style={styles.btnWarning}
                  title="Limpar comanda"
                >
                  Limpar
                </button>
                <button
                  onClick={() => finalizarComanda(mesaSelecionada)}
                  style={styles.btnPrimary}
                  title="Finalizar comanda"
                >
                  Finalizar
                </button>
                <button
                  onClick={() => {
                    const comandaAtual = comandas[dataSelecionada]?.find(c => c.mesa === mesaSelecionada && c.status !== "finalizada");
                    if (comandaAtual) imprimirComanda(comandaAtual);
                    else alert("Nenhuma comanda aberta para imprimir.");
                  }}
                  style={styles.btnPrimary}
                  title="Imprimir comanda"
                >
                  Imprimir
                </button>
              </div>
            </>
          )}
        </div>

        {/* Cardápio */}
        <div style={{ ...styles.card, maxWidth: 350 }}>
          <h3>Cardápio</h3>

          {categoriasOrdenadas.map(categoria => (
            <div key={categoria}>
              <h4 style={styles.title4}>{categoria}</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {produtosPorCategoria[categoria].map((item) => (
                  <button
                    key={item.nome}
                    style={styles.btnCardapio}
                    onClick={() => adicionarItem(mesaSelecionada, item)}
                    title={`Adicionar ${item.nome} - R$ ${item.preco.toFixed(2)}`}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#d0e7ff"}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#e9f5ff"}
                  >
                    {item.nome} <br /> R$ {item.preco.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exibir comandas finalizadas */}
      <div style={{ marginTop: 30 }}>
        <label style={styles.labelCheckbox}>
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
          />
          Mostrar comandas finalizadas
        </label>

        {mostrarFinalizadas && (
          <>
            <h3 style={{ marginTop: 20 }}>Comandas Finalizadas</h3>
            {comandasExibidas.length === 0 && <p>Nenhuma comanda finalizada nesta data.</p>}

            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {comandasExibidas.map((comanda, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#e2e3e5",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    boxShadow: "inset 0 0 5px #ccc",
                  }}
                >
                  <strong>Mesa: {comanda.mesa}</strong> | Data: {comanda.data}
                  <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                    {comanda.itens.map((item, idx) => (
                      <li key={idx}>
                        {item.nome} - R$ {item.preco.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 8, fontWeight: "600" }}>
                    Total: R$ {totalComanda(comanda)}
                  </div>
                  <button
                    onClick={() => imprimirComanda(comanda)}
                    style={{ ...styles.btnPrimary, marginTop: 8 }}
                    title="Imprimir comanda finalizada"
                  >
                    Imprimir
                  </button>
                  <button
                    onClick={() => excluirComanda(comanda.mesa, i)}
                    style={{ ...styles.btnDanger, marginLeft: 8, marginTop: 8 }}
                    title="Excluir comanda finalizada"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={styles.footer}>Total Geral de Vendas (finalizadas): R$ {totalGeralVendas}</div>
    </div>
  );
}
