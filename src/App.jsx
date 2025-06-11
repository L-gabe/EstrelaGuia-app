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
};

export default function App() {
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || {});
  const [dataSelecionada, setDataSelecionada] = useState(() => localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10));
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [editandoMesa, setEditandoMesa] = useState(null);
  const [novoNomeMesa, setNovoNomeMesa] = useState("");

  // Salvar mesas e comandas no localStorage
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem("comandas", JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [dataSelecionada]);

  // Criar nova mesa
  function criarMesa() {
    const novoId = mesas.length ? Math.max(...mesas.map(m => m.id)) + 1 : 1;
    const nomePadrao = `Mesa ${novoId}`;
    const novaMesa = { id: novoId, nome: nomePadrao };
    setMesas([...mesas, novaMesa]);
    setMesaSelecionada(novoId);
  }

  // Editar nome da mesa
  function salvarEdicaoMesa() {
    if (!novoNomeMesa.trim()) return alert("Nome da mesa não pode ficar vazio");
    setMesas(mesas.map(m => (m.id === editandoMesa ? { ...m, nome: novoNomeMesa.trim() } : m)));
    setEditandoMesa(null);
    setNovoNomeMesa("");
  }

  // Apagar mesa (confirmação e remover todas as comandas dela)
  function apagarMesa(id) {
    if (!window.confirm("Tem certeza que deseja apagar esta mesa e suas comandas?")) return;
    setMesas(mesas.filter(m => m.id !== id));
    setMesaSelecionada(null);

    // Remover comandas da mesa
    const novasComandas = { ...comandas };
    for (const key in novasComandas) {
      if (novasComandas[key].mesaId === id) {
        delete novasComandas[key];
      }
    }
    setComandas(novasComandas);
  }

  // Criar nova comanda para mesa e data
  function criarComanda(mesaId, data) {
    const idComanda = `${mesaId}-${data}`;
    if (!comandas[idComanda]) {
      setComandas(prev => ({
        ...prev,
        [idComanda]: {
          mesaId,
          data,
          itens: [],
          status: "aberta",
        },
      }));
    }
  }

  // Selecionar mesa e garantir que a comanda existe para a data
  useEffect(() => {
    if (mesaSelecionada) {
      criarComanda(mesaSelecionada, dataSelecionada);
    }
  }, [mesaSelecionada, dataSelecionada]);

  // Adicionar item na comanda
  function adicionarItem(produto) {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa primeiro");
      return;
    }
    const idComanda = `${mesaSelecionada}-${dataSelecionada}`;
    setComandas(prev => {
      const atual = prev[idComanda] || { itens: [], status: "aberta", mesaId: mesaSelecionada, data: dataSelecionada };
      return {
        ...prev,
        [idComanda]: {
          ...atual,
          itens: [...atual.itens, produto],
        },
      };
    });
  }

  // Remover item da comanda pelo índice
  function removerItem(indice) {
    if (!mesaSelecionada) return;
    const idComanda = `${mesaSelecionada}-${dataSelecionada}`;
    setComandas(prev => {
      const atual = prev[idComanda];
      if (!atual) return prev;
      const novosItens = atual.itens.filter((_, i) => i !== indice);
      return {
        ...prev,
        [idComanda]: {
          ...atual,
          itens: novosItens,
        },
      };
    });
  }

  // Limpar comanda
  function limparComanda() {
    if (!mesaSelecionada) return;
    const idComanda = `${mesaSelecionada}-${dataSelecionada}`;
    setComandas(prev => ({
      ...prev,
      [idComanda]: { ...prev[idComanda], itens: [] },
    }));
  }

  // Finalizar comanda (muda status)
  function finalizarComanda() {
    if (!mesaSelecionada) return;
    const idComanda = `${mesaSelecionada}-${dataSelecionada}`;
    setComandas(prev => ({
      ...prev,
      [idComanda]: { ...prev[idComanda], status: "finalizada" },
    }));
  }

  // Reabrir comanda
  function reabrirComanda(idComanda) {
    setComandas(prev => ({
      ...prev,
      [idComanda]: { ...prev[idComanda], status: "aberta" },
    }));
    const [mesaId] = idComanda.split("-");
    setMesaSelecionada(Number(mesaId));
  }

  // Apagar comanda
  function apagarComanda(idComanda) {
    if (!window.confirm("Deseja realmente apagar esta comanda?")) return;
    setComandas(prev => {
      const copia = { ...prev };
      delete copia[idComanda];
      return copia;
    });
  }

  // Total geral do dia
  function totalGeral() {
    let total = 0;
    for (const id in comandas) {
      if (comandas[id].data === dataSelecionada) {
        comandas[id].itens.forEach(item => (total += item.preco));
      }
    }
    return total.toFixed(2);
  }

  // Comandas do dia, separadas por status
  const comandasDoDia = Object.entries(comandas).filter(([key, com]) => com.data === dataSelecionada);

  const comandasAbertas = comandasDoDia.filter(([, c]) => c.status === "aberta");
  const comandasFinalizadas = comandasDoDia.filter(([, c]) => c.status === "finalizada");

  // Itens da comanda selecionada
  const itensComandaSelecionada =
    (mesaSelecionada && comandas[`${mesaSelecionada}-${dataSelecionada}`]?.itens) || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Sistema de Comandas para Restaurante</h1>

      <div style={{ marginBottom: 15 }}>
        <label>
          Selecione a data:{" "}
          <input
            type="date"
            value={dataSelecionada}
            onChange={e => setDataSelecionada(e.target.value)}
          />
        </label>
      </div>

      <div style={styles.flexRow}>
        {/* Lista de mesas */}
        <div style={{ ...styles.card, flex: 1, maxWidth: 320 }}>
          <h3>Mesas</h3>
          <button style={styles.btnPrimary} onClick={criarMesa}>+ Nova Mesa</button>
          <div style={{ marginTop: 10 }}>
            {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
            {mesas.map(mesa => (
              <div
                key={mesa.id}
                style={styles.mesaItem(mesaSelecionada === mesa.id)}
                onClick={() => setMesaSelecionada(mesa.id)}
              >
                {editandoMesa === mesa.id ? (
                  <>
                    <input
                      type="text"
                      value={novoNomeMesa}
                      onChange={e => setNovoNomeMesa(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") salvarEdicaoMesa();
                        if (e.key === "Escape") setEditandoMesa(null);
                      }}
                      autoFocus
                    />
                    <button style={styles.btnSmall} onClick={salvarEdicaoMesa}>Salvar</button>
                    <button style={styles.btnSmall} onClick={() => setEditandoMesa(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <span>{mesa.nome}</span>
                    <div>
                      <button
                        style={styles.btnSmall}
                        onClick={e => {
                          e.stopPropagation();
                          setEditandoMesa(mesa.id);
                          setNovoNomeMesa(mesa.nome);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        style={styles.btnSmall}
                        onClick={e => {
                          e.stopPropagation();
                          apagarMesa(mesa.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cardápio por categoria */}
        <div style={{ ...styles.card, flex: 2 }}>
          <h3>Cardápio (clique para adicionar)</h3>
          {categoriasOrdenadas.map(categoria => (
            <div key={categoria}>
              <h4 style={styles.title4}>{categoria}</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {produtosPorCategoria[categoria].map((produto, idx) => (
                  <button
                    key={idx}
                    style={styles.btnCardapio}
                    onClick={() => adicionarItem(produto)}
                    title={`${produto.nome} - R$ ${produto.preco.toFixed(2)}`}
                  >
                    {produto.nome} <br /> R$ {produto.preco.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comanda da mesa selecionada */}
        <div style={{ ...styles.card, flex: 1, maxWidth: 360 }}>
          <h3>Comanda - {mesaSelecionada ? mesas.find(m => m.id === mesaSelecionada)?.nome : "Nenhuma mesa selecionada"}</h3>

          {mesaSelecionada ? (
            <>
              {itensComandaSelecionada.length === 0 && <p>Comanda vazia.</p>}
              {itensComandaSelecionada.map((item, idx) => (
                <div
                  key={idx}
                  style={styles.listItem}
                  onClick={() => removerItem(idx)}
                  title="Clique para remover item"
                >
                  <span>{item.nome}</span>
                  <span>R$ {item.preco.toFixed(2)}</span>
                </div>
              ))}

              <div style={{ marginTop: 10, fontWeight: "700" }}>
                Total: R$ {itensComandaSelecionada.reduce((acc, i) => acc + i.preco, 0).toFixed(2)}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={styles.btnWarning} onClick={limparComanda} disabled={itensComandaSelecionada.length === 0}>
                  Limpar
                </button>
                <button style={styles.btnPrimary} onClick={finalizarComanda} disabled={itensComandaSelecionada.length === 0}>
                  Finalizar Comanda
                </button>
              </div>
            </>
          ) : (
            <p>Selecione uma mesa para ver e editar a comanda.</p>
          )}
        </div>
      </div>

      {/* Exibir comandas finalizadas */}
      <div style={{ marginTop: 40 }}>
        <h3>Comandas Finalizadas em {dataSelecionada}</h3>
        {comandasFinalizadas.length === 0 && <p>Não há comandas finalizadas nesta data.</p>}
        {comandasFinalizadas.map(([idComanda, comanda]) => {
          const mesa = mesas.find(m => m.id === comanda.mesaId);
          const total = comanda.itens.reduce((acc, i) => acc + i.preco, 0).toFixed(2);
          return (
            <div key={idComanda} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
              <strong>{mesa?.nome || "Mesa não encontrada"}</strong> - Total: R$ {total}{" "}
              <button style={styles.btnLink} onClick={() => reabrirComanda(idComanda)}>Reabrir</button>{" "}
              <button style={styles.btnLink} onClick={() => apagarComanda(idComanda)}>Apagar</button>
            </div>
          );
        })}
      </div>

      {/* Total geral */}
      <footer style={styles.footer}>Total geral vendas em {dataSelecionada}: R$ {totalGeral()}</footer>
    </div>
  );
}
