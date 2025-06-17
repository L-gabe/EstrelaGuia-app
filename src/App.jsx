import React, { useState, useEffect, useRef } from "react";

const produtosPorCategoria = {
  "Refeição": [
    { nome: "Camaroada P", preco: 80 },
    { nome: "Camaroada G", preco: 140 },
    { nome: "Camarão ao Alho P", preco: 50 },
    { nome: "Camarão ao Alho G", preco: 100 },
  ],
  Bebidas: [
    { nome: "Cerveja Lata", preco: 8 },
    { nome: "Refrigerante Lata", preco: 6 },
    { nome: "Água Mineral", preco: 5 },
  ],
  Sobremesas: [
    { nome: "Pudim", preco: 12 },
    { nome: "Sorvete", preco: 10 },
  ],
};

function App() {
  const [mesas, setMesas] = useState(() => {
    const salvas = localStorage.getItem("mesasComandas");
    return salvas ? JSON.parse(salvas) : [];
  });
  const [mesaSelecionadaId, setMesaSelecionadaId] = useState(null);
  const [novaMesaNome, setNovaMesaNome] = useState("");
  const [editandoMesaId, setEditandoMesaId] = useState(null);
  const [mesaNomeEditando, setMesaNomeEditando] = useState("");
  const printRef = useRef();

  // Salvar mesas no localStorage
  useEffect(() => {
    localStorage.setItem("mesasComandas", JSON.stringify(mesas));
  }, [mesas]);

  // Adicionar nova mesa
  const adicionarMesa = () => {
    if (!novaMesaNome.trim()) return;
    const novaMesa = {
      id: Date.now(),
      nome: novaMesaNome.trim(),
      comandas: [],
    };
    setMesas((prev) => [...prev, novaMesa]);
    setNovaMesaNome("");
  };

  // Selecionar mesa para editar comandas
  const selecionarMesa = (id) => {
    setMesaSelecionadaId(id);
  };

  // Adicionar item à comanda da mesa selecionada
  const adicionarItem = (produto) => {
    if (!mesaSelecionadaId) return;
    setMesas((prev) =>
      prev.map((mesa) => {
        if (mesa.id !== mesaSelecionadaId) return mesa;
        let comandas = mesa.comandas;
        let comandaAberta = comandas.find((c) => c.status === "Aberta");
        if (!comandaAberta) {
          comandaAberta = {
            id: Date.now(),
            itens: [],
            status: "Aberta",
            data: new Date().toISOString(),
          };
          comandas = [...comandas, comandaAberta];
        }
        const itensAtualizados = [...comandaAberta.itens];
        const idx = itensAtualizados.findIndex((i) => i.nome === produto.nome);
        if (idx >= 0) {
          itensAtualizados[idx].quantidade += 1;
        } else {
          itensAtualizados.push({ ...produto, quantidade: 1 });
        }
        comandas = comandas.map((c) =>
          c.id === comandaAberta.id ? { ...c, itens: itensAtualizados } : c
        );
        return { ...mesa, comandas };
      })
    );
  };

  // Alterar quantidade de item na comanda
  const alterarQuantidade = (mesaId, comandaId, itemNome, delta) => {
    setMesas((prev) =>
      prev.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        const comandas = mesa.comandas.map((comanda) => {
          if (comanda.id !== comandaId) return comanda;
          let itens = comanda.itens
            .map((item) =>
              item.nome === itemNome
                ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
                : item
            )
            .filter((item) => item.quantidade > 0);
          return { ...comanda, itens };
        });
        return { ...mesa, comandas };
      })
    );
  };

  // Remover item da comanda
  const removerItem = (mesaId, comandaId, itemNome) => {
    setMesas((prev) =>
      prev.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        const comandas = mesa.comandas.map((comanda) => {
          if (comanda.id !== comandaId) return comanda;
          const itens = comanda.itens.filter((i) => i.nome !== itemNome);
          return { ...comanda, itens };
        });
        return { ...mesa, comandas };
      })
    );
  };

  // Finalizar comanda
  const finalizarComanda = (mesaId, comandaId) => {
    setMesas((prev) =>
      prev.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        const comandas = mesa.comandas.map((comanda) =>
          comanda.id === comandaId ? { ...comanda, status: "Finalizada" } : comanda
        );
        return { ...mesa, comandas };
      })
    );
  };

  // Excluir comanda
  const excluirComanda = (mesaId, comandaId) => {
    setMesas((prev) =>
      prev.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        const comandas = mesa.comandas.filter((c) => c.id !== comandaId);
        return { ...mesa, comandas };
      })
    );
  };

  // Editar nome da mesa
  const iniciarEdicaoMesa = (mesa) => {
    setEditandoMesaId(mesa.id);
    setMesaNomeEditando(mesa.nome);
  };
  const salvarNomeMesa = (mesaId) => {
    if (!mesaNomeEditando.trim()) return;
    setMesas((prev) =>
      prev.map((m) => (m.id === mesaId ? { ...m, nome: mesaNomeEditando.trim() } : m))
    );
    setEditandoMesaId(null);
    setMesaNomeEditando("");
  };

  // Limpar todas as comandas finalizadas do dia
  const limparComandasFinalizadas = () => {
    setMesas((prev) =>
      prev.map((mesa) => ({
        ...mesa,
        comandas: mesa.comandas.filter((c) => c.status !== "Finalizada"),
      }))
    );
  };

  // Imprimir comanda
  const imprimirComanda = (mesaNome, comanda) => {
    const janela = window.open("", "PRINT", "width=400,height=600");
    if (!janela) return;
    const itensHtml = comanda.itens
      .map(
        (item) =>
          `<tr>
            <td>${item.nome}</td>
            <td style="text-align:center;">${item.quantidade}</td>
            <td style="text-align:right;">R$ ${item.preco.toFixed(2)}</td>
            <td style="text-align:right;">R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
          </tr>`
      )
      .join("");
    const total = comanda.itens.reduce(
      (acc, i) => acc + i.preco * i.quantidade,
      0
    );
    janela.document.write(`
      <html>
        <head>
          <title>Comanda - ${mesaNome}</title>
          <style>
            body { font-family: monospace; font-size: 12px; padding: 10px; }
            h1 { text-align: center; font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border-bottom: 1px solid #000; padding: 4px; }
            th { text-align: left; }
            tfoot td { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Comanda - ${mesaNome}</h1>
          <p>Data: ${new Date(comanda.data).toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th><th>Qtd</th><th>Preço</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itensHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align:right;">Total:</td>
                <td style="text-align:right;">R$ ${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);
    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  };

  // Imprimir todas comandas finalizadas do dia
  const imprimirTodasFinalizadas = () => {
    const todas = [];
    mesas.forEach((mesa) => {
      mesa.comandas
        .filter((c) => c.status === "Finalizada")
        .forEach((comanda) => todas.push({ mesaNome: mesa.nome, comanda }));
    });
    if (todas.length === 0) {
      alert("Não há comandas finalizadas para imprimir.");
      return;
    }

    const janela = window.open("", "PRINT", "width=400,height=600");
    if (!janela) return;
    let htmlBody = "";
    todas.forEach(({ mesaNome, comanda }, idx) => {
      const itensHtml = comanda.itens
        .map(
          (item) =>
            `<tr>
              <td>${item.nome}</td>
              <td style="text-align:center;">${item.quantidade}</td>
              <td style="text-align:right;">R$ ${item.preco.toFixed(2)}</td>
              <td style="text-align:right;">R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
            </tr>`
        )
        .join("");
      const total = comanda.itens.reduce(
        (acc, i) => acc + i.preco * i.quantidade,
        0
      );
      htmlBody += `
        <div style="page-break-after: always; margin-bottom: 20px;">
          <h1 style="text-align:center;">Comanda - ${mesaNome}</h1>
          <p>Data: ${new Date(comanda.data).toLocaleString()}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border-bottom:1px solid #000; text-align:left;">Item</th>
                <th style="border-bottom:1px solid #000; text-align:center;">Qtd</th>
                <th style="border-bottom:1px solid #000; text-align:right;">Preço</th>
                <th style="border-bottom:1px solid #000; text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itensHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align:right; font-weight:bold;">Total:</td>
                <td style="text-align:right; font-weight:bold;">R$ ${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    });
    janela.document.write(`
      <html>
        <head>
          <title>Comandas Finalizadas</title>
          <style>
            body { font-family: monospace; font-size: 12px; padding: 10px; }
            h1 { font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th, td { border-bottom: 1px solid #000; padding: 4px; }
            th { text-align: left; }
            tfoot td { font-weight: bold; }
            @media print {
              div { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          ${htmlBody}
        </body>
      </html>
    `);
    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  };

  // Calcular total geral do dia (somente comandas finalizadas)
  const totalGeral = mesas.reduce((acc, mesa) => {
    const totalMesa = mesa.comandas
      .filter((c) => c.status === "Finalizada")
      .reduce((accC, c) => {
        return accC + c.itens.reduce((accI, i) => accI + i.preco * i.quantidade, 0);
      }, 0);
    return acc + totalMesa;
  }, 0);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body, html, #root {
          height: 100%;
          margin: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f7fa;
          color: #333;
        }
        header {
          background: #2f86eb;
          color: white;
          padding: 1rem 1.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
          user-select: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        main {
          display: flex;
          flex-wrap: wrap;
          padding: 1rem;
          gap: 1rem;
          justify-content: center;
        }
        section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          padding: 1rem;
          max-width: 380px;
          flex: 1 1 380px;
          display: flex;
          flex-direction: column;
          height: fit-content;
        }
        h2 {
          margin-top: 0;
          font-weight: 600;
          color: #2f86eb;
          margin-bottom: 1rem;
          border-bottom: 2px solid #2f86eb;
          padding-bottom: 0.3rem;
        }
        .nova-mesa {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        input[type="text"] {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        input[type="text"]:focus {
          outline: none;
          border-color: #2f86eb;
          box-shadow: 0 0 5px rgba(47,134,235,0.5);
        }
        button {
          background: #2f86eb;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
          user-select: none;
        }
        button:hover:not(:disabled) {
          background: #1c5dc9;
        }
        button:disabled {
          background: #999;
          cursor: not-allowed;
        }
        ul.mesas-lista {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: #fafafa;
        }
        ul.mesas-lista li {
          padding: 0.6rem 0.8rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        ul.mesas-lista li:last-child {
          border-bottom: none;
        }
        ul.mesas-lista li:hover {
          background: #e6f0ff;
        }
        ul.mesas-lista li.selecionada {
          background: #cde1ff;
          font-weight: 700;
          color: #1c5dc9;
        }
        ul.mesas-lista li .acoes {
          display: flex;
          gap: 0.5rem;
        }
        ul.mesas-lista li button {
          background: transparent;
          color: #2f86eb;
          padding: 0.2rem 0.5rem;
          font-size: 0.9rem;
          border-radius: 4px;
        }
        ul.mesas-lista li button:hover {
          background: #1c5dc9;
          color: white;
        }

        .card-comanda {
          background: #fefefe;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 1rem;
          padding: 0.8rem 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }
        .comanda-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2f86eb;
          font-size: 1.1rem;
        }
        .comanda-itens {
          border-top: 1px solid #ddd;
          padding-top: 0.5rem;
          max-height: 180px;
          overflow-y: auto;
        }
        .item-comanda {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
          font-size: 0.95rem;
        }
        .item-info {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-quantidade {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-left: 0.5rem;
        }
        .item-quantidade button {
          background: #2f86eb;
          border-radius: 4px;
          padding: 0 6px;
          font-weight: bold;
          font-size: 1rem;
          line-height: 1;
          color: white;
          user-select: none;
        }
        .item-quantidade button:hover {
          background: #1c5dc9;
        }
        .item-preco,
        .item-total {
          width: 65px;
          text-align: right;
          margin-left: 0.5rem;
          font-variant-numeric: tabular-nums;
          color: #555;
        }
        .item-remover {
          cursor: pointer;
          color: #c0392b;
          margin-left: 0.7rem;
          font-weight: 700;
          user-select: none;
        }
        .item-remover:hover {
          color: #e74c3c;
        }
        .comanda-footer {
          margin-top: 0.7rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          color: #2f86eb;
          font-size: 1.05rem;
        }
        .comanda-footer button {
          background: #2f86eb;
          padding: 0.3rem 0.7rem;
          font-size: 0.9rem;
          border-radius: 6px;
          transition: background-color 0.3s;
        }
        .comanda-footer button:hover {
          background: #1c5dc9;
        }

        .produtos-categorias {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 5px;
        }
        .categoria {
          border-bottom: 2px solid #2f86eb;
          padding-bottom: 0.3rem;
        }
        .categoria h3 {
          margin: 0 0 0.4rem 0;
          color: #2f86eb;
          font-weight: 600;
        }
        .lista-produtos {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .produto-btn {
          flex: 1 1 120px;
          background: #2f86eb;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.6rem 0.9rem;
          font-size: 0.9rem;
          cursor: pointer;
          user-select: none;
          text-align: center;
          transition: background-color 0.3s;
        }
        .produto-btn:hover {
          background: #1c5dc9;
        }

        footer {
          text-align: center;
          padding: 1rem;
          font-weight: 600;
          font-size: 1.1rem;
          color: #2f86eb;
          border-top: 1px solid #ddd;
          background: white;
          user-select: none;
        }

        @media (max-width: 1024px) {
          main {
            flex-direction: column;
            align-items: center;
          }
          section {
            max-width: 90vw;
          }
          .produtos-categorias {
            max-height: 300px;
          }
        }
        @media (max-width: 480px) {
          .item-preco,
          .item-total {
            width: 50px;
            font-size: 0.85rem;
          }
          .produto-btn {
            flex: 1 1 100%;
          }
          .item-quantidade button {
            padding: 0 4px;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <header>Controle de Comandas - Estilo Sischef</header>

      <main>
        {/* Seção de Mesas */}
        <section aria-label="Mesas cadastradas">
          <h2>Mesas</h2>
          <div className="nova-mesa">
            <input
              type="text"
              placeholder="Nome nova mesa"
              value={novaMesaNome}
              onChange={(e) => setNovaMesaNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && adicionarMesa()}
              aria-label="Nome da nova mesa"
            />
            <button onClick={adicionarMesa} aria-label="Adicionar nova mesa" title="Adicionar mesa">
              +
            </button>
          </div>

          <ul className="mesas-lista" role="list" aria-live="polite">
            {mesas.map((mesa) => (
              <li
                key={mesa.id}
                onClick={() => selecionarMesa(mesa.id)}
                className={mesaSelecionadaId === mesa.id ? "selecionada" : ""}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") selecionarMesa(mesa.id);
                }}
                aria-selected={mesaSelecionadaId === mesa.id}
              >
                {editandoMesaId === mesa.id ? (
                  <>
                    <input
                      type="text"
                      value={mesaNomeEditando}
                      onChange={(e) => setMesaNomeEditando(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") salvarNomeMesa(mesa.id);
                        if (e.key === "Escape") setEditandoMesaId(null);
                      }}
                      autoFocus
                      aria-label="Editar nome da mesa"
                    />
                    <div className="acoes">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          salvarNomeMesa(mesa.id);
                        }}
                        title="Salvar nome"
                        aria-label="Salvar nome da mesa"
                      >
                        ✔
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditandoMesaId(null);
                        }}
                        title="Cancelar edição"
                        aria-label="Cancelar edição do nome da mesa"
                      >
                        ✖
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{mesa.nome}</span>
                    <div className="acoes">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          iniciarEdicaoMesa(mesa);
                        }}
                        title="Editar nome da mesa"
                        aria-label={`Editar nome da mesa ${mesa.nome}`}
                      >
                        ✎
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Seção de Comandas da Mesa Selecionada */}
        <section aria-label="Comandas da mesa selecionada">
          <h2>Comandas</h2>
          {mesaSelecionadaId === null ? (
            <p style={{ fontStyle: "italic", color: "#777" }}>
              Selecione uma mesa para gerenciar as comandas
            </p>
          ) : (
            mesas
              .filter((mesa) => mesa.id === mesaSelecionadaId)
              .map((mesa) =>
                mesa.comandas.length === 0 ? (
                  <p
                    key="vazia"
                    style={{ fontStyle: "italic", color: "#777" }}
                  >
                    Nenhuma comanda aberta para essa mesa
                  </p>
                ) : (
                  mesa.comandas.map((comanda) => {
                    const total = comanda.itens.reduce(
                      (acc, i) => acc + i.preco * i.quantidade,
                      0
                    );
                    return (
                      <article
                        className="card-comanda"
                        key={comanda.id}
                        aria-label={`Comanda ${comanda.status}`}
                      >
                        <div className="comanda-header">
                          <span>{comanda.status}</span>
                          <div>
                            <button
                              onClick={() =>
                                imprimirComanda(mesa.nome, comanda)
                              }
                              aria-label="Imprimir comanda"
                              title="Imprimir comanda"
                            >
                              🖨
                            </button>
                            {comanda.status === "Aberta" && (
                              <button
                                onClick={() =>
                                  finalizarComanda(mesa.id, comanda.id)
                                }
                                aria-label="Finalizar comanda"
                                title="Finalizar comanda"
                              >
                                ✔
                              </button>
                            )}
                            <button
                              onClick={() =>
                                excluirComanda(mesa.id, comanda.id)
                              }
                              aria-label="Excluir comanda"
                              title="Excluir comanda"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                        <div className="comanda-itens">
                          {comanda.itens.map((item) => (
                            <div
                              className="item-comanda"
                              key={item.nome + item.preco}
                            >
                              <span className="item-info">{item.nome}</span>
                              <div className="item-quantidade" role="group" aria-label={`Quantidade de ${item.nome}`}>
                                <button
                                  onClick={() =>
                                    alterarQuantidade(
                                      mesa.id,
                                      comanda.id,
                                      item.nome,
                                      -1
                                    )
                                  }
                                  aria-label={`Diminuir quantidade de ${item.nome}`}
                                >
                                  -
                                </button>
                                <span aria-live="polite">{item.quantidade}</span>
                                <button
                                  onClick={() =>
                                    alterarQuantidade(
                                      mesa.id,
                                      comanda.id,
                                      item.nome,
                                      1
                                    )
                                  }
                                  aria-label={`Aumentar quantidade de ${item.nome}`}
                                >
                                  +
                                </button>
                              </div>
                              <span className="item-preco">
                                R$ {item.preco.toFixed(2)}
                              </span>
                              <span className="item-total">
                                R$ {(item.preco * item.quantidade).toFixed(2)}
                              </span>
                              <span
                                className="item-remover"
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  removerItem(mesa.id, comanda.id, item.nome)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    removerItem(mesa.id, comanda.id, item.nome);
                                  }
                                }}
                                aria-label={`Remover item ${item.nome}`}
                                title="Remover item"
                              >
                                ×
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="comanda-footer">
                          <span>Total: R$ {total.toFixed(2)}</span>
                        </div>
                      </article>
                    );
                  })
                )
              )
          )}
        </section>

        {/* Seção do Cardápio por Categoria */}
        <section aria-label="Cardápio por categoria">
          <h2>Cardápio</h2>
          <div className="produtos-categorias">
            {Object.entries(produtosPorCategoria).map(([categoria, produtos]) => (
              <div className="categoria" key={categoria}>
                <h3>{categoria}</h3>
                <div className="lista-produtos">
                  {produtos.map((produto) => (
                    <button
                      key={produto.nome}
                      className="produto-btn"
                      onClick={() => adicionarItem(produto)}
                      aria-label={`Adicionar ${produto.nome} ao pedido`}
                    >
                      {produto.nome} — R$ {produto.preco.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <span>Total Geral: R$ {totalGeral.toFixed(2)}</span>
        <button
          onClick={limparComandasFinalizadas}
          style={{ marginLeft: "15px", backgroundColor: "#c0392b" }}
          title="Limpar todas as comandas finalizadas"
        >
          Limpar Comandas Finalizadas
        </button>
        <button
          onClick={imprimirTodasFinalizadas}
          style={{ marginLeft: "15px", backgroundColor: "#27ae60" }}
          title="Imprimir todas as comandas finalizadas"
        >
          Imprimir Todas Finalizadas
        </button>
      </footer>
    </>
  );
}

export default App;

