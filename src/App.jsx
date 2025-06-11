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

  // Excluir comanda (remove a chave da comanda para a mesa)
  const excluirComanda = (mesaId) => {
    if (!window.confirm("Tem certeza que deseja excluir essa comanda?")) return;

    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandasDoDia
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Limpar histórico do dia (todas as comandas do dia)
  const limparHistorico = () => {
    if (!window.confirm(`Deseja limpar todo o histórico de comandas do dia ${dataSelecionada}?`)) return;

    setComandas(prev => {
      const novo = { ...prev };
      delete novo[dataSelecionada];
      return novo;
    });

    setMesaSelecionada(null);
  };

  // Total geral do dia
  const totalGeral = Object.values(comandasDoDia).reduce((acc, c) => {
    if (!c || Array.isArray(c) || !c.itens) return acc;
    const totalComanda = c.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
    return acc + totalComanda;
  }, 0);

  // Função para impressão da comanda individual
  const imprimirComanda = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda || !comanda.itens || comanda.itens.length === 0) {
      alert("Essa comanda não tem itens para imprimir.");
      return;
    }

    const mesa = mesas.find(m => m.id === mesaId);
    const janela = window.open("", "PRINT", "width=600,height=600");

    janela.document.write(`<html><head><title>Comanda - ${mesa ? mesa.nome : "Mesa"}</title>`);
    janela.document.write(`<style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h2 { text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid #333; padding: 8px; text-align: left; }
      th { background-color: #eee; }
      tfoot td { font-weight: bold; }
    </style>`);
    janela.document.write(`</head><body>`);
    janela.document.write(`<h2>Comanda - ${mesa ? mesa.nome : "Mesa"}</h2>`);
    janela.document.write(`<p><strong>Status:</strong> ${comanda.status}</p>`);
    janela.document.write(`<table>
      <thead>
        <tr><th>Produto</th><th>Qtd</th><th>Preço Unit.</th><th>Total</th></tr>
      </thead>
      <tbody>`);
    let total = 0;
    comanda.itens.forEach(i => {
      const subtotal = i.preco * i.quantidade;
      total += subtotal;
      janela.document.write(`<tr>
        <td>${i.nome}</td>
        <td>${i.quantidade}</td>
        <td>R$ ${i.preco.toFixed(2)}</td>
        <td>R$ ${subtotal.toFixed(2)}</td>
      </tr>`);
    });
    janela.document.write(`</tbody><tfoot><tr><td colspan="3">Total</td><td>R$ ${total.toFixed(2)}</td></tr></tfoot></table>`);
    janela.document.write(`<p>Data: ${dataSelecionada}</p>`);
    janela.document.write(`</body></html>`);

    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  };

  // Renderiza itens da comanda para a mesa selecionada
  const renderItensComanda = () => {
    if (!mesaSelecionada) return <p>Selecione uma mesa para ver a comanda.</p>;

    const com = comandasDoDia[mesaSelecionada];
    if (!com || !com.itens || com.itens.length === 0) {
      return <p>Comanda vazia.</p>;
    }

    return (
      <table className="comanda-itens-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Preço Unit.</th>
            <th>Subtotal</th>
            <th>Remover</th>
          </tr>
        </thead>
        <tbody>
          {com.itens.map((item) => (
            <tr key={item.nome}>
              <td>{item.nome}</td>
              <td>{item.quantidade}</td>
              <td>R$ {item.preco.toFixed(2)}</td>
              <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
              <td>
                <button className="btn-small btn-danger" onClick={() => removerItem(mesaSelecionada, item.nome)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}><b>Total:</b></td>
            <td colSpan={2}>
              R$ {com.itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    );
  };

  // Renderiza as comandas agrupadas por status
  const renderComandasAgrupadas = () => {
    const abertas = [];
    const finalizadas = [];

    mesas.forEach(mesa => {
      const c = comandasDoDia[mesa.id];
      if (c && !Array.isArray(c) && c.itens && c.itens.length > 0) {
        if (c.status === "Aberta") abertas.push({ mesa, comanda: c });
        else finalizadas.push({ mesa, comanda: c });
      }
    });

    const renderGrupo = (grupo, titulo) => (
      <section className="grupo-comandas">
        <h3>{titulo} ({grupo.length})</h3>
        {grupo.length === 0 && <p>Nenhuma comanda {titulo.toLowerCase()}.</p>}
        {grupo.map(({ mesa, comanda }) => (
          <div
            key={mesa.id}
            className={`comanda-resumo ${mesaSelecionada === mesa.id ? "selecionada" : ""}`}
            onClick={() => setMesaSelecionada(mesa.id)}
          >
            <div>
              <strong>{mesa.nome}</strong> - <em>{comanda.status}</em>
            </div>
            <div>
              Itens: {comanda.itens.reduce((acc, i) => acc + i.quantidade, 0)} | Total: R$ {comanda.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0).toFixed(2)}
            </div>
            <div className="botoes-comanda-resumo">
              <button className="btn-small btn-warning" onClick={e => { e.stopPropagation(); toggleStatus(mesa.id); }}>
                {comanda.status === "Aberta" ? "Finalizar" : "Reabrir"}
              </button>
              <button className="btn-small btn-danger" onClick={e => { e.stopPropagation(); excluirComanda(mesa.id); }}>
                Excluir
              </button>
              <button className="btn-small btn-info" onClick={e => { e.stopPropagation(); imprimirComanda(mesa.id); }}>
                Imprimir
              </button>
            </div>
          </div>
        ))}
      </section>
    );

    return (
      <>
        {renderGrupo(abertas, "Comandas Abertas")}
        {renderGrupo(finalizadas, "Comandas Finalizadas")}
      </>
    );
  };

  return (
    <div className="app-container">
      <header>
        <h1>Sistema de Comandas - Restaurante</h1>
        <div className="data-selecao">
          <label>Data: </label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={e => {
              setDataSelecionada(e.target.value);
              setMesaSelecionada(null);
            }}
            max={new Date().toISOString().slice(0, 10)}
          />
          <button className="btn-danger" onClick={limparHistorico}>Limpar Histórico do Dia</button>
        </div>
      </header>

      <main>
        <aside className="mesas-lista">
          <div className="header-mesas">
            <h2>Mesas</h2>
            <button className="btn" onClick={adicionarMesa}>+ Mesa</button>
          </div>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          <ul>
            {mesas.map((mesa) => (
              <li
                key={mesa.id}
                className={mesaSelecionada === mesa.id ? "selecionada" : ""}
                onClick={() => setMesaSelecionada(mesa.id)}
              >
                <span>{mesa.nome}</span>
                <button className="btn-small btn-warning" onClick={e => { e.stopPropagation(); editarNomeMesa(mesa.id); }}>Editar</button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="comandas-container">
          {renderComandasAgrupadas()}
        </section>

        <section className="detalhes-comanda">
          <h2>Comanda Detalhes</h2>
          {renderItensComanda()}

          {mesaSelecionada && (
            <div className="acoes-comanda">
              <button className="btn" onClick={() => toggleStatus(mesaSelecionada)}>
                {comandasDoDia[mesaSelecionada]?.status === "Finalizada" ? "Reabrir Comanda" : "Finalizar Comanda"}
              </button>
              <button className="btn btn-danger" onClick={() => limparComanda(mesaSelecionada)}>Limpar Itens</button>
              <button className="btn btn-info" onClick={() => imprimirComanda(mesaSelecionada)}>Imprimir Comanda</button>
            </div>
          )}
        </section>

        <section className="cardapio">
          <h2>Cardápio</h2>
          {categoriasOrdenadas.map(categoria => (
            <div key={categoria} className="categoria-cardapio">
              <h3>{categoria}</h3>
              <div className="itens-categoria">
                {produtosPorCategoria[categoria].map(item => (
                  <button
                    key={item.nome}
                    className="btn-item"
                    onClick={() => adicionarItem(item)}
                    title={`R$ ${item.preco.toFixed(2)}`}
                  >
                    {item.nome} <br /> <small>R$ {item.preco.toFixed(2)}</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer>
        <h3>Total Geral do Dia: R$ {totalGeral.toFixed(2)}</h3>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f7fa;
          color: #333;
        }
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 15px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 15px;
        }
        header h1 {
          margin: 0;
          font-weight: 700;
          color: #2c3e50;
        }
        .data-selecao {
          margin-top: 10px;
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        main {
          display: flex;
          flex: 1;
          gap: 15px;
        }
        aside.mesas-lista {
          width: 150px;
          background: white;
          padding: 10px;
          border-radius: 6px;
          box-shadow: 0 0 10px #ddd;
          display: flex;
          flex-direction: column;
          max-height: 70vh;
          overflow-y: auto;
        }
        .header-mesas {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        li {
          padding: 6px 8px;
          margin-bottom: 5px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ecf0f1;
          font-weight: 600;
          color: #34495e;
          user-select: none;
          transition: background-color 0.2s;
        }
        li:hover {
          background: #bdc3c7;
        }
        li.selecionada {
          background: #3498db;
          color: white;
          font-weight: 700;
        }
        .btn-small {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          user-select: none;
        }
        .btn-small.btn-warning {
          background: #f39c12;
          color: white;
          margin-left: 6px;
        }
        .btn-small.btn-danger {
          background: #e74c3c;
          color: white;
          margin-left: 6px;
        }
        .btn-small.btn-info {
          background: #2980b9;
          color: white;
          margin-left: 6px;
        }
        .btn {
          cursor: pointer;
          border: none;
          background-color: #3498db;
          color: white;
          padding: 8px 12px;
          border-radius: 5px;
          font-weight: 700;
          transition: background-color 0.2s;
          user-select: none;
        }
        .btn:hover {
          background-color: #2980b9;
        }
        .btn-danger {
          background-color: #e74c3c;
        }
        .btn-danger:hover {
          background-color: #c0392b;
        }
        .btn-info {
          background-color: #2980b9;
        }
        .btn-info:hover {
          background-color: #1c5980;
        }
        main section {
          background: white;
          border-radius: 6px;
          box-shadow: 0 0 10px #ddd;
          padding: 10px;
          overflow-y: auto;
          max-height: 70vh;
        }
        .comandas-container {
          flex: 1;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .comanda-resumo {
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          background: #fafafa;
          transition: background-color 0.3s;
          user-select: none;
        }
        .comanda-resumo:hover {
          background: #e1e8f0;
        }
        .comanda-resumo.selecionada {
          background: #3498db;
          color: white;
          font-weight: 700;
        }
        .botoes-comanda-resumo {
          margin-top: 8px;
          display: flex;
          gap: 5px;
        }
        .detalhes-comanda {
          width: 400px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .acoes-comanda {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .comanda-itens-table {
          width: 100%;
          border-collapse: collapse;
        }
        .comanda-itens-table th,
        .comanda-itens-table td {
          border: 1px solid #ccc;
          padding: 6px 8px;
          text-align: left;
        }
        .comanda-itens-table tfoot td {
          font-weight: 700;
        }
        .cardapio {
          flex: 1;
          max-width: 450px;
          overflow-y: auto;
        }
        .categoria-cardapio {
          margin-bottom: 15px;
        }
        .categoria-cardapio h3 {
          margin-bottom: 8px;
          border-bottom: 2px solid #3498db;
          padding-bottom: 2px;
          color: #2980b9;
        }
        .itens-categoria {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .btn-item {
          flex: 1 1 120px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
          white-space: normal;
          user-select: none;
          text-align: center;
          line-height: 1.2;
        }
        .btn-item:hover {
          background: #2980b9;
        }
        footer {
          margin-top: 15px;
          text-align: center;
          font-size: 1.2em;
          font-weight: 700;
          color: #2c3e50;
        }

        /* Responsividade básica */
        @media (max-width: 1100px) {
          main {
            flex-direction: column;
          }
          aside.mesas-lista,
          .comandas-container,
          .detalhes-comanda,
          .cardapio {
            max-width: 100%;
            width: 100%;
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
