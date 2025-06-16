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
    if (!window.confirm("Tem certeza que deseja limpar todas as comandas deste dia?")) return;
    setComandas(prev => ({ ...prev, [dataSelecionada]: {} }));
    setMesaSelecionada(null);
  };

  const totalComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return 0;
    return com.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  };

  const totalGeral = () => {
    if (!comandasDoDia) return 0;
    return Object.values(comandasDoDia).reduce((acc, c) => {
      if (!c || Array.isArray(c)) return acc;
      if (c.status === "Finalizada") {
        return acc + c.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
      }
      return acc;
    }, 0);
  };

  // Impressão

  const imprimirComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;

    const win = window.open("", "_blank");
    if (!win) return alert("Impressão bloqueada pelo navegador.");

    const mesaNome = mesas.find(m => m.id === mesaId)?.nome || "Mesa";

    win.document.write(`
      <html>
      <head>
        <title>Comanda - ${mesaNome}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background: #eee; }
          tfoot td { font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Comanda - ${mesaNome}</h2>
        <table>
          <thead>
            <tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${com.itens.map(i => `<tr><td>${i.nome}</td><td>${i.quantidade}</td><td>R$ ${i.preco.toFixed(2)}</td><td>R$ ${(i.preco * i.quantidade).toFixed(2)}</td></tr>`).join("")}
          </tbody>
          <tfoot>
            <tr><td colspan="3">Total</td><td>R$ ${totalComanda(mesaId).toFixed(2)}</td></tr>
          </tfoot>
        </table>
      </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const imprimirTodasComandas = () => {
    const win = window.open("", "_blank");
    if (!win) return alert("Impressão bloqueada pelo navegador.");

    let conteudo = `
      <html>
      <head>
        <title>Comandas do Dia - ${dataSelecionada}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h2 { text-align: center; margin-top: 40px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background: #eee; }
          tfoot td { font-weight: bold; }
          hr { border: 1px dashed #ccc; margin: 40px 0; }
          @media print {
            hr { page-break-after: always; border: none; }
          }
        </style>
      </head>
      <body>
        <h1>Comandas do Dia - ${dataSelecionada}</h1>
    `;

    Object.entries(comandasDoDia).forEach(([mesaId, com]) => {
      if (!com || Array.isArray(com)) return;
      const mesaNome = mesas.find(m => m.id === mesaId)?.nome || "Mesa";
      conteudo += `
        <h2>${mesaNome} (${com.status})</h2>
        <table>
          <thead>
            <tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${com.itens.map(i => `<tr><td>${i.nome}</td><td>${i.quantidade}</td><td>R$ ${i.preco.toFixed(2)}</td><td>R$ ${(i.preco * i.quantidade).toFixed(2)}</td></tr>`).join("")}
          </tbody>
          <tfoot>
            <tr><td colspan="3">Total</td><td>R$ ${totalComanda(mesaId).toFixed(2)}</td></tr>
          </tfoot>
        </table>
        <hr />
      `;
    });

    conteudo += `
      <h2>Total Geral: R$ ${totalGeral().toFixed(2)}</h2>
      </body>
      </html>
    `;

    win.document.write(conteudo);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // Layout e renderização

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: 1200, margin: "auto", padding: 15 }}>
      <header style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ color: "#2c3e50" }}>Sistema de Comandas - Restaurante</h1>
      </header>

      <section style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <label htmlFor="data-selec" style={{ fontWeight: "600", marginRight: 8 }}>Data:</label>
          <input
            type="date"
            id="data-selec"
            value={dataSelecionada}
            onChange={e => setDataSelecionada(e.target.value)}
            style={{ padding: 6, borderRadius: 5, border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <button onClick={adicionarMesa} style={botaoPrimarioStyle}>+ Nova Mesa</button>
          <button onClick={limparTudo} style={{ ...botaoSecundarioStyle, marginLeft: 8 }}>Limpar Comandas do Dia</button>
          <button onClick={imprimirTodasComandas} style={{ ...botaoPrimarioStyle, marginLeft: 8 }}>🖨️ Imprimir Todas as Comandas</button>
          <button
            style={{ marginLeft: 8, padding: "6px 10px", borderRadius: 5, border: "1px solid #999", cursor: "pointer" }}
            onClick={() => setMostrarFinalizadas(prev => !prev)}
            title="Mostrar/Ocultar Comandas Finalizadas"
          >
            {mostrarFinalizadas ? "Ocultar Finalizadas" : "Mostrar Finalizadas"}
          </button>
        </div>
      </section>

      <section style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <aside style={{ flex: "1 1 250px", maxHeight: "70vh", overflowY: "auto", border: "1px solid #ddd", borderRadius: 6, padding: 12, background: "#fafafa" }}>
          <h2 style={{ marginTop: 0, marginBottom: 12, color: "#34495e" }}>Mesas</h2>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mesas.map(mesa => {
              const isSelected = mesaSelecionada === mesa.id;
              const com = comandasDoDia[mesa.id];
              const status = com && !Array.isArray(com) ? com.status : "Sem Comanda";

              if (!mostrarFinalizadas && status === "Finalizada") return null;

              return (
                <li
                  key={mesa.id}
                  onClick={() => setMesaSelecionada(mesa.id)}
                  style={{
                    padding: "10px 15px",
                    marginBottom: 8,
                    borderRadius: 6,
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#3498db" : "#fff",
                    color: isSelected ? "#fff" : "#2c3e50",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "600",
                    border: status === "Finalizada" ? "2px solid #27ae60" : "1px solid #ccc",
                  }}
                  title={`Status: ${status}`}
                >
                  <span>{mesa.nome}</span>
                  <div>
                    <button
                      onClick={e => { e.stopPropagation(); editarNomeMesa(mesa.id); }}
                      title="Editar nome da mesa"
                      style={botaoIconeStyle}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); excluirMesa(mesa.id); }}
                      title="Excluir mesa"
                      style={{ ...botaoIconeStyle, marginLeft: 6, color: "red" }}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        <main style={{ flex: "3 1 600px", maxHeight: "70vh", overflowY: "auto" }}>
          {!mesaSelecionada && <p style={{ color: "#666" }}>Selecione uma mesa para gerenciar a comanda.</p>}

          {mesaSelecionada && (() => {
            const com = comandasDoDia[mesaSelecionada];
            if (!com || Array.isArray(com)) {
              return <p style={{ color: "#666" }}>Nenhuma comanda para esta mesa. Adicione itens clicando no cardápio.</p>;
            }

            return (
              <>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h2 style={{ margin: 0, color: "#34495e" }}>
                    Comanda - {mesas.find(m => m.id === mesaSelecionada)?.nome}
                  </h2>
                  <div>
                    <button onClick={() => toggleStatus(mesaSelecionada)} style={{ ...botaoPrimarioStyle, marginRight: 8 }}>
                      {com.status === "Finalizada" ? "Reabrir Comanda" : "Finalizar Comanda"}
                    </button>
                    <button onClick={() => limparComanda(mesaSelecionada)} style={botaoSecundarioStyle}>Limpar</button>
                    <button onClick={() => excluirComanda(mesaSelecionada)} style={{ ...botaoSecundarioStyle, marginLeft: 8, color: "red" }}>Excluir</button>
                    <button onClick={() => imprimirComanda(mesaSelecionada)} style={{ ...botaoPrimarioStyle, marginLeft: 8 }}>🖨️ Imprimir</button>
                  </div>
                </header>

                {com.itens.length === 0 && <p style={{ color: "#666" }}>Nenhum item adicionado.</p>}

                {com.itens.length > 0 && (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#eee" }}>
                        <th style={thTdStyle}>Item</th>
                        <th style={thTdStyle}>Qtd</th>
                        <th style={thTdStyle}>Preço</th>
                        <th style={thTdStyle}>Total</th>
                        <th style={thTdStyle}>Remover</th>
                      </tr>
                    </thead>
                    <tbody>
                      {com.itens.map(item => (
                        <tr key={item.nome}>
                          <td style={thTdStyle}>{item.nome}</td>
                          <td style={{ ...thTdStyle, textAlign: "center" }}>{item.quantidade}</td>
                          <td style={{ ...thTdStyle, textAlign: "right" }}>R$ {item.preco.toFixed(2)}</td>
                          <td style={{ ...thTdStyle, textAlign: "right" }}>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                          <td style={{ ...thTdStyle, textAlign: "center" }}>
                            <button
                              onClick={() => removerItem(mesaSelecionada, item.nome)}
                              title="Remover item"
                              style={{ ...botaoIconeStyle, color: "red" }}
                            >
                              ❌
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" style={{ ...thTdStyle, fontWeight: "bold", textAlign: "right" }}>Total</td>
                        <td style={{ ...thTdStyle, fontWeight: "bold", textAlign: "right" }}>R$ {totalComanda(mesaSelecionada).toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </>
            );
          })()}
        </main>

        <aside style={{ flex: "2 1 300px", maxHeight: "70vh", overflowY: "auto", border: "1px solid #ddd", borderRadius: 6, padding: 12, background: "#f9f9f9" }}>
          <h2 style={{ marginTop: 0, marginBottom: 12, color: "#34495e" }}>Cardápio</h2>

          {categoriasOrdenadas.map(cat => (
            <div key={cat} style={{ marginBottom: 15 }}>
              <h3 style={{ borderBottom: "2px solid #3498db", paddingBottom: 4, color: "#2980b9" }}>{cat}</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {produtosPorCategoria[cat].map(prod => (
                  <li
                    key={prod.nome}
                    style={{
                      padding: "6px 10px",
                      marginBottom: 6,
                      borderRadius: 5,
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      border: "1px solid #ccc",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "500",
                      transition: "background-color 0.2s"
                    }}
                    onClick={() => adicionarItem(prod)}
                    title={`Adicionar ${prod.nome}`}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = "#eaf4fc")}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = "#fff")}
                  >
                    <span>{prod.nome}</span>
                    <span style={{ color: "#27ae60", fontWeight: "600" }}>R$ {prod.preco.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      </section>

      <footer style={{ marginTop: 30, textAlign: "center", color: "#777", fontSize: 14 }}>
        <p>Total Geral de Vendas (Finalizadas): <strong>R$ {totalGeral().toFixed(2)}</strong></p>
      </footer>
    </div>
  );
}

// Estilos
const botaoPrimarioStyle = {
  backgroundColor: "#3498db",
  border: "none",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "600",
  fontSize: 14,
  transition: "background-color 0.3s",
};

const botaoSecundarioStyle = {
  backgroundColor: "#ecf0f1",
  border: "none",
  color: "#34495e",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "600",
  fontSize: 14,
};

const botaoIconeStyle = {
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  padding: 4,
  color: "#2980b9",
};

const thTdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

export default App;
