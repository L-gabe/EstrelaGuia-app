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

  // Funções diversas já existentes omitidas aqui para brevidade (mantidas iguais)

  // ...

  // Função para imprimir mesa
  const imprimirMesa = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda || Array.isArray(comanda)) {
      alert("Não há comanda para esta mesa.");
      return;
    }
    const printContent = `
      <h3>Comanda Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h3>
      <ul>
        ${comanda.itens.map(i => `<li>${i.nome} x${i.quantidade} = R$${(i.preco * i.quantidade).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total: R$${comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0).toFixed(2)}</strong></p>
    `;
    const printWindow = window.open('', '', 'width=400,height=600');
    printWindow.document.write('<html><head><title>Imprimir Comanda</title>');
    printWindow.document.write('<style>body{font-family:sans-serif; padding:20px;} h3 {margin-bottom:10px;} ul{padding-left:20px;} li{margin-bottom:5px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // Nova função: imprimir todas as comandas abertas e finalizadas do dia
  const imprimirTodasComandas = () => {
    if (!Object.keys(comandasDoDia).length) {
      alert("Não há comandas para imprimir no dia selecionado.");
      return;
    }
    let content = `<h1>Comandas do dia ${dataSelecionada}</h1>`;
    Object.entries(comandasDoDia).forEach(([mesaId, comanda]) => {
      if (!comanda || Array.isArray(comanda)) return;
      const mesaNome = mesas.find(m => m.id === mesaId)?.nome || mesaId;
      const total = comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0);
      content += `
        <section style="margin-bottom: 25px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
          <h3>Mesa: ${mesaNome} (${comanda.status})</h3>
          <ul>
            ${comanda.itens.map(i => `<li>${i.nome} x${i.quantidade} = R$${(i.preco * i.quantidade).toFixed(2)}</li>`).join('')}
          </ul>
          <p><strong>Total: R$${total.toFixed(2)}</strong></p>
        </section>
      `;
    });
    const printWindow = window.open('', '', 'width=600,height=800');
    printWindow.document.write('<html><head><title>Imprimir Todas as Comandas</title>');
    printWindow.document.write('<style>body{font-family:sans-serif; padding:20px;} h1,h3{margin-bottom:10px;} ul{padding-left:20px;} li{margin-bottom:5px;} section{page-break-inside: avoid;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // Layout inspirado no Sischef
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: 1300,
        margin: "0 auto",
        padding: 20,
        background: "#fff",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <header style={{ marginBottom: 25, textAlign: "center" }}>
        <h1 style={{ fontWeight: "700", fontSize: 28, color: "#2C3E50" }}>
          Sistema de Comandas - Restaurante
        </h1>
        <div style={{ marginTop: 10 }}>
          <label htmlFor="dataSelecionada" style={{ marginRight: 8, fontWeight: "600" }}>
            Data:
          </label>
          <input
            id="dataSelecionada"
            type="date"
            value={dataSelecionada}
            onChange={e => setDataSelecionada(e.target.value)}
            style={{
              padding: "6px 12px",
              fontSize: 16,
              borderRadius: 5,
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            onClick={() => setMostrarFinalizadas(!mostrarFinalizadas)}
            style={{
              marginLeft: 15,
              padding: "7px 14px",
              fontWeight: "600",
              borderRadius: 5,
              border: "none",
              cursor: "pointer",
              backgroundColor: mostrarFinalizadas ? "#2980B9" : "#bdc3c7",
              color: "#fff",
              transition: "background-color 0.3s",
            }}
            title="Mostrar/Ocultar comandas finalizadas"
          >
            {mostrarFinalizadas ? "Ocultar Finalizadas" : "Mostrar Finalizadas"}
          </button>
          <button
            onClick={imprimirTodasComandas}
            style={{
              marginLeft: 15,
              padding: "7px 18px",
              fontWeight: "600",
              borderRadius: 5,
              border: "none",
              cursor: "pointer",
              backgroundColor: "#27AE60",
              color: "#fff",
              transition: "background-color 0.3s",
            }}
            title="Imprimir todas as comandas do dia"
          >
            Imprimir Todas as Comandas
          </button>
        </div>
      </header>

      <main style={{ display: "flex", gap: 20, flexGrow: 1 }}>
        {/* Lado esquerdo - Listagem mesas e comandas */}
        <section
          style={{
            flexBasis: 320,
            borderRight: "1px solid #ddd",
            paddingRight: 15,
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <h2 style={{ fontWeight: "700", fontSize: 20, marginBottom: 15, color: "#34495E" }}>
            Mesas
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {mesas.map((mesa) => {
              const comanda = comandasDoDia[mesa.id];
              const isFinalizada = comanda?.status === "Finalizada";
              if (!mostrarFinalizadas && isFinalizada) return null;
              return (
                <div
                  key={mesa.id}
                  onClick={() => setMesaSelecionada(mesa.id)}
                  style={{
                    padding: 12,
                    cursor: "pointer",
                    borderRadius: 6,
                    backgroundColor: mesa.id === mesaSelecionada ? "#3498DB" : "#ecf0f1",
                    color: mesa.id === mesaSelecionada ? "#fff" : "#2c3e50",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "600",
                    boxShadow: mesa.id === mesaSelecionada ? "0 0 8px rgba(52,152,219,0.5)" : "none",
                    transition: "background-color 0.3s",
                  }}
                >
                  <span>
                    {mesa.nome} {isFinalizada ? "✅" : ""}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Excluir a mesa "${mesa.nome}"?`)) {
                        const novaLista = mesas.filter(m => m.id !== mesa.id);
                        setMesas(novaLista);
                        // Remover comandas associadas também
                        const novoComandas = { ...comandas };
                        if (novoComandas[dataSelecionada]) {
                          delete novoComandas[dataSelecionada][mesa.id];
                          setComandas(novoComandas);
                        }
                        if (mesaSelecionada === mesa.id) setMesaSelecionada(null);
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: mesa.id === mesaSelecionada ? "#fff" : "#c0392b",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                    title="Excluir mesa"
                    aria-label={`Excluir mesa ${mesa.nome}`}
                  >
                    &times;
                  </button>
                </div>
              );
            })}
            <button
              onClick={() => {
                const novoId = `mesa_${Date.now()}`;
                const novoNome = prompt("Nome da nova mesa:", `Mesa ${mesas.length + 1}`);
                if (novoNome) setMesas([...mesas, { id: novoId, nome: novoNome }]);
              }}
              style={{
                marginTop: 10,
                padding: "10px",
                borderRadius: 6,
                backgroundColor: "#2980B9",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
              }}
              aria-label="Adicionar nova mesa"
            >
              + Adicionar Mesa
            </button>
          </div>
        </section>

        {/* Lado direito - Detalhes da comanda da mesa */}
        <section
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {!mesaSelecionada ? (
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                color: "#7f8c8d",
              }}
            >
              Selecione uma mesa para visualizar a comanda
            </div>
          ) : (
            <ComandaMesa
              mesaId={mesaSelecionada}
              mesas={mesas}
              comandasDoDia={comandasDoDia}
              setComandas={setComandas}
              dataSelecionada={dataSelecionada}
              produtosPorCategoria={produtosPorCategoria}
              categoriasOrdenadas={categoriasOrdenadas}
              imprimirMesa={imprimirMesa}
            />
          )}
        </section>
      </main>

      <footer
        style={{
          marginTop: 25,
          paddingTop: 15,
          borderTop: "1px solid #ddd",
          textAlign: "center",
          color: "#95a5a6",
          fontSize: 14,
        }}
      >
        &copy; 2025 Restaurante - Sistema de Comandas
      </footer>
    </div>
  );
}

