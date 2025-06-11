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
    display: "flex",
    flexDirection: "column",
  },
  header: {
    color: "#2c3e50",
    marginBottom: 20,
  },
  flexRow: {
    display: "flex",
    gap: 20,
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgb(0 0 0 / 0.1)",
    padding: 15,
    minWidth: 280,
    maxHeight: "80vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  mesaItem: (selected, finalizada) => ({
    padding: "8px 12px",
    borderRadius: 6,
    marginBottom: 8,
    cursor: "pointer",
    backgroundColor: finalizada ? "#28a745" : selected ? "#007bff" : "#e9ecef",
    color: finalizada || selected ? "#fff" : "#212529",
    fontWeight: finalizada || selected ? "700" : "500",
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
    margin: "4px",
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
  // Adicionado estilos responsivos para celular
  "@media (max-width: 768px)": {
    flexRow: {
      flexDirection: "column",
    },
    card: {
      maxWidth: "100% !important",
      minWidth: "auto",
      marginBottom: 20,
      maxHeight: "none",
    },
    btnCardapio: {
      flex: "1 0 48%",
      maxWidth: "48%",
    },
  },
};

export default function App() {
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || []);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [finalizadas, setFinalizadas] = useState(() => new Set(JSON.parse(localStorage.getItem("finalizadas") || "[]")));
  const [nomeMesaEdicao, setNomeMesaEdicao] = useState("");
  const [novaMesaNome, setNovaMesaNome] = useState("");
  const [mostrarFinalizadasSeparadas, setMostrarFinalizadasSeparadas] = useState(true);

  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem("comandas", JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    localStorage.setItem("finalizadas", JSON.stringify(Array.from(finalizadas)));
  }, [finalizadas]);

  // Adiciona uma nova mesa
  function adicionarMesa() {
    if (!novaMesaNome.trim()) return alert("Digite um nome para a mesa.");
    if (mesas.some(m => m.nome === novaMesaNome.trim())) {
      return alert("Já existe uma mesa com este nome.");
    }
    setMesas([...mesas, { id: Date.now(), nome: novaMesaNome.trim() }]);
    setNovaMesaNome("");
  }

  // Edita o nome da mesa selecionada
  function salvarNomeMesa() {
    if (!nomeMesaEdicao.trim()) return alert("Digite um nome válido.");
    if (mesas.some(m => m.nome === nomeMesaEdicao.trim() && m.id !== mesaSelecionada)) {
      return alert("Já existe uma mesa com este nome.");
    }
    setMesas(mesas.map(m => (m.id === mesaSelecionada ? { ...m, nome: nomeMesaEdicao.trim() } : m)));
  }

  // Seleciona uma mesa e carrega sua comanda
  function selecionarMesa(id) {
    setMesaSelecionada(id);
    const mesa = mesas.find(m => m.id === id);
    setNomeMesaEdicao(mesa ? mesa.nome : "");
  }

  // Adiciona item na comanda da mesa selecionada
  function adicionarItem(produto) {
    if (!mesaSelecionada) return alert("Selecione uma mesa.");
    setComandas(prev => {
      const novaComandas = [...prev];
      let comanda = novaComandas.find(c => c.mesaId === mesaSelecionada);
      if (!comanda) {
        comanda = { mesaId: mesaSelecionada, itens: [] };
        novaComandas.push(comanda);
      }
      const itemExistente = comanda.itens.find(i => i.nome === produto.nome);
      if (itemExistente) {
        itemExistente.qtd += 1;
      } else {
        comanda.itens.push({ nome: produto.nome, preco: produto.preco, qtd: 1 });
      }
      return novaComandas;
    });
  }

  // Remove item da comanda da mesa selecionada
  function removerItem(nomeItem) {
    if (!mesaSelecionada) return;
    setComandas(prev => {
      const novaComandas = [...prev];
      const comanda = novaComandas.find(c => c.mesaId === mesaSelecionada);
      if (!comanda) return prev;
      comanda.itens = comanda.itens.filter(i => i.nome !== nomeItem);
      return novaComandas;
    });
  }

  // Limpa a comanda da mesa selecionada
  function limparComanda() {
    if (!mesaSelecionada) return;
    if (!confirm("Deseja limpar todos os itens da comanda?")) return;
    setComandas(prev => prev.filter(c => c.mesaId !== mesaSelecionada));
    setFinalizadas(prev => {
      const novaSet = new Set(prev);
      novaSet.delete(mesaSelecionada);
      return novaSet;
    });
  }

  // Exclui a comanda da mesa selecionada (igual limpar + remove finalizada)
  function excluirComanda() {
    limparComanda();
  }

  // Finaliza a comanda da mesa selecionada
  function finalizarComanda() {
    if (!mesaSelecionada) return alert("Selecione uma mesa para finalizar.");
    const comanda = comandas.find(c => c.mesaId === mesaSelecionada);
    if (!comanda || comanda.itens.length === 0) {
      return alert("A comanda está vazia.");
    }
    setFinalizadas(prev => new Set(prev).add(mesaSelecionada));
  }

  // Reabre uma comanda finalizada
  function reabrirComanda(idMesa) {
    setFinalizadas(prev => {
      const novaSet = new Set(prev);
      novaSet.delete(idMesa);
      return novaSet;
    });
  }

  // Calcula o total da comanda da mesa selecionada
  function totalComanda() {
    const comanda = comandas.find(c => c.mesaId === mesaSelecionada);
    if (!comanda) return 0;
    return comanda.itens.reduce((acc, i) => acc + i.preco * i.qtd, 0);
  }

  // Total geral das comandas finalizadas (soma de todas as mesas finalizadas)
  function totalGeral() {
    let total = 0;
    for (const mesaId of finalizadas) {
      const comanda = comandas.find(c => c.mesaId === mesaId);
      if (comanda) {
        total += comanda.itens.reduce((acc, i) => acc + i.preco * i.qtd, 0);
      }
    }
    return total;
  }

  // Imprime a comanda da mesa selecionada
  function imprimirComanda(mesaId) {
    const comanda = comandas.find(c => c.mesaId === mesaId);
    const mesa = mesas.find(m => m.id === mesaId);
    if (!comanda || !mesa) return alert("Comanda não encontrada.");
    const itensHtml = comanda.itens
      .map(i => `<tr><td>${i.nome}</td><td>${i.qtd}</td><td>R$ ${i.preco.toFixed(2)}</td><td>R$ ${(i.preco * i.qtd).toFixed(2)}</td></tr>`)
      .join("");
    const total = comanda.itens.reduce((acc, i) => acc + i.preco * i.qtd, 0);
    const html = `
      <html><head><title>Comanda - Mesa ${mesa.nome}</title></head><body>
      <h2>Comanda - Mesa ${mesa.nome}</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Total</th></tr>
        </thead>
        <tbody>${itensHtml}</tbody>
        <tfoot>
          <tr><td colspan="3" style="text-align:right;"><b>Total:</b></td><td><b>R$ ${total.toFixed(2)}</b></td></tr>
        </tfoot>
      </table>
      </body></html>`;
    const printWindow = window.open("", "_blank", "width=600,height=600");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  // Imprime todas as comandas finalizadas, cada uma em nova janela/aba (ou imprime concat.)
  function imprimirTodasFinalizadas() {
    if (finalizadas.size === 0) return alert("Nenhuma comanda finalizada para imprimir.");
    let html = `<html><head><title>Comandas Finalizadas</title></head><body>`;
    for (const mesaId of finalizadas) {
      const comanda = comandas.find(c => c.mesaId === mesaId);
      const mesa = mesas.find(m => m.id === mesaId);
      if (!comanda || !mesa) continue;
      const itensHtml = comanda.itens
        .map(i => `<tr><td>${i.nome}</td><td>${i.qtd}</td><td>R$ ${i.preco.toFixed(2)}</td><td>R$ ${(i.preco * i.qtd).toFixed(2)}</td></tr>`)
        .join("");
      const total = comanda.itens.reduce((acc, i) => acc + i.preco * i.qtd, 0);
      html += `
        <h2>Comanda - Mesa ${mesa.nome}</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 30px;">
          <thead>
            <tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Total</th></tr>
          </thead>
          <tbody>${itensHtml}</tbody>
          <tfoot>
            <tr><td colspan="3" style="text-align:right;"><b>Total:</b></td><td><b>R$ ${total.toFixed(2)}</b></td></tr>
          </tfoot>
        </table>`;
    }
    html += `</body></html>`;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  // Limpar todo o histórico de comandas e finalizadas
  function limparHistorico() {
    if (!confirm("Deseja realmente limpar todo o histórico de comandas? Essa ação não pode ser desfeita.")) return;
    setComandas([]);
    setFinalizadas(new Set());
  }

  // Comanda da mesa selecionada
  const comandaSelecionada = comandas.find(c => c.mesaId === mesaSelecionada);

  // Itens da comanda para exibir e editar
  const itensComanda = comandaSelecionada ? comandaSelecionada.itens : [];

  // Mesas abertas e finalizadas (para separar visual)
  const mesasFinalizadas = mesas.filter(m => finalizadas.has(m.id));
  const mesasAbertas = mesas.filter(m => !finalizadas.has(m.id));

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Sistema de Comandas - Restaurante</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nome nova mesa"
          value={novaMesaNome}
          onChange={e => setNovaMesaNome(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", marginRight: 10 }}
        />
        <button style={styles.btnPrimary} onClick={adicionarMesa}>Adicionar Mesa</button>
      </div>

      <div style={styles.flexRow}>
        {/* Lista de mesas */}
        <div style={{ ...styles.card, flex: 1, maxWidth: 280 }}>
          <h3>Mesas</h3>
          <div>
            <h4>Abertas</h4>
            {mesasAbertas.length === 0 && <p style={{ fontStyle: "italic", color: "#888" }}>Nenhuma mesa aberta</p>}
            {mesasAbertas.map(mesa => (
              <div
                key={mesa.id}
                style={styles.mesaItem(mesa.id === mesaSelecionada, false)}
                onClick={() => selecionarMesa(mesa.id)}
              >
                <span>{mesa.nome}</span>
                {mesa.id === mesaSelecionada && (
                  <button style={styles.btnSmall} title="Reabrir não disponível" disabled>
                    <small></small>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 15 }}>
            <h4>Finalizadas</h4>
            {mesasFinalizadas.length === 0 && <p style={{ fontStyle: "italic", color: "#888" }}>Nenhuma mesa finalizada</p>}
            {mesasFinalizadas.map(mesa => (
              <div
                key={mesa.id}
                style={styles.mesaItem(mesa.id === mesaSelecionada, true)}
                onClick={() => selecionarMesa(mesa.id)}
              >
                <span>{mesa.nome}</span>
                <button
                  style={styles.btnSmall}
                  onClick={e => {
                    e.stopPropagation();
                    reabrirComanda(mesa.id);
                    selecionarMesa(mesa.id);
                  }}
                  title="Reabrir comanda"
                >
                  ↺
                </button>
              </div>
            ))}
          </div>

          {mesaSelecionada && (
            <div style={{ marginTop: 20 }}>
              <input
                type="text"
                value={nomeMesaEdicao}
                onChange={e => setNomeMesaEdicao(e.target.value)}
                placeholder="Editar nome da mesa"
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
              />
              <button style={{ ...styles.btnPrimary, marginTop: 8, width: "100%" }} onClick={salvarNomeMesa}>
                Salvar Nome Mesa
              </button>
            </div>
          )}

          <button
            style={{ ...styles.btnDanger, marginTop: 20, width: "100%" }}
            onClick={limparHistorico}
            title="Limpar histórico completo"
          >
            Limpar Histórico de Comandas
          </button>
        </div>

        {/* Cardápio */}
        <div style={{ ...styles.card, flex: 2, maxWidth: 600 }}>
          <h3>Cardápio</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            {categoriasOrdenadas.map(cat => (
              <div key={cat} style={{ width: "100%" }}>
                <h4 style={styles.title4}>{cat}</h4>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {produtosPorCategoria[cat].map(produto => (
                    <button
                      key={produto.nome}
                      onClick={() => adicionarItem(produto)}
                      style={styles.btnCardapio}
                      title={`Adicionar ${produto.nome} - R$ ${produto.preco.toFixed(2)}`}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = "#d0e7ff"}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = "#e9f5ff"}
                      type="button"
                    >
                      {produto.nome} <br /> R$ {produto.preco.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comanda da mesa selecionada */}
        <div style={{ ...styles.card, flex: 1, maxWidth: 350 }}>
          <h3>Comanda {mesaSelecionada ? `- Mesa ${nomeMesaEdicao}` : ""}</h3>

          {!mesaSelecionada && <p>Selecione uma mesa para gerenciar a comanda.</p>}

          {mesaSelecionada && (
            <>
              {itensComanda.length === 0 && <p>Comanda vazia</p>}

              {itensComanda.length > 0 && (
                <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: 300, overflowY: "auto" }}>
                  {itensComanda.map(item => (
                    <li
                      key={item.nome}
                      style={styles.listItem}
                      onClick={() => removerItem(item.nome)}
                      title="Clique para remover item"
                    >
                      <span>{item.nome}</span>
                      <span>
                        {item.qtd} x R$ {item.preco.toFixed(2)} = R$ {(item.qtd * item.preco).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ marginTop: 10, fontWeight: "700", fontSize: 16 }}>
                Total: R$ {totalComanda().toFixed(2)}
              </div>

              <div style={{ marginTop: 15, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={styles.btnPrimary} onClick={finalizarComanda} disabled={finalizadas.has(mesaSelecionada)}>
                  Finalizar Comanda
                </button>
                <button style={styles.btnWarning} onClick={limparComanda}>
                  Limpar Comanda
                </button>
                <button style={styles.btnDanger} onClick={excluirComanda}>
                  Excluir Comanda
                </button>
                <button style={styles.btnPrimary} onClick={() => imprimirComanda(mesaSelecionada)}>
                  Imprimir Comanda
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: "center" }}>
        <button style={styles.btnPrimary} onClick={imprimirTodasFinalizadas}>
          Imprimir Todas Comandas Finalizadas
        </button>
      </div>

      <div style={styles.footer}>Total Geral de Vendas (finalizadas): R$ {totalGeral().toFixed(2)}</div>
    </div>
  );
}
