import React, { useState, useEffect, useRef } from "react";

const produtosPorCategoria = {
  Refeição: [
    { nome: "Camaroada P", preco: 80 },
    { nome: "Camaroada G", preco: 140 },
    { nome: "Camarão ao Alho P", preco: 50 },
    { nome: "Camarão ao Alho G", preco: 100 },
  ],
  Bebidas: [
    { nome: "Refrigerante Lata", preco: 6 },
    { nome: "Cerveja Long Neck", preco: 8 },
    { nome: "Suco Natural", preco: 7 },
  ],
  Sobremesas: [
    { nome: "Pudim", preco: 10 },
    { nome: "Sorvete", preco: 12 },
  ],
};

const STATUS = {
  ABERTA: "Aberta",
  FINALIZADA: "Finalizada",
};

export default function App() {
  // Estado das mesas (array de objetos com id, nome, comandas)
  const [mesas, setMesas] = useState(() => {
    const saved = localStorage.getItem("mesas");
    return saved ? JSON.parse(saved) : [];
  });

  // Estado do nome da nova mesa para adicionar
  const [novaMesaNome, setNovaMesaNome] = useState("");

  // Estado do filtro de visualização: "todas", "abertas", "finalizadas"
  const [filtroStatus, setFiltroStatus] = useState("todas");

  // Estado para editar o nome da mesa
  const [editandoMesaId, setEditandoMesaId] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");

  // Guardar referência para impressão
  const imprimirRef = useRef();

  // Salvar mesas no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  // Função para adicionar mesa
  function adicionarMesa() {
    if (!novaMesaNome.trim()) return;
    const novaMesa = {
      id: Date.now(),
      nome: novaMesaNome.trim(),
      comandas: [],
    };
    setMesas((antigo) => [...antigo, novaMesa]);
    setNovaMesaNome("");
  }

  // Função para editar nome da mesa
  function iniciarEdicaoMesa(id, nomeAtual) {
    setEditandoMesaId(id);
    setNomeEditado(nomeAtual);
  }

  function salvarNomeMesa(id) {
    if (!nomeEditado.trim()) return;
    setMesas((antigo) =>
      antigo.map((mesa) =>
        mesa.id === id ? { ...mesa, nome: nomeEditado.trim() } : mesa
      )
    );
    setEditandoMesaId(null);
    setNomeEditado("");
  }

  // Função para remover mesa
  function removerMesa(id) {
    if (
      window.confirm(
        "Tem certeza que deseja remover esta mesa e todas as suas comandas?"
      )
    ) {
      setMesas((antigo) => antigo.filter((mesa) => mesa.id !== id));
    }
  }

  // Adicionar comanda a uma mesa
  function adicionarComanda(mesaId) {
    const novaComanda = {
      id: Date.now(),
      itens: [],
      status: STATUS.ABERTA,
      dataCriacao: new Date().toISOString(),
    };
    setMesas((antigo) =>
      antigo.map((mesa) =>
        mesa.id === mesaId
          ? { ...mesa, comandas: [...mesa.comandas, novaComanda] }
          : mesa
      )
    );
  }

  // Adicionar item a comanda
  function adicionarItem(mesaId, comandaId, item) {
    setMesas((antigo) =>
      antigo.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.map((comanda) => {
            if (comanda.id !== comandaId) return comanda;

            // Verificar se item já existe na comanda para incrementar quantidade
            const itemExistenteIndex = comanda.itens.findIndex(
              (i) => i.nome === item.nome
            );

            let novosItens;
            if (itemExistenteIndex >= 0) {
              novosItens = [...comanda.itens];
              novosItens[itemExistenteIndex].quantidade += 1;
            } else {
              novosItens = [...comanda.itens, { ...item, quantidade: 1 }];
            }

            return {
              ...comanda,
              itens: novosItens,
            };
          }),
        };
      })
    );
  }

  // Remover item da comanda
  function removerItem(mesaId, comandaId, nomeItem) {
    setMesas((antigo) =>
      antigo.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.map((comanda) => {
            if (comanda.id !== comandaId) return comanda;

            const novosItens = comanda.itens
              .map((item) => {
                if (item.nome === nomeItem) {
                  if (item.quantidade > 1) {
                    return { ...item, quantidade: item.quantidade - 1 };
                  } else {
                    return null; // remover item
                  }
                }
                return item;
              })
              .filter(Boolean);

            return {
              ...comanda,
              itens: novosItens,
            };
          }),
        };
      })
    );
  }

  // Finalizar comanda
  function finalizarComanda(mesaId, comandaId) {
    setMesas((antigo) =>
      antigo.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.map((comanda) =>
            comanda.id === comandaId
              ? { ...comanda, status: STATUS.FINALIZADA }
              : comanda
          ),
        };
      })
    );
  }

  // Limpar comanda (remover todos itens)
  function limparComanda(mesaId, comandaId) {
    if (!window.confirm("Deseja realmente limpar todos os itens dessa comanda?"))
      return;
    setMesas((antigo) =>
      antigo.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.map((comanda) =>
            comanda.id === comandaId ? { ...comanda, itens: [] } : comanda
          ),
        };
      })
    );
  }

  // Excluir comanda
  function excluirComanda(mesaId, comandaId) {
    if (!window.confirm("Deseja realmente excluir esta comanda?")) return;
    setMesas((antigo) =>
      antigo.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.filter((comanda) => comanda.id !== comandaId),
        };
      })
    );
  }

  // Limpar histórico de todas comandas
  function limparTodasComandas() {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir todas as comandas de todas as mesas?"
      )
    )
      return;
    setMesas((antigo) =>
      antigo.map((mesa) => ({
        ...mesa,
        comandas: [],
      }))
    );
  }

  // Calcular total de uma comanda
  function calcularTotalComanda(comanda) {
    return comanda.itens.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
  }

  // Calcular total geral (todas as comandas finalizadas)
  function calcularTotalGeral() {
    let total = 0;
    mesas.forEach((mesa) => {
      mesa.comandas.forEach((comanda) => {
        if (comanda.status === STATUS.FINALIZADA) {
          total += calcularTotalComanda(comanda);
        }
      });
    });
    return total;
  }

  // Impressão individual da comanda (formata para impressão térmica)
  function imprimirComanda(mesa, comanda) {
    const janela = window.open("", "_blank");
    if (!janela) {
      alert("Bloqueador de pop-up ativado! Permita para imprimir.");
      return;
    }
    janela.document.write(`
      <html>
        <head>
          <title>Comanda - ${mesa.nome}</title>
          <style>
            body {
              font-family: monospace;
              font-size: 12px;
              width: 280px;
              margin: 0;
              padding: 10px;
            }
            h2, h3 {
              text-align: center;
              margin: 0 0 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 2px 0;
            }
            .quantidade {
              width: 20px;
              text-align: center;
            }
            .preco {
              width: 60px;
              text-align: right;
            }
            .total {
              font-weight: bold;
              text-align: right;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <h2>Mesa: ${mesa.nome}</h2>
          <h3>Comanda ID: ${comanda.id}</h3>
          <table>
            ${comanda.itens
              .map(
                (item) => `
              <tr>
                <td>${item.nome}</td>
                <td class="quantidade">${item.quantidade}</td>
                <td class="preco">R$ ${(
                  item.preco * item.quantidade
                ).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </table>
          <div class="total">
            Total: R$ ${calcularTotalComanda(comanda).toFixed(2)}
          </div>
          <div style="margin-top:20px; text-align:center;">
            <small>Obrigado pela preferência!</small>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `);
    janela.document.close();
  }

  // Impressão geral das comandas finalizadas do dia
  function imprimirComandasDoDia() {
    const comandasFinalizadas = [];
    mesas.forEach((mesa) => {
      mesa.comandas.forEach((comanda) => {
        if (comanda.status === STATUS.FINALIZADA) {
          comandasFinalizadas.push({ mesa, comanda });
        }
      });
    });

    if (comandasFinalizadas.length === 0) {
      alert("Não há comandas finalizadas para imprimir.");
      return;
    }

    const janela = window.open("", "_blank");
    if (!janela) {
      alert("Bloqueador de pop-up ativado! Permita para imprimir.");
      return;
    }

    let html = `
      <html>
        <head>
          <title>Comandas do Dia</title>
          <style>
            body {
              font-family: monospace;
              font-size: 12px;
              width: 280px;
              margin: 0 auto;
              padding: 10px;
            }
            h2 {
              text-align: center;
              margin-bottom: 10px;
            }
            .comanda {
              margin-bottom: 20px;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 2px 0;
            }
            .quantidade {
              width: 20px;
              text-align: center;
            }
            .preco {
              width: 60px;
              text-align: right;
            }
            .total {
              font-weight: bold;
              text-align: right;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <h2>Comandas Finalizadas do Dia</h2>
    `;

    comandasFinalizadas.forEach(({ mesa, comanda }) => {
      html += `
        <div class="comanda">
          <div><strong>Mesa:</strong> ${mesa.nome}</div>
          <div><strong>Comanda ID:</strong> ${comanda.id}</div>
          <table>
            ${comanda.itens
              .map(
                (item) => `
              <tr>
                <td>${item.nome}</td>
                <td class="quantidade">${item.quantidade}</td>
                <td class="preco">R$ ${(item.preco * item.quantidade).toFixed(
                  2
                )}</td>
              </tr>
            `
              )
              .join("")}
          </table>
          <div class="total">
            Total: R$ ${calcularTotalComanda(comanda).toFixed(2)}
          </div>
        </div>
      `;
    });

    html += `
        <div style="text-align:right; font-weight:bold; margin-top: 15px;">
          Total Geral: R$ ${calcularTotalGeral().toFixed(2)}
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); }
          }
        </script>
      </body>
    </html>
    `;

    janela.document.write(html);
    janela.document.close();
  }

  // Filtrar comandas por status
  function filtrarComandas(comandas) {
    if (filtroStatus === "abertas") {
      return comandas.filter((c) => c.status === STATUS.ABERTA);
    }
    if (filtroStatus === "finalizadas") {
      return comandas.filter((c) => c.status === STATUS.FINALIZADA);
    }
    return comandas;
  }

  // JSX Render
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          background: #f7f9fc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          color: #333;
        }
        h1 {
          margin: 0;
          padding: 1rem;
          text-align: center;
          background: #007bff;
          color: white;
          font-weight: 700;
          font-size: 1.8rem;
          user-select: none;
        }
        .container {
          max-width: 1200px;
          margin: 1rem auto 3rem;
          padding: 0 1rem;
        }
        .nova-mesa {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .nova-mesa input {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: 2px solid #007bff;
          border-radius: 4px;
          flex: 1 1 300px;
          max-width: 400px;
          transition: border-color 0.3s;
        }
        .nova-mesa input:focus {
          outline: none;
          border-color: #0056b3;
        }
        .nova-mesa button {
          background: #007bff;
          border: none;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          white-space: nowrap;
        }
        .nova-mesa button:hover {
          background: #0056b3;
        }

        .filtro-status {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .filtro-status button {
          background: none;
          border: 2px solid #007bff;
          color: #007bff;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          min-width: 100px;
          user-select: none;
        }
        .filtro-status button.active,
        .filtro-status button:hover {
          background: #007bff;
          color: white;
          border-color: #0056b3;
        }

        .mesas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(320px,1fr));
          gap: 1.2rem;
        }

        .mesa-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 3px 8px rgb(0 0 0 / 0.1);
          display: flex;
          flex-direction: column;
          padding: 1rem;
          max-height: 100%;
        }
        .mesa-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
        }
        .mesa-nome {
          font-weight: 700;
          font-size: 1.25rem;
          user-select: none;
          flex-grow: 1;
        }
        .mesa-nome input {
          font-size: 1.1rem;
          padding: 0.25rem 0.5rem;
          border: 1.5px solid #007bff;
          border-radius: 6px;
          width: 100%;
          max-width: 200px;
        }
        .mesa-acoes button {
          background: none;
          border: none;
          cursor: pointer;
          color: #007bff;
          margin-left: 0.4rem;
          font-size: 1.2rem;
          padding: 0.2rem 0.4rem;
          transition: color 0.2s;
          user-select: none;
        }
        .mesa-acoes button:hover {
          color: #0056b3;
        }

        .btn-acao {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.3rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          user-select: none;
          transition: background-color 0.3s;
        }
        .btn-acao:hover {
          background: #0056b3;
        }
        .btn-acao:disabled {
          background: #b0c4de;
          cursor: not-allowed;
        }

        .comanda-lista {
          flex-grow: 1;
          overflow-y: auto;
          max-height: 350px;
          padding-right: 4px;
        }
        .comanda-card {
          background: #f4f8ff;
          border-radius: 8px;
          margin-bottom: 10px;
          padding: 0.6rem 1rem;
          box-shadow: inset 0 0 5px rgb(0 123 255 / 0.1);
          user-select: none;
        }
        .comanda-cabecalho {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          color: #0056b3;
        }
        .itens-lista {
          margin: 0;
          padding: 0;
          list-style: none;
          max-height: 150px;
          overflow-y: auto;
          border-top: 1px solid #cce0ff;
          border-bottom: 1px solid #cce0ff;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          font-size: 0.9rem;
        }
        .item-nome {
          flex: 1 1 auto;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 0.5rem;
        }
        .item-quantidade {
          width: 30px;
          text-align: center;
          user-select: none;
          color: #007bff;
          font-weight: 600;
        }
        .item-preco {
          width: 70px;
          text-align: right;
          color: #333;
          font-weight: 600;
          user-select: none;
        }
        .item-remover {
          width: 25px;
          text-align: center;
          cursor: pointer;
          color: #ff4d4f;
          user-select: none;
          transition: color 0.3s;
        }
        .item-remover:hover {
          color: #d40000;
        }

        .total-comanda {
          text-align: right;
          font-weight: 700;
          margin-top: 6px;
          font-size: 1rem;
          color: #0056b3;
          user-select: none;
        }

        .botoes-comanda {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          gap: 6px;
          flex-wrap: wrap;
        }

        .categorias {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          justify-content: center;
          user-select: none;
        }

        .categoria-botao {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 6px 14px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s;
          font-size: 0.9rem;
          user-select: none;
        }
        .categoria-botao:hover {
          background: #0056b3;
        }

        .itens-categoria {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
          justify-content: center;
          max-height: 80px;
          overflow-y: auto;
          user-select: none;
        }

        .item-botao {
          background: #17a2b8;
          color: white;
          border: none;
          border-radius: 16px;
          padding: 6px 12px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s;
          font-size: 0.85rem;
          white-space: nowrap;
          user-select: none;
        }
        .item-botao:hover {
          background: #0f6674;
        }

        .total-geral {
          margin-top: 1rem;
          text-align: right;
          font-size: 1.3rem;
          font-weight: 700;
          color: #007bff;
          user-select: none;
        }

        .btn-limpar-tudo {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          margin: 1rem auto 3rem;
          display: block;
          user-select: none;
          transition: background-color 0.3s;
        }
        .btn-limpar-tudo:hover {
          background: #b02a37;
        }

        /* Scrollbar para listas */
        .comanda-lista::-webkit-scrollbar,
        .itens-categoria::-webkit-scrollbar,
        .itens-lista::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .comanda-lista::-webkit-scrollbar-thumb,
        .itens-categoria::-webkit-scrollbar-thumb,
        .itens-lista::-webkit-scrollbar-thumb {
          background: rgba(0, 123, 255, 0.3);
          border-radius: 3px;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .mesa-card {
            max-height: none;
          }
          .comanda-lista {
            max-height: 200px;
          }
          .itens-categoria {
            max-height: 120px;
          }
        }
        @media print {
          body {
            width: 280px !important;
            margin: 0 !important;
            padding: 10px !important;
            font-family: monospace !important;
            font-size: 12px !important;
            color: black !important;
            background: white !important;
          }
          .container,
          .nova-mesa,
          .filtro-status,
          .mesas-grid,
          .btn-limpar-tudo {
            display: none !important;
          }
          .mesa-card, .comanda-card {
            box-shadow: none !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <h1>Sistema de Comandas - Restaurante</h1>
      <div className="container">
        {/* Nova mesa */}
        <section className="nova-mesa" aria-label="Adicionar nova mesa">
          <input
            type="text"
            placeholder="Nome da nova mesa"
            value={novaMesaNome}
            onChange={(e) => setNovaMesaNome(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") adicionarMesa();
            }}
            aria-label="Nome da nova mesa"
          />
          <button onClick={adicionarMesa} aria-label="Adicionar mesa">
            + Adicionar Mesa
          </button>
        </section>

        {/* Filtro de comandas */}
        <section className="filtro-status" aria-label="Filtro de comandas">
          <button
            className={filtroStatus === "todas" ? "active" : ""}
            onClick={() => setFiltroStatus("todas")}
            aria-pressed={filtroStatus === "todas"}
          >
            Todas
          </button>
          <button
            className={filtroStatus === "abertas" ? "active" : ""}
            onClick={() => setFiltroStatus("abertas")}
            aria-pressed={filtroStatus === "abertas"}
          >
            Abertas
          </button>
          <button
            className={filtroStatus === "finalizadas" ? "active" : ""}
            onClick={() => setFiltroStatus("finalizadas")}
            aria-pressed={filtroStatus === "finalizadas"}
          >
            Finalizadas
          </button>
        </section>

        {/* Mesas */}
        <section className="mesas-grid" aria-label="Mesas e comandas">
          {mesas.length === 0 && (
            <p style={{ textAlign: "center", color: "#555" }}>
              Nenhuma mesa cadastrada.
            </p>
          )}

          {mesas.map((mesa) => (
            <article key={mesa.id} className="mesa-card" aria-label={`Mesa ${mesa.nome}`}>
              <header className="mesa-header">
                {editandoMesaId === mesa.id ? (
                  <>
                    <input
                      type="text"
                      value={nomeEditado}
                      onChange={(e) => setNomeEditado(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") salvarNomeMesa(mesa.id);
                        if (e.key === "Escape") setEditandoMesaId(null);
                      }}
                      aria-label={`Editar nome da mesa ${mesa.nome}`}
                      autoFocus
                    />
                    <div className="mesa-acoes">
                      <button
                        onClick={() => salvarNomeMesa(mesa.id)}
                        aria-label="Salvar nome da mesa"
                        title="Salvar"
                      >
                        ✔️
                      </button>
                      <button
                        onClick={() => setEditandoMesaId(null)}
                        aria-label="Cancelar edição"
                        title="Cancelar"
                      >
                        ❌
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="mesa-nome"
                      tabIndex={0}
                      role="button"
                      onClick={() => iniciarEdicaoMesa(mesa.id, mesa.nome)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") iniciarEdicaoMesa(mesa.id, mesa.nome);
                      }}
                      aria-label={`Mesa ${mesa.nome}, clique para editar nome`}
                      title="Clique para editar nome"
                    >
                      {mesa.nome}
                    </div>
                    <div className="mesa-acoes">
                      <button
                        onClick={() => adicionarComanda(mesa.id)}
                        aria-label={`Adicionar nova comanda à mesa ${mesa.nome}`}
                        title="Adicionar comanda"
                      >
                        ➕
                      </button>
                      <button
                        onClick={() => removerMesa(mesa.id)}
                        aria-label={`Remover mesa ${mesa.nome}`}
                        title="Remover mesa"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </header>

              {/* Comandas da mesa */}
              <div className="comanda-lista" tabIndex={0} aria-label={`Lista de comandas da mesa ${mesa.nome}`}>
                {filtrarComandas(mesa.comandas).length === 0 && (
                  <p style={{ fontSize: "0.9rem", color: "#777", textAlign: "center" }}>
                    Nenhuma comanda {filtroStatus === "todas"
                      ? "cadastrada"
                      : filtroStatus === "abertas"
                      ? "aberta"
                      : "finalizada"}.
                  </p>
                )}
                {filtrarComandas(mesa.comandas).map((comanda) => (
                  <div
                    key={comanda.id}
                    className="comanda-card"
                    aria-label={`Comanda ${comanda.id} - Status: ${comanda.status}`}
                  >
                    <div className="comanda-cabecalho">
                      <span>ID: {comanda.id}</span>
                      <span>Status: {comanda.status}</span>
                    </div>
                    <ul className="itens-lista" aria-label={`Itens da comanda ${comanda.id}`}>
                      {comanda.itens.length === 0 && (
                        <li style={{ fontStyle: "italic", color: "#999" }}>
                          Nenhum item adicionado.
                        </li>
                      )}
                      {comanda.itens.map((item) => (
                        <li key={item.nome} className="item">
                          <span className="item-nome" title={item.nome}>
                            {item.nome}
                          </span>
                          <span className="item-quantidade">{item.quantidade}</span>
                          <span className="item-preco">
                            R$ {(item.preco * item.quantidade).toFixed(2)}
                          </span>
                          {comanda.status === STATUS.ABERTA && (
                            <button
                              className="item-remover"
                              aria-label={`Remover um item ${item.nome}`}
                              title="Remover item"
                              onClick={() =>
                                removerItem(mesa.id, comanda.id, item.nome)
                              }
                            >
                              ✖
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="total-comanda" aria-live="polite" aria-atomic="true">
                      Total: R$ {calcularTotalComanda(comanda).toFixed(2)}
                    </div>
                    {/* Botões da comanda */}
                    <div className="botoes-comanda">
                      {comanda.status === STATUS.ABERTA && (
                        <>
                          <button
                            className="btn-acao"
                            onClick={() => finalizarComanda(mesa.id, comanda.id)}
                            aria-label="Finalizar comanda"
                          >
                            Finalizar
                          </button>
                          <button
                            className="btn-acao"
                            onClick={() => limparComanda(mesa.id, comanda.id)}
                            aria-label="Limpar comanda"
                          >
                            Limpar
                          </button>
                        </>
                      )}
                      <button
                        className="btn-acao"
                        onClick={() => excluirComanda(mesa.id, comanda.id)}
                        aria-label="Excluir comanda"
                        style={{ backgroundColor: "#dc3545" }}
                      >
                        Excluir
                      </button>
                      <button
                        className="btn-acao"
                        onClick={() => imprimirComanda(mesa, comanda)}
                        aria-label="Imprimir comanda"
                        style={{ backgroundColor: "#28a745" }}
                      >
                        Imprimir
                      </button>
                    </div>

                    {/* Seleção de itens para adicionar */}
                    {comanda.status === STATUS.ABERTA && (
                      <div className="categorias" aria-label="Categorias de produtos">
                        {Object.entries(produtosPorCategoria).map(
                          ([categoria, itens]) => (
                            <CategoriaItens
                              key={categoria}
                              categoria={categoria}
                              itens={itens}
                              onAdicionar={(item) =>
                                adicionarItem(mesa.id, comanda.id, item)
                              }
                            />
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Total geral e limpar tudo */}
        <div className="total-geral" aria-live="polite" aria-atomic="true">
          Total Geral das Comandas Finalizadas: R$ {calcularTotalGeral().toFixed(2)}
        </div>
        <button
          className="btn-limpar-tudo"
          onClick={limparTodasComandas}
          aria-label="Limpar todas as comandas"
          title="Limpar todas as comandas"
        >
          Limpar Todas as Comandas
        </button>

        {/* Botão imprimir todas comandas finalizadas do dia */}
        <button
          className="btn-acao"
          onClick={imprimirComandasDoDia}
          aria-label="Imprimir todas as comandas finalizadas do dia"
          style={{ display: "block", margin: "1rem auto" }}
        >
          Imprimir Comandas Finalizadas do Dia
        </button>
      </div>
    </>
  );
}

// Componente para mostrar categoria e seus itens
function CategoriaItens({ categoria, itens, onAdicionar }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div
      className="categoria-container"
      style={{ minWidth: 120 }}
      aria-label={`Categoria ${categoria}`}
    >
      <button
        className="categoria-botao"
        onClick={() => setVisivel((v) => !v)}
        aria-expanded={visivel}
        aria-controls={`itens-${categoria}`}
      >
        {categoria}
      </button>
      {visivel && (
        <div
          id={`itens-${categoria}`}
          className="itens-categoria"
          role="list"
          aria-label={`Itens da categoria ${categoria}`}
        >
          {itens.map((item) => (
            <button
              key={item.nome}
              className="item-botao"
              onClick={() => onAdicionar(item)}
              role="listitem"
              aria-label={`Adicionar item ${item.nome} por R$ ${item.preco.toFixed(
                2
              )}`}
              title={`Adicionar ${item.nome} - R$ ${item.preco.toFixed(2)}`}
            >
              {item.nome} - R$ {item.preco.toFixed(2)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