// Componente para mostrar e editar a comanda da mesa selecionada
function ComandaMesa({
  mesaId,
  mesas,
  comandasDoDia,
  setComandas,
  dataSelecionada,
  produtosPorCategoria,
  categoriasOrdenadas,
  imprimirMesa,
}) {
  const mesa = mesas.find((m) => m.id === mesaId);
  const comandaAtual = comandasDoDia[mesaId] || { itens: [], status: "Aberta" };

  const [itens, setItens] = useState(comandaAtual.itens);
  const [status, setStatus] = useState(comandaAtual.status);

  // Atualiza estado local quando comanda externa muda
  useEffect(() => {
    setItens(comandaAtual.itens);
    setStatus(comandaAtual.status);
  }, [comandaAtual]);

  // Salvar alterações na comanda no armazenamento local
  const salvarComanda = () => {
    setComandas((antigo) => {
      const novo = { ...antigo };
      if (!novo[dataSelecionada]) novo[dataSelecionada] = {};
      novo[dataSelecionada][mesaId] = { itens, status };
      return novo;
    });
    alert("Comanda salva!");
  };

  const adicionarItem = (produto) => {
    setItens((antigos) => {
      const index = antigos.findIndex((i) => i.nome === produto.nome);
      if (index !== -1) {
        const novos = [...antigos];
        novos[index].quantidade += 1;
        return novos;
      }
      return [...antigos, { nome: produto.nome, preco: produto.preco, quantidade: 1 }];
    });
  };

  const removerItem = (nome) => {
    setItens((antigos) => antigos.filter((i) => i.nome !== nome));
  };

  const alterarQuantidade = (nome, novaQuant) => {
    if (novaQuant < 1) return;
    setItens((antigos) => {
      const novos = [...antigos];
      const index = novos.findIndex((i) => i.nome === nome);
      if (index !== -1) {
        novos[index].quantidade = novaQuant;
      }
      return novos;
    });
  };

  const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  const limparComanda = () => {
    if (window.confirm("Deseja realmente limpar todos os itens da comanda?")) setItens([]);
  };

  const finalizarComanda = () => {
    if (window.confirm("Finalizar comanda? Depois não poderá alterar os itens.")) {
      setStatus("Finalizada");
      salvarComanda();
    }
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
          borderBottom: "1px solid #ddd",
          paddingBottom: 8,
        }}
      >
        <h2 style={{ fontWeight: "700", color: "#2C3E50" }}>{mesa?.nome || "Mesa"}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => imprimirMesa(mesaId)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#3498DB",
              border: "none",
              borderRadius: 5,
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            title="Imprimir comanda"
          >
            🖨 Imprimir
          </button>
          <button
            onClick={salvarComanda}
            style={{
              padding: "8px 14px",
              backgroundColor: "#27AE60",
              border: "none",
              borderRadius: 5,
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            title="Salvar comanda"
          >
            💾 Salvar
          </button>
          <button
            onClick={limparComanda}
            disabled={status === "Finalizada"}
            style={{
              padding: "8px 14px",
              backgroundColor: "#e74c3c",
              border: "none",
              borderRadius: 5,
              color: "#fff",
              fontWeight: "600",
              cursor: status === "Finalizada" ? "not-allowed" : "pointer",
              opacity: status === "Finalizada" ? 0.5 : 1,
              transition: "background-color 0.3s",
            }}
            title="Limpar comanda"
          >
            🧹 Limpar
          </button>
          <button
            onClick={finalizarComanda}
            disabled={status === "Finalizada" || itens.length === 0}
            style={{
              padding: "8px 14px",
              backgroundColor: "#f39c12",
              border: "none",
              borderRadius: 5,
              color: "#fff",
              fontWeight: "600",
              cursor:
                status === "Finalizada" || itens.length === 0 ? "not-allowed" : "pointer",
              opacity: status === "Finalizada" || itens.length === 0 ? 0.5 : 1,
              transition: "background-color 0.3s",
            }}
            title="Finalizar comanda"
          >
            ✔️ Finalizar
          </button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          gap: 20,
          flexGrow: 1,
          overflow: "hidden",
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        {/* Lista de itens da comanda */}
        <div
          style={{
            flexBasis: 350,
            padding: 15,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            borderRight: "1px solid #ddd",
            backgroundColor: "#f7f9fa",
          }}
        >
          <h3 style={{ fontWeight: "700", marginBottom: 10, color: "#34495E" }}>Itens da Comanda</h3>
          {itens.length === 0 ? (
            <p style={{ color: "#95a5a6", fontStyle: "italic" }}>Nenhum item adicionado</p>
          ) : (
            itens.map((item) => (
              <div
                key={item.nome}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{item.nome}</strong>
                  <br />
                  <small>R$ {item.preco.toFixed(2)}</small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    min={1}
                    value={item.quantidade}
                    disabled={status === "Finalizada"}
                    onChange={(e) => alterarQuantidade(item.nome, Number(e.target.value))}
                    style={{
                      width: 50,
                      padding: 4,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  />
                  <button
                    onClick={() => removerItem(item.nome)}
                    disabled={status === "Finalizada"}
                    style={{
                      backgroundColor: "#e74c3c",
                      border: "none",
                      borderRadius: 4,
                      color: "#fff",
                      fontWeight: "700",
                      cursor: status === "Finalizada" ? "not-allowed" : "pointer",
                      padding: "4px 8px",
                      transition: "background-color 0.3s",
                    }}
                    title="Remover item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
          <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #ddd" }}>
            <strong>Total: R$ {total.toFixed(2)}</strong>
          </div>
        </div>

        {/* Cardápio para adicionar itens */}
        <div
          style={{
            flexGrow: 1,
            padding: 15,
            overflowY: "auto",
            backgroundColor: "#fafafa",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <h3 style={{ fontWeight: "700", marginBottom: 10, color: "#34495E" }}>
            Cardápio
          </h3>
          {categoriasOrdenadas.map((categoria) => (
            <div key={categoria} style={{ marginBottom: 15 }}>
              <h4
                style={{
                  borderBottom: "2px solid #2980B9",
                  paddingBottom: 4,
                  marginBottom: 8,
                  color: "#2980B9",
                }}
              >
                {categoria}
              </h4>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {produtosPorCategoria[categoria].map((produto) => (
                  <button
                    key={produto.nome}
                    onClick={() => adicionarItem(produto)}
                    disabled={status === "Finalizada"}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #2980B9",
                      backgroundColor: "#fff",
                      color: "#2980B9",
                      cursor: status === "Finalizada" ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      transition: "background-color 0.3s",
                      flex: "1 0 120px",
                      textAlign: "center",
                    }}
                    title={`Adicionar ${produto.nome} - R$${produto.preco.toFixed(2)}`}
                  >
                    {produto.nome} <br />
                    <small>R$ {produto.preco.toFixed(2)}</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
