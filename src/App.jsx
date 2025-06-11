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

  // Pega as comandas do dia selecionado
  const comandasDoDia = comandas[dataSelecionada] || {};

  // Função para adicionar nova mesa
  const adicionarMesa = () => {
    const nome = prompt("Digite o nome da nova mesa:");
    if (nome && nome.trim()) {
      setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
    }
  };

  // Editar nome da mesa
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

    // Se for formato antigo só array, converte para objeto padrão
    if (!comandaAtual.itens) {
      comandaAtual = { status: comandaAtual.status || "Aberta", itens: Array.isArray(comandaAtual) ? comandaAtual : [] };
    }

    // Verifica se já existe o item
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

  // Limpar itens da comanda (reseta itens)
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

  // Total geral vendas finalizadas do dia
  const totalGeralFinalizadas = Object.entries(comandasDoDia)
    .filter(([_, comanda]) => comanda.status === "Finalizada")
    .reduce((acc, [_, comanda]) => acc + comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0), 0);

  // Imprimir comanda (abre janela de impressão)
  const imprimirComanda = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) {
      alert("Não há comanda para imprimir.");
      return;
    }

    const janela = window.open("", "Impressão", "width=600,height=600");
    janela.document.write(`<h2>Comanda Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h2>`);
    janela.document.write(`<p>Data: ${dataSelecionada}</p>`);
    janela.document.write(`<p>Status: ${comandaAtual.status}</p>`);
    janela.document.write("<ul>");
    comandaAtual.itens.forEach(i => {
      janela.document.write(`<li>${i.nome} x ${i.quantidade} - R$ ${ (i.preco * i.quantidade).toFixed(2) }</li>`);
    });
    janela.document.write("</ul>");
    janela.document.write(`<h3>Total: R$ ${totalComanda(mesaId).toFixed(2)}</h3>`);
    janela.document.close();
    janela.print();
  };

  // Imprimir todas comandas do dia (finalizadas)
  const imprimirTodas = () => {
    const janela = window.open("", "Impressão", "width=600,height=600");
    janela.document.write(`<h2>Comandas Finalizadas - Data: ${dataSelecionada}</h2>`);

    const finalizadas = Object.entries(comandasDoDia).filter(([_, c]) => c.status === "Finalizada");
    if (finalizadas.length === 0) {
      janela.document.write("<p>Nenhuma comanda finalizada para imprimir.</p>");
    } else {
      finalizadas.forEach(([mesaId, comanda]) => {
        janela.document.write(`<hr/><h3>Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h3>`);
        janela.document.write("<ul>");
        comanda.itens.forEach(i => {
          janela.document.write(`<li>${i.nome} x ${i.quantidade} - R$ ${(i.preco * i.quantidade).toFixed(2)}</li>`);
        });
        janela.document.write("</ul>");
        janela.document.write(`<p><b>Total: R$ ${comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0).toFixed(2)}</b></p>`);
      });
      janela.document.write(`<hr/><h3>Total Geral: R$ ${totalGeralFinalizadas.toFixed(2)}</h3>`);
    }
    janela.document.close();
    janela.print();
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 16, maxWidth: 1200, margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Sistema de Comandas</h1>

      <div style={{ marginBottom: 12 }}>
        <label>Selecionar data:{" "}
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </label>
        <button
          onClick={() => setMostrarFinalizadas(!mostrarFinalizadas)}
          style={{ marginLeft: 12, padding: "4px 8px", cursor: "pointer" }}
        >
          {mostrarFinalizadas ? "Mostrar Abertas" : "Mostrar Finalizadas"}
        </button>
        <button
          onClick={imprimirTodas}
          style={{ marginLeft: 12, padding: "4px 8px", cursor: "pointer" }}
          title="Imprimir todas as comandas finalizadas"
        >
          Imprimir Todas Finalizadas
        </button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Listagem mesas */}
        <div style={{ flex: "1 1 200px", border: "1px solid #ddd", borderRadius: 6, padding: 12, height: "600px", overflowY: "auto" }}>
          <h2>Mesas</h2>
          <button
            onClick={adicionarMesa}
            style={{ marginBottom: 8, padding: "6px 12px", cursor: "pointer" }}
          >
            + Nova Mesa
          </button>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mesas.map((mesa) => (
              <li
                key={mesa.id}
                onClick={() => setMesaSelecionada(mesa.id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: mesa.id === mesaSelecionada ? "#cce5ff" : "#f9f9f9",
                  borderRadius: 4,
                  marginBottom: 6,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                title="Clique para selecionar"
              >
                <span>{mesa.nome}</span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    editarNomeMesa(mesa.id);
                  }}
                  style={{
                    fontSize: 14,
                    padding: "2px 6px",
                    cursor: "pointer",
                    backgroundColor: "#eee",
                    borderRadius: 3,
                    border: "none"
                  }}
                  title="Editar nome"
                >
                  ✏️
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Cardápio */}
        <div style={{ flex: 3, border: "1px solid #ddd", borderRadius: 6, padding: 12, height: "600px", overflowY: "auto" }}>
          <h2>Cardápio {mesaSelecionada ? `(Mesa: ${mesas.find(m => m.id === mesaSelecionada)?.nome || ''})` : "(Selecione uma mesa)"}</h2>
          {!mesaSelecionada && <p>Selecione uma mesa para adicionar itens.</p>}
          {mesaSelecionada && categoriasOrdenadas.map(categoria => (
            <div key={categoria} style={{ marginBottom: 16 }}>
              <h3 style={{ borderBottom: "1px solid #ddd" }}>{categoria}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {produtosPorCategoria[categoria].map(item => (
                  <button
                    key={item.nome}
                    disabled={!mesaSelecionada}
                    onClick={() => adicionarItem(item)}
                    style={{
                      padding: "6px 12px",
                      cursor: "pointer",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      backgroundColor: "#f5f5f5",
                      flex: "1 0 120px",
                      textAlign: "center",
                      whiteSpace: "normal",
                    }}
                    title={`Adicionar ${item.nome} - R$ ${item.preco.toFixed(2)}`}
                  >
                    {item.nome}<br />
                    <small>R$ {item.preco.toFixed(2)}</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comanda selecionada */}
        <div style={{ flex: 2, border: "1px solid #ddd", borderRadius: 6, padding: 12, height: "600px", overflowY: "auto" }}>
          <h2>Comanda {mesaSelecionada ? `(Mesa: ${mesas.find(m => m.id === mesaSelecionada)?.nome || ''})` : "(Selecione uma mesa)"}</h2>

          {!mesaSelecionada && <p>Selecione uma mesa para ver e editar a comanda.</p>}

          {mesaSelecionada && (
            <>
              {comandasDoDia[mesaSelecionada] ? (
                <>
                  <p>Status: <b>{comandasDoDia[mesaSelecionada].status}</b></p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {comandasDoDia[mesaSelecionada].itens.length === 0 && <li>Nenhum item adicionado.</li>}
                    {comandasDoDia[mesaSelecionada].itens.map((item, idx) => (
                      <li
                        key={`${item.nome}-${idx}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                          backgroundColor: "#f9f9f9",
                          padding: "4px 8px",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                        title="Clique para remover item"
                        onClick={() => removerItem(mesaSelecionada, item.nome)}
                      >
                        <span>{item.nome} x {item.quantidade}</span>
                        <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <p style={{ fontWeight: "bold" }}>Total: R$ {totalComanda(mesaSelecionada).toFixed(2)}</p>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => toggleStatus(mesaSelecionada)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: comandasDoDia[mesaSelecionada].status === "Aberta" ? "#4caf50" : "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      title="Alternar status Aberta/Finalizada"
                    >
                      {comandasDoDia[mesaSelecionada].status === "Aberta" ? "Finalizar" : "Reabrir"}
                    </button>

                    <button
                      onClick={() => limparComanda(mesaSelecionada)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#ff9800",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      title="Limpar comanda (remover todos os itens)"
                    >
                      Limpar
                    </button>

                    <button
                      onClick={() => excluirComanda(mesaSelecionada)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#e91e63",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      title="Excluir comanda"
                    >
                      Excluir
                    </button>

                    <button
                      onClick={() => imprimirComanda(mesaSelecionada)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#2196f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      title="Imprimir comanda"
                    >
                      Imprimir
                    </button>
                  </div>
                </>
              ) : (
                <p>Nenhuma comanda para essa mesa nesta data.</p>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 12, borderTop: "1px solid #ddd", textAlign: "center" }}>
        <strong>Total geral vendas finalizadas no dia {dataSelecionada}: R$ {totalGeralFinalizadas.toFixed(2)}</strong>
      </div>

      {/* Exibir lista de comandas abertas ou finalizadas */}
      <div style={{ marginTop: 16 }}>
        <h2>Comandas {mostrarFinalizadas ? "Finalizadas" : "Abertas"} do dia {dataSelecionada}</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.entries(comandasDoDia)
            .filter(([_, comanda]) => comanda.status === (mostrarFinalizadas ? "Finalizada" : "Aberta"))
            .map(([mesaId, comanda]) => (
              <li
                key={mesaId}
                onClick={() => setMesaSelecionada(mesaId)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: mesaId === mesaSelecionada ? "#cce5ff" : "#f0f0f0",
                  marginBottom: 6,
                  borderRadius: 4,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                title="Clique para selecionar mesa"
              >
                <span>{mesas.find(m => m.id === mesaId)?.nome || mesaId}</span>
                <span>Itens: {comanda.itens.length}</span>
                <span>Total: R$ {totalComanda(mesaId).toFixed(2)}</span>
              </li>
            ))}
          {Object.entries(comandasDoDia).filter(([_, c]) => c.status === (mostrarFinalizadas ? "Finalizada" : "Aberta")).length === 0 && (
            <li>Nenhuma comanda {mostrarFinalizadas ? "finalizada" : "aberta"} neste dia.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
