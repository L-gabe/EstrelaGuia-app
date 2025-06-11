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

  // Salvar localStorage sempre que mesas, comandas ou dataSelecionada mudarem
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
    localStorage.setItem("comandas", JSON.stringify(comandas));
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [mesas, comandas, dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Adicionar nova mesa
  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim()) {
      setMesas([...mesas, { id: Date.now().toString(), nome: nome.trim() }]);
    }
  };

  // Editar nome mesa
  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim()) {
      setMesas(mesas.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
    }
  };

  // Adicionar item na comanda da mesa selecionada
  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }
    const mesaId = mesaSelecionada;
    const com = comandasDoDia[mesaId];
    const comanda = com && !Array.isArray(com) ? { ...com } : { status: "Aberta", itens: Array.isArray(com) ? com : [] };

    // Verifica se item já existe na comanda
    const idx = comanda.itens.findIndex(i => i.nome === item.nome);
    if (idx >= 0) {
      comanda.itens[idx].quantidade += 1;
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

  // Remover item da comanda da mesa
  const removerItem = (mesaId, nomeItem) => {
    const com = comandasDoDia[mesaId];
    if (!com) return;
    const comanda = com && !Array.isArray(com) ? { ...com } : { status: "Aberta", itens: Array.isArray(com) ? com : [] };
    const itensFiltrados = comanda.itens.filter(i => i.nome !== nomeItem);
    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: itensFiltrados },
      },
    });
  };

  // Alternar status da comanda (Aberta/Finalizada)
  const toggleStatus = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com) return;
    const comanda = com && !Array.isArray(com) ? { ...com } : { status: "Aberta", itens: Array.isArray(com) ? com : [] };
    const novoStatus = comanda.status === "Finalizada" ? "Aberta" : "Finalizada";
    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, status: novoStatus },
      },
    });
  };

  // Limpar itens da comanda da mesa
  const limparComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com) return;
    const comanda = com && !Array.isArray(com) ? { ...com } : { status: "Aberta", itens: Array.isArray(com) ? com : [] };
    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: [], status: "Aberta" },
      },
    });
  };

  // Excluir comanda da mesa (remove do objeto)
  const excluirComanda = (mesaId) => {
    if (!window.confirm("Deseja realmente excluir esta comanda?")) return;
    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];
    setComandas({ ...comandas, [dataSelecionada]: novasComandasDoDia });
  };

  // Limpar histórico (apaga todas comandas do dia)
  const limparHistorico = () => {
    if (!window.confirm("Deseja limpar todas as comandas do dia?")) return;
    const novasComandas = { ...comandas };
    delete novasComandas[dataSelecionada];
    setComandas(novasComandas);
    setMesaSelecionada(null);
  };

  // Calcular total geral vendas do dia
  const totalGeralVendas = () => {
    if (!comandasDoDia) return 0;
    return Object.values(comandasDoDia).reduce((total, com) => {
      if (!com || Array.isArray(com)) return total;
      if (com.status !== "Finalizada") return total;
      const totalComanda = com.itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);
      return total + totalComanda;
    }, 0);
  };

  // Imprimir comanda individual
  const imprimirComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com) {
      alert("Comanda vazia.");
      return;
    }
    const comanda = !Array.isArray(com) ? com : { itens: com, status: "Aberta" };
    const itensStr = comanda.itens
      .map(i => `${i.nome} x${i.quantidade} - R$${(i.preco * i.quantidade).toFixed(2)}`)
      .join("\n");
    const total = comanda.itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0).toFixed(2);
    const conteudo = `
Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}
Status: ${comanda.status}
Itens:
${itensStr}

Total: R$${total}
    `;
    const w = window.open();
    w.document.write("<pre>" + conteudo + "</pre>");
    w.print();
    w.close();
  };

  // Imprimir todas comandas finalizadas do dia
  const imprimirTodas = () => {
    const w = window.open();
    w.document.write("<h1>Comandas Finalizadas - " + dataSelecionada + "</h1>");
    Object.entries(comandasDoDia).forEach(([mesaId, com]) => {
      if (!com || Array.isArray(com)) return;
      if (com.status !== "Finalizada") return;
      const itensStr = com.itens
        .map(i => `${i.nome} x${i.quantidade} - R$${(i.preco * i.quantidade).toFixed(2)}`)
        .join("<br>");
      const total = com.itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0).toFixed(2);
      const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;
      w.document.write(`<h2>Mesa: ${nomeMesa}</h2>`);
      w.document.write(`<p>Status: ${com.status}</p>`);
      w.document.write(`<p>${itensStr}</p>`);
      w.document.write(`<p><b>Total: R$${total}</b></p><hr>`);
    });
    w.print();
    w.close();
  };

  // Render dos itens do cardápio por categoria
  const renderCardapio = () => {
    return categoriasOrdenadas.map((cat) => (
      <div key={cat} style={{ marginBottom: 12 }}>
        <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: 4 }}>{cat}</h3>
        <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #eee", padding: 6, borderRadius: 6 }}>
          {produtosPorCategoria[cat].map((item) => (
            <button
              key={item.nome}
              onClick={() => adicionarItem(item)}
              style={{
                margin: 4,
                padding: "6px 12px",
                cursor: "pointer",
                borderRadius: 6,
                border: "1px solid #007bff",
                backgroundColor: "#e7f1ff",
                fontSize: 14,
              }}
              title={`R$${item.preco.toFixed(2)}`}
              type="button"
            >
              {item.nome}
            </button>
          ))}
        </div>
      </div>
    ));
  };

  // Render das comandas (Aberta ou Finalizada conforme filtro)
  const renderComandas = () => {
    const filtradas = Object.entries(comandasDoDia)
      .filter(([mesaId, com]) => {
        if (!com) return false;
        if (Array.isArray(com)) return false;
        return mostrarFinalizadas ? com.status === "Finalizada" : com.status === "Aberta";
      })
      .sort((a, b) => {
        // Ordenar pelo nome da mesa
        const nomeA = mesas.find(m => m.id === a[0])?.nome || "";
        const nomeB = mesas.find(m => m.id === b[0])?.nome || "";
        return nomeA.localeCompare(nomeB);
      });

    if (filtradas.length === 0) {
      return <p>Nenhuma comanda {mostrarFinalizadas ? "finalizada" : "aberta"} neste dia.</p>;
    }

    return filtradas.map(([mesaId, com]) => {
      const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;
      const totalComanda = com.itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0).toFixed(2);
      return (
        <div
          key={mesaId}
          style={{
            border: mesaSelecionada === mesaId ? "2px solid #007bff" : "1px solid #ccc",
            borderRadius: 8,
            padding: 8,
            marginBottom: 12,
            cursor: "pointer",
            backgroundColor: mesaSelecionada === mesaId ? "#dbe9ff" : "#fafafa",
          }}
          onClick={() => setMesaSelecionada(mesaId)}
          title="Clique para selecionar esta mesa"
        >
          <div style={{ fontWeight: "bold", fontSize: 16 }}>
            Mesa: {nomeMesa} — <span style={{ color: com.status === "Finalizada" ? "green" : "red" }}>{com.status}</span>
          </div>
          <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: 120, overflowY: "auto" }}>
            {com.itens.map((item) => (
              <li key={item.nome} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>
                  {item.nome} x{item.quantidade}
                </span>
                <span>
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      removerItem(mesaId, item.nome);
                    }}
                    style={{
                      marginLeft: 8,
                      backgroundColor: "transparent",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    title="Remover item"
                    type="button"
                  >
                    &times;
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <div style={{ fontWeight: "bold", marginTop: 6 }}>Total: R$ {totalComanda}</div>
          <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={e => { e.stopPropagation(); toggleStatus(mesaId); }} type="button">
              {com.status === "Aberta" ? "Finalizar" : "Reabrir"}
            </button>
            <button onClick={e => { e.stopPropagation(); limparComanda(mesaId); }} type="button">
              Limpar
            </button>
            <button onClick={e => { e.stopPropagation(); excluirComanda(mesaId); }} type="button" style={{ color: "red" }}>
              Excluir
            </button>
            <button onClick={e => { e.stopPropagation(); imprimirComanda(mesaId); }} type="button">
              Imprimir
            </button>
            <button onClick={e => { e.stopPropagation(); editarNomeMesa(mesaId); }} type="button">
              Editar Nome Mesa
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", fontFamily: "Arial, sans-serif", padding: "0 16px" }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ textAlign: "center", marginBottom: 10 }}>Sistema de Comandas - Restaurante</h1>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <button onClick={adicionarMesa} type="button" style={{ flexGrow: 1, maxWidth: 200 }}>
            + Adicionar Mesa
          </button>
          <div style={{ flexGrow: 1, maxWidth: 250 }}>
            <label htmlFor="data" style={{ marginRight: 8, fontWeight: "bold" }}>
              Data:
            </label>
            <input
              id="data"
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div style={{ flexGrow: 1, maxWidth: 220 }}>
            <label>
              <input
                type="checkbox"
                checked={mostrarFinalizadas}
                onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
                style={{ marginRight: 6 }}
              />
              Mostrar Comandas Finalizadas
            </label>
          </div>
          <button onClick={limparHistorico} type="button" style={{ color: "red", flexGrow: 1, maxWidth: 200 }}>
            Limpar Histórico do Dia
          </button>
        </div>
      </header>

      <main style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Cardápio */}
        <section
          aria-label="Cardápio"
          style={{
            flex: "1 1 320px",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>Cardápio</h2>
          {renderCardapio()}
        </section>

        {/* Comandas */}
        <section
          aria-label="Comandas"
          style={{
            flex: "1 1 500px",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2>Comandas {mostrarFinalizadas ? "(Finalizadas)" : "(Abertas)"}</h2>
          {renderComandas()}
          <div style={{ marginTop: "auto", borderTop: "1px solid #ccc", paddingTop: 12 }}>
            <strong>Total Geral Vendas (Finalizadas): R$ {totalGeralVendas().toFixed(2)}</strong>
            <button
              onClick={imprimirTodas}
              type="button"
              style={{ marginLeft: 12, padding: "6px 12px", cursor: "pointer" }}
              disabled={totalGeralVendas() === 0}
              title={totalGeralVendas() === 0 ? "Nenhuma comanda finalizada para imprimir" : "Imprimir todas as comandas finalizadas do dia"}
            >
              Imprimir Todas
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
