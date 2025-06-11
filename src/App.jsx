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

export default function App() {
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || {});
  const [dataSelecionada, setDataSelecionada] = useState(() => localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10));
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  // Salvar no localStorage sempre que alterar mesas, comandas ou dataSelecionada
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
    localStorage.setItem("comandas", JSON.stringify(comandas));
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [mesas, comandas, dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Funções para adicionar/editar mesas
  const adicionarMesa = () => {
    const nome = prompt("Digite o nome da nova mesa:");
    if (nome && nome.trim()) {
      setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
    }
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Digite o novo nome da mesa:");
    if (novoNome && novoNome.trim()) {
      setMesas(prev => prev.map(mesa => (mesa.id === id ? { ...mesa, nome: novoNome.trim() } : mesa)));
    }
  };

  // Adicionar item na comanda da mesa selecionada
  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa para adicionar itens.");
      return;
    }

    const mesaId = mesaSelecionada;
    let comandaAtual = comandasDoDia[mesaId] || { status: "Aberta", itens: [] };

    // Corrigir possível formato antigo
    if (!comandaAtual.itens) {
      comandaAtual = { status: comandaAtual.status || "Aberta", itens: Array.isArray(comandaAtual) ? comandaAtual : [] };
    }

    const index = comandaAtual.itens.findIndex(i => i.nome === item.nome);
    if (index !== -1) {
      comandaAtual.itens[index].quantidade += 1;
    } else {
      comandaAtual.itens.push({ ...item, quantidade: 1 });
    }

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comandaAtual,
      },
    }));
  };

  // Remover item da comanda
  const removerItem = (mesaId, nomeItem) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return;

    const itensAtualizados = comandaAtual.itens.filter(i => i.nome !== nomeItem);

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comandaAtual, itens: itensAtualizados },
      },
    }));
  };

  // Alternar status Aberta/Finalizada
  const toggleStatus = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return;
    const novoStatus = comandaAtual.status === "Finalizada" ? "Aberta" : "Finalizada";

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comandaAtual, status: novoStatus },
      },
    }));
  };

  // Limpar itens da comanda
  const limparComanda = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return;

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comandaAtual, itens: [], status: "Aberta" },
      },
    }));
  };

  // Excluir comanda da mesa (remove do histórico do dia)
  const excluirComanda = (mesaId) => {
    const novasComandas = { ...comandasDoDia };
    delete novasComandas[mesaId];

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandas,
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Total da comanda
  const totalComanda = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return 0;
    return comandaAtual.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  };

  // Total geral do dia
  const totalGeral = () => {
    return Object.keys(comandasDoDia).reduce((acc, mesaId) => {
      const c = comandasDoDia[mesaId];
      if (!c) return acc;
      return acc + c.itens.reduce((acc2, i) => acc2 + i.preco * i.quantidade, 0);
    }, 0);
  };

  // Imprimir comanda individual
  const imprimirComanda = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) {
      alert("Comanda vazia.");
      return;
    }
    const itensStr = comandaAtual.itens
      .map(i => `${i.quantidade} x ${i.nome} - R$ ${i.preco.toFixed(2)}`)
      .join("\n");
    const texto = `Comanda Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}\nStatus: ${comandaAtual.status}\nItens:\n${itensStr}\nTotal: R$ ${totalComanda(mesaId).toFixed(2)}`;
    const janela = window.open("", "_blank", "width=300,height=500");
    janela.document.write(`<pre>${texto}</pre>`);
    janela.document.close();
    janela.focus();
    janela.print();
  };

  // Imprimir todas as comandas do dia
  const imprimirTodas = () => {
    let texto = `Todas as Comandas - Data: ${dataSelecionada}\n\n`;
    Object.keys(comandasDoDia).forEach(mesaId => {
      const c = comandasDoDia[mesaId];
      if (!c) return;
      texto += `Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId} - Status: ${c.status}\n`;
      texto += c.itens.map(i => `${i.quantidade} x ${i.nome} - R$ ${i.preco.toFixed(2)}`).join("\n");
      texto += `\nTotal: R$ ${totalComanda(mesaId).toFixed(2)}\n\n`;
    });
    const janela = window.open("", "_blank", "width=400,height=600");
    janela.document.write(`<pre>${texto}</pre>`);
    janela.document.close();
    janela.focus();
    janela.print();
  };

  // Limpar histórico de todas comandas do dia
  const limparHistoricoDia = () => {
    if (window.confirm("Tem certeza que quer limpar todo o histórico do dia?")) {
      setComandas(prev => ({
        ...prev,
        [dataSelecionada]: {},
      }));
      setMesaSelecionada(null);
    }
  };

  return (
    <div style={{ padding: 10, fontFamily: "Arial, sans-serif" }}>
      <h1>Sistema de Comandas</h1>

      <div style={{ marginBottom: 10 }}>
        <label>Data: </label>
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
        <button onClick={limparHistoricoDia} style={{ marginLeft: 10, color: "red" }}>
          Limpar Histórico do Dia
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <button onClick={adicionarMesa}>Adicionar Mesa</button>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Listagem de mesas */}
        <div style={{ minWidth: 200, border: "1px solid #ccc", padding: 10 }}>
          <h3>Mesas</h3>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {mesas.map(mesa => (
              <li
                key={mesa.id}
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  backgroundColor: mesa.id === mesaSelecionada ? "#cce5ff" : "#f9f9f9",
                  marginBottom: 5,
                  borderRadius: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => setMesaSelecionada(mesa.id)}
              >
                <span>{mesa.nome}</span>
                <button onClick={(e) => { e.stopPropagation(); editarNomeMesa(mesa.id); }} style={{ fontSize: 12 }}>Editar</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Cardápio */}
        <div style={{ flex: 1, border: "1px solid #ccc", padding: 10, maxHeight: "80vh", overflowY: "auto" }}>
          <h3>Cardápio</h3>
          {categoriasOrdenadas.map(categoria => (
            <div key={categoria} style={{ marginBottom: 15 }}>
              <h4>{categoria}</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {produtosPorCategoria[categoria].map(item => (
                  <button
                    key={item.nome}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 4,
                      border: "1px solid #007bff",
                      backgroundColor: "#e7f1ff",
                      cursor: "pointer",
                      flex: "1 0 30%",
                      maxWidth: 180,
                    }}
                    onClick={() => adicionarItem(item)}
                    title={`R$ ${item.preco.toFixed(2)}`}
                  >
                    {item.nome} <br /> R$ {item.preco.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comanda da mesa selecionada */}
        <div style={{ minWidth: 300, border: "1px solid #ccc", padding: 10, maxHeight: "80vh", overflowY: "auto" }}>
          <h3>
            Comanda -{" "}
            {mesaSelecionada
              ? mesas.find(m => m.id === mesaSelecionada)?.nome || mesaSelecionada
              : "Selecione uma mesa"}
          </h3>
          {!mesaSelecionada && <p>Selecione uma mesa para ver ou adicionar itens.</p>}
          {mesaSelecionada && (
            <>
              <div>
                <button onClick={() => toggleStatus(mesaSelecionada)} style={{ marginRight: 10 }}>
                  {comandasDoDia[mesaSelecionada]?.status === "Finalizada" ? "Reabrir" : "Finalizar"}
                </button>
                <button onClick={() => limparComanda(mesaSelecionada)} style={{ marginRight: 10, color: "orange" }}>
                  Limpar
                </button>
                <button onClick={() => excluirComanda(mesaSelecionada)} style={{ color: "red" }}>
                  Excluir Comanda
                </button>
              </div>

              <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 10 }}>
                {(comandasDoDia[mesaSelecionada]?.itens || []).map(item => (
                  <li
                    key={item.nome}
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "5px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => removerItem(mesaSelecionada, item.nome)}
                    title="Clique para remover"
                  >
                    <span>{item.quantidade} x {item.nome}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <h4>Total: R$ {totalComanda(mesaSelecionada).toFixed(2)}</h4>
              <button onClick={() => imprimirComanda(mesaSelecionada)}>Imprimir Comanda</button>
            </>
          )}
        </div>
      </div>

      {/* Exibição das comandas finalizadas separadas */}
      <div style={{ marginTop: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
          />{" "}
          Mostrar Comandas Finalizadas Separadamente
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={imprimirTodas}>Imprimir Todas as Comandas do Dia</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Total Geral do Dia: R$ {totalGeral().toFixed(2)}</h3>
      </div>

      {/* Listagem agrupada das comandas do dia, separando abertas e finalizadas */}
      <div style={{ marginTop: 30 }}>
        <h2>Comandas do Dia {dataSelecionada}</h2>
        <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <h3>Comandas Abertas</h3>
            {Object.entries(comandasDoDia)
              .filter(([, c]) => c.status === "Aberta")
              .map(([mesaId, comanda]) => (
                <div
                  key={mesaId}
                  style={{
                    border: "1px solid #007bff",
                    padding: 10,
                    borderRadius: 4,
                    marginBottom: 10,
                    backgroundColor: "#e7f1ff",
                  }}
                >
                  <strong>{mesas.find(m => m.id === mesaId)?.nome || mesaId}</strong>
                  <ul style={{ marginTop: 5, paddingLeft: 15 }}>
                    {comanda.itens.map(i => (
                      <li key={i.nome}>
                        {i.quantidade} x {i.nome} - R$ {(i.preco * i.quantidade).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <div><b>Total:</b> R$ {totalComanda(mesaId).toFixed(2)}</div>
                </div>
              ))}
            {Object.values(comandasDoDia).filter(c => c.status === "Aberta").length === 0 && <p>Nenhuma comanda aberta.</p>}
          </div>

          <div style={{ flex: 1, minWidth: 250 }}>
            <h3>Comandas Finalizadas</h3>
            {mostrarFinalizadas ? (
              Object.entries(comandasDoDia)
                .filter(([, c]) => c.status === "Finalizada")
                .map(([mesaId, comanda]) => (
                  <div
                    key={mesaId}
                    style={{
                      border: "1px solid #28a745",
                      padding: 10,
                      borderRadius: 4,
                      marginBottom: 10,
                      backgroundColor: "#d4edda",
                    }}
                  >
                    <strong>{mesas.find(m => m.id === mesaId)?.nome || mesaId}</strong>
                    <ul style={{ marginTop: 5, paddingLeft: 15 }}>
                      {comanda.itens.map(i => (
                        <li key={i.nome}>
                          {i.quantidade} x {i.nome} - R$ {(i.preco * i.quantidade).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <div><b>Total:</b> R$ {totalComanda(mesaId).toFixed(2)}</div>
                    <button onClick={() => imprimirComanda(mesaId)}>Imprimir Comanda</button>
                  </div>
                ))
            ) : (
              <p>Ative a opção acima para mostrar as comandas finalizadas.</p>
            )}
            {mostrarFinalizadas && Object.values(comandasDoDia).filter(c => c.status === "Finalizada").length === 0 && <p>Nenhuma comanda finalizada.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
