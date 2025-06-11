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
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(true); // NOVO: controle de exibição das mesas finalizadas
  const printRef = useRef();

  // Persistência no localStorage
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem("comandas", JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Funções para mesas
  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim()) {
      setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
    }
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim()) {
      setMesas(prev => prev.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
    }
  };

  // NOVO: excluir mesa
  const excluirMesa = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir essa mesa? Isso também removerá a comanda associada.")) return;

    setMesas(prev => prev.filter(m => m.id !== id));

    // Também remove a comanda dessa mesa no dia selecionado
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

  // Adicionar item na comanda
  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }
    const mesaId = mesaSelecionada;
    const com = comandasDoDia[mesaId];
    const comanda = com && !Array.isArray(com)
      ? { ...com }
      : { status: "Aberta", itens: [] };

    if (!Array.isArray(comanda.itens)) {
      comanda.itens = [];
    }

    const idx = comanda.itens.findIndex(i => i.nome === item.nome);
    if (idx >= 0) {
      comanda.itens[idx].quantidade += 1;
    } else {
      comanda.itens.push({ ...item, quantidade: 1 });
    }

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      }
    }));
  };

  // Remover item da comanda
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

  // Alternar status da comanda
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

  // Limpar itens da comanda
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

  // Excluir comanda da mesa no dia
  const excluirComanda = (mesaId) => {
    if (!window.confirm("Excluir a comanda dessa mesa?")) return;
    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandasDoDia,
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Calcular total da comanda
  const totalComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return 0;
    return com.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  };

  // Calcular total geral das vendas do dia
  const totalGeral = () => {
    return Object.values(comandasDoDia).reduce((acc, com) => {
      if (!com || Array.isArray(com) || com.status !== "Finalizada") return acc;
      return acc + com.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
    }, 0);
  };

  // Função para imprimir a comanda de uma mesa específica
  const imprimirComanda = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda) {
      alert("Comanda vazia");
      return;
    }

    const janela = window.open("", "", "width=600,height=600");
    janela.document.write("<html><head><title>Imprimir Comanda</title></head><body>");
    janela.document.write(`<h2>Comanda - Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}</h2>`);
    janela.document.write(`<p>Data: ${dataSelecionada}</p>`);
    janela.document.write("<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse; width: 100%'>");
    janela.document.write("<thead><tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr></thead><tbody>");
    comanda.itens.forEach(item => {
      janela.document.write(`<tr><td>${item.nome}</td><td>${item.quantidade}</td><td>R$ ${item.preco.toFixed(2)}</td><td>R$ ${(item.preco * item.quantidade).toFixed(2)}</td></tr>`);
    });
    janela.document.write("</tbody></table>");
    janela.document.write(`<h3>Total: R$ ${totalComanda(mesaId).toFixed(2)}</h3>`);
    janela.document.write("</body></html>");
    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  };

  // NOVO: Imprimir todas as comandas do dia selecionado
  const imprimirTodasComandas = () => {
    const comandaKeys = Object.keys(comandasDoDia);
    if (comandaKeys.length === 0) {
      alert("Não há comandas para imprimir nesse dia.");
      return;
    }
    const janela = window.open("", "", "width=600,height=600");
    janela.document.write("<html><head><title>Imprimir Todas as Comandas</title></head><body>");
    janela.document.write(`<h2>Comandas do dia: ${dataSelecionada}</h2>`);
    comandaKeys.forEach(mesaId => {
      const comanda = comandasDoDia[mesaId];
      if (!comanda) return;
      janela.document.write(`<hr><h3>Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId} (${comanda.status})</h3>`);
      janela.document.write("<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse; width: 100%'>");
      janela.document.write("<thead><tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr></thead><tbody>");
      comanda.itens.forEach(item => {
        janela.document.write(`<tr><td>${item.nome}</td><td>${item.quantidade}</td><td>R$ ${item.preco.toFixed(2)}</td><td>R$ ${(item.preco * item.quantidade).toFixed(2)}</td></tr>`);
      });
      janela.document.write("</tbody></table>");
      janela.document.write(`<p><strong>Total: R$ ${totalComanda(mesaId).toFixed(2)}</strong></p>`);
    });
    janela.document.write(`<h2>Total Geral: R$ ${totalGeral().toFixed(2)}</h2>`);
    janela.document.write("</body></html>");
    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  };

  // Filtrar mesas para mostrar, ocultando finalizadas se checkbox estiver desmarcado
  const mesasFiltradas = mostrarFinalizadas
    ? mesas
    : mesas.filter(mesa => {
      const comanda = comandasDoDia[mesa.id];
      return !comanda || (comanda.status !== "Finalizada");
    });

  return (
    <div className="app-container">
      <h1>Controle de Comandas - Restaurante</h1>

      {/* Seletor de data */}
      <div>
        <label>Data: </label>
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
        />
      </div>

      {/* Controle de mesas */}
      <div className="mesas-container" style={{ marginTop: 10 }}>
        <h2>Mesas</h2>
        <button onClick={adicionarMesa}>Adicionar Mesa</button>
        {/* Novo botão para imprimir todas as comandas */}
        <button onClick={imprimirTodasComandas} style={{ marginLeft: 10 }}>
          Imprimir Todas as Comandas do Dia
        </button>

        {/* Checkbox para ocultar mesas finalizadas */}
        <label style={{ marginLeft: 20 }}>
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={e => setMostrarFinalizadas(e.target.checked)}
          />
          Mostrar mesas finalizadas
        </label>

        <ul>
          {mesasFiltradas.map((mesa) => {
            const comanda = comandasDoDia[mesa.id];
            const status = comanda?.status || "Aberta";
            return (
              <li key={mesa.id} style={{ marginTop: 5 }}>
                <button
                  style={{
                    fontWeight: mesaSelecionada === mesa.id ? "bold" : "normal",
                    color: status === "Finalizada" ? "green" : "black",
                  }}
                  onClick={() => setMesaSelecionada(mesa.id)}
                  title={`Status: ${status}`}
                >
                  {mesa.nome} {status === "Finalizada" && "✓"}
                </button>
                {/* Botões para editar, excluir mesa e excluir comanda */}
                <button
                  onClick={() => editarNomeMesa(mesa.id)}
                  style={{ marginLeft: 5 }}
                  title="Editar nome da mesa"
                >
                  ✏️
                </button>
                <button
                  onClick={() => excluirMesa(mesa.id)}
                  style={{ marginLeft: 5, color: "red" }}
                  title="Excluir mesa"
                >
                  🗑️
                </button>
                <button
                  onClick={() => excluirComanda(mesa.id)}
                  style={{ marginLeft: 5, color: "orange" }}
                  title="Excluir comanda da mesa"
                >
                  🧾❌
                </button>
                <button
                  onClick={() => toggleStatus(mesa.id)}
                  style={{ marginLeft: 5 }}
                  title={`Alternar status (Atual: ${status})`}
                >
                  {status === "Aberta" ? "Finalizar" : "Reabrir"}
                </button>
                <button
                  onClick={() => imprimirComanda(mesa.id)}
                  style={{ marginLeft: 5 }}
                  title="Imprimir comanda"
                >
                  🖨️
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Comanda da mesa selecionada */}
      {mesaSelecionada && (
        <div className="comanda-container" style={{ marginTop: 20 }}>
          <h2>Comanda da Mesa: {mesas.find(m => m.id === mesaSelecionada)?.nome || mesaSelecionada}</h2>
          <div>
            {(comandasDoDia[mesaSelecionada]?.itens || []).length === 0 && <p>Comanda vazia</p>}
            <ul>
              {(comandasDoDia[mesaSelecionada]?.itens || []).map((item, idx) => (
                <li key={idx} style={{ marginBottom: 5 }}>
                  {item.nome} - Qtd: {item.quantidade} - Preço: R$ {item.preco.toFixed(2)} - Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}
                  <button onClick={() => removerItem(mesaSelecionada, item.nome)} style={{ marginLeft: 10, color: "red" }}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <h3>Total: R$ {totalComanda(mesaSelecionada).toFixed(2)}</h3>
            <button onClick={() => limparComanda(mesaSelecionada)}>Limpar Comanda</button>
          </div>
        </div>
      )}

      {/* Cardápio por categoria */}
      <div className="cardapio-container" style={{ marginTop: 20 }}>
        <h2>Cardápio</h2>
        {categoriasOrdenadas.map((categoria) => (
          <div key={categoria} style={{ marginBottom: 15 }}>
            <h3>{categoria}</h3>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {produtosPorCategoria[categoria].map((produto) => (
                <li
                  key={produto.nome}
                  style={{
                    listStyle: "none",
                    border: "1px solid #ccc",
                    padding: "5px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                    minWidth: 120,
                    textAlign: "center",
                  }}
                  onClick={() => adicionarItem(produto)}
                  title={`Adicionar ${produto.nome} (R$ ${produto.preco.toFixed(2)})`}
                >
                  {produto.nome} <br />
                  <strong>R$ {produto.preco.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Total geral das vendas */}
      <div style={{ marginTop: 20 }}>
        <h2>Total Geral das Vendas (Finalizadas) no Dia {dataSelecionada}: R$ {totalGeral().toFixed(2)}</h2>
      </div>
    </div>
  );
}

export default App;
