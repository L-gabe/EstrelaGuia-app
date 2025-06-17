import { useState, useEffect, useRef } from "react";

const produtosPorCategoria = {
  "Refeição": [
    { nome: "Camaroada P", preco: 80 },
    { nome: "Camaroada G", preco: 140 },
    { nome: "Camarão ao Alho P", preco: 50 },
    { nome: "Camarão ao Alho G", preco: 100 },
  ],
  Bebidas: [
    { nome: "Refrigerante Lata", preco: 7 },
    { nome: "Cerveja Lata", preco: 10 },
    { nome: "Suco Natural", preco: 8 },
  ],
  Sobremesas: [
    { nome: "Pudim", preco: 12 },
    { nome: "Mousse de Maracujá", preco: 15 },
  ],
};

export default function App() {
  const [mesas, setMesas] = useState(() => {
    const saved = localStorage.getItem("mesas");
    return saved ? JSON.parse(saved) : [];
  });

  const [novaMesaNome, setNovaMesaNome] = useState("");
  const [comandaSelecionada, setComandaSelecionada] = useState(null);

  // For impressão
  const printRef = useRef();

  // Salvar mesas no localStorage
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  // Criar nova mesa
  function criarMesa() {
    if (!novaMesaNome.trim()) return;
    if (mesas.some((m) => m.nome === novaMesaNome.trim())) {
      alert("Já existe uma mesa com esse nome!");
      return;
    }
    const novaMesa = {
      id: Date.now(),
      nome: novaMesaNome.trim(),
      comandas: [],
    };
    setMesas([...mesas, novaMesa]);
    setNovaMesaNome("");
  }

  // Editar nome da mesa
  function editarNomeMesa(id, novoNome) {
    if (!novoNome.trim()) return;
    if (mesas.some((m) => m.nome === novoNome.trim())) {
      alert("Já existe uma mesa com esse nome!");
      return;
    }
    setMesas(
      mesas.map((mesa) =>
        mesa.id === id ? { ...mesa, nome: novoNome.trim() } : mesa
      )
    );
  }

  // Adicionar comanda à mesa (cria comanda aberta vazia)
  function adicionarComanda(mesaId) {
    const novaComanda = {
      id: Date.now(),
      itens: [],
      status: "Aberta",
      dataCriacao: new Date().toISOString(),
    };
    setMesas(
      mesas.map((mesa) =>
        mesa.id === mesaId
          ? { ...mesa, comandas: [...mesa.comandas, novaComanda] }
          : mesa
      )
    );
    setComandaSelecionada({ mesaId, comandaId: novaComanda.id });
  }

  // Adicionar item na comanda selecionada
  function adicionarItem(mesaId, comandaId, item) {
    setMesas(
      mesas.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.map((comanda) => {
            if (comanda.id !== comandaId) return comanda;
            // Se item já existe, aumenta quantidade
            const existeItemIndex = comanda.itens.findIndex(
              (i) => i.nome === item.nome
            );
            if (existeItemIndex !== -1) {
              const itensAtualizados = [...comanda.itens];
              itensAtualizados[existeItemIndex].quantidade += 1;
              return { ...comanda, itens: itensAtualizados };
            } else {
              return {
                ...comanda,
                itens: [...comanda.itens, { ...item, quantidade: 1 }],
              };
            }
          }),
        };
      })
    );
  }

  // Remover item da comanda selecionada
  function removerItem(mesaId, comandaId, itemNome) {
    setMesas(
      mesas.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.map((comanda) => {
            if (comanda.id !== comandaId) return comanda;
            return {
              ...comanda,
              itens: comanda.itens.filter((i) => i.nome !== itemNome),
            };
          }),
        };
      })
    );
  }

  // Limpar comanda (remove todos os itens)
  function limparComanda(mesaId, comandaId) {
    setMesas(
      mesas.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.map((comanda) => {
            if (comanda.id !== comandaId) return comanda;
            return { ...comanda, itens: [] };
          }),
        };
      })
    );
  }

  // Excluir comanda da mesa
  function excluirComanda(mesaId, comandaId) {
    setMesas(
      mesas.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.filter((c) => c.id !== comandaId),
        };
      })
    );
    if (
      comandaSelecionada &&
      comandaSelecionada.mesaId === mesaId &&
      comandaSelecionada.comandaId === comandaId
    ) {
      setComandaSelecionada(null);
    }
  }

  // Finalizar comanda
  function finalizarComanda(mesaId, comandaId) {
    setMesas(
      mesas.map((mesa) => {
        if (mesa.id !== mesaId) return mesa;
        return {
          ...mesa,
          comandas: mesa.comandas.map((comanda) => {
            if (comanda.id !== comandaId) return comanda;
            return { ...comanda, status: "Finalizada" };
          }),
        };
      })
    );
    setComandaSelecionada(null);
  }

  // Calcular total da comanda
  function totalComanda(comanda) {
    return comanda.itens.reduce(
      (acc, i) => acc + i.preco * i.quantidade,
      0
    );
  }

  // Calcular total geral do dia (todas comandas)
  function totalGeral() {
    return mesas.reduce((accMesas, mesa) => {
      const totalMesa = mesa.comandas.reduce((accComandas, comanda) => {
        return (
          accComandas +
          comanda.itens.reduce(
            (accItens, i) => accItens + i.preco * i.quantidade,
            0
          )
        );
      }, 0);
      return accMesas + totalMesa;
    }, 0);
  }

  // Limpar todas as comandas (de todas as mesas)
  function limparTodasComandas() {
    if (
      window.confirm(
        "Tem certeza que deseja limpar todas as comandas de todas as mesas?"
      )
    ) {
      setMesas(
        mesas.map((mesa) => ({
          ...mesa,
          comandas: [],
        }))
      );
      setComandaSelecionada(null);
    }
  }

  // Impressão individual
  function imprimirComanda(mesaId, comandaId) {
    const janela = window.open("", "_blank");
    const mesa = mesas.find((m) => m.id === mesaId);
    const comanda = mesa.comandas.find((c) => c.id === comandaId);

    janela.document.write(`
      <html>
        <head>
          <title>Comanda Mesa ${mesa.nome}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px; }
            h2 { margin-bottom: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #333; padding: 5px; text-align: left; }
            .total { font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h2>Mesa: ${mesa.nome}</h2>
          <p>Status: ${comanda.status}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtd</th>
                <th>Preço</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${comanda.itens
                .map(
                  (i) =>
                    `<tr><td>${i.nome}</td><td>${i.quantidade}</td><td>R$ ${i.preco.toFixed(
                      2
                    )}</td><td>R$ ${(i.preco * i.quantidade).toFixed(2)}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total: R$ ${totalComanda(comanda).toFixed(2)}</p>
        </body>
      </html>
    `);
    janela.document.close();
    janela.print();
  }

  // Impressão de todas as comandas (abertas + finalizadas) em uma única folha
  function imprimirTodasComandas() {
    const janela = window.open("", "_blank");

    // Montar o HTML das comandas para impressão
    const mesasOrdenadas = [...mesas].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );

    const htmlComandas = mesasOrdenadas
      .map((mesa) => {
        if (mesa.comandas.length === 0) return "";
        return `
          <section style="margin-bottom:40px;">
            <h2>Mesa: ${mesa.nome}</h2>
            ${mesa.comandas
              .map((comanda) => {
                if (comanda.itens.length === 0) return "";
                return `
                  <div style="margin-bottom:20px; border-bottom:1px dashed #ccc; padding-bottom:10px;">
                    <h3>Comanda - Status: ${comanda.status}</h3>
                    <table style="width:100%; border-collapse: collapse;">
                      <thead>
                        <tr>
                          <th style="border: 1px solid #333; padding:4px;">Item</th>
                          <th style="border: 1px solid #333; padding:4px;">Qtd</th>
                          <th style="border: 1px solid #333; padding:4px;">Preço</th>
                          <th style="border: 1px solid #333; padding:4px;">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${comanda.itens
                          .map(
                            (i) =>
                              `<tr>
                                <td style="border: 1px solid #333; padding:4px;">${i.nome}</td>
                                <td style="border: 1px solid #333; padding:4px;">${i.quantidade}</td>
                                <td style="border: 1px solid #333; padding:4px;">R$ ${i.preco.toFixed(
                                  2
                                )}</td>
                                <td style="border: 1px solid #333; padding:4px;">R$ ${(
                                  i.preco * i.quantidade
                                ).toFixed(2)}</td>
                              </tr>`
                          )
                          .join("")}
                      </tbody>
                    </table>
                    <p style="font-weight:bold; margin-top:6px;">Total: R$ ${totalComanda(
                      comanda
                    ).toFixed(2)}</p>
                  </div>
                `;
              })
              .join("")}
          </section>
        `;
      })
      .join("");

    janela.document.write(`
      <html>
        <head>
          <title>Comandas do Dia</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 15px; font-size: 14px; }
            h2 { border-bottom: 2px solid #333; padding-bottom: 5px; }
            h3 { margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #333; padding: 4px; text-align: left; }
            @media print {
              body { font-size: 12px; }
              h2 { font-size: 18px; }
              h3 { font-size: 16px; }
              table, th, td { border: 1px solid black; }
            }
          </style>
        </head>
        <body>
          <h1>Comandas do Dia</h1>
          ${htmlComandas}
          <hr />
          <h2>Total Geral: R$ ${totalGeral().toFixed(2)}</h2>
        </body>
      </html>
    `);

    janela.document.close();
    janela.print();
  }

  // Separar comandas abertas e finalizadas para exibição
  const comandasAbertas = [];
  const comandasFinalizadas = [];

  mesas.forEach((mesa) => {
    mesa.comandas.forEach((comanda) => {
      const info = {
        mesaId: mesa.id,
        mesaNome: mesa.nome,
        comanda,
      };
      if (comanda.status === "Aberta") comandasAbertas.push(info);
      else comandasFinalizadas.push(info);
    });
  });

  // Formatação da data para exibir na tela da comanda
  function formatarData(isoStr) {
    const dt = new Date(isoStr);
    return dt.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Controle de Comandas</h1>
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Nome da nova mesa"
            value={novaMesaNome}
            onChange={(e) => setNovaMesaNome(e.target.value)}
            style={styles.input}
          />
          <button onClick={criarMesa} style={styles.botao}>
            Adicionar Mesa
          </button>
          <button onClick={limparTodasComandas} style={styles.botaoLimpar}>
            Limpar Todas Comandas
          </button>
          <button onClick={imprimirTodasComandas} style={styles.botao}>
            Imprimir Todas Comandas
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Lista de mesas */}
        <section style={styles.secaoMesas}>
          <h2>Mesas</h2>
          {mesas.length === 0 && <p>Nenhuma mesa cadastrada.</p>}
          {mesas.map((mesa) => (
            <div key={mesa.id} style={styles.mesaCard}>
              <input
                type="text"
                value={mesa.nome}
                onChange={(e) => editarNomeMesa(mesa.id, e.target.value)}
                style={styles.inputMesaNome}
              />
              <button
                onClick={() => adicionarComanda(mesa.id)}
                style={styles.botaoAdicionarComanda}
                title="Adicionar comanda"
              >
                +
              </button>

              {/* Lista de comandas da mesa */}
              <div style={styles.listaComandas}>
                {mesa.comandas.length === 0 && (
                  <p style={{ fontStyle: "italic" }}>Sem comandas</p>
                )}
                {mesa.comandas.map((comanda) => (
                  <div
                    key={comanda.id}
                    style={{
                      ...styles.comandaCard,
                      borderColor:
                        comanda.status === "Aberta" ? "#28a745" : "#6c757d",
                      backgroundColor:
                        comanda.status === "Aberta" ? "#d4edda" : "#e2e3e5",
                    }}
                    onClick={() =>
                      setComandaSelecionada({
                        mesaId: mesa.id,
                        comandaId: comanda.id,
                      })
                    }
                    title={`Status: ${comanda.status}`}
                  >
                    <div style={styles.comandaHeader}>
                      <span>Comanda #{comanda.id}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          excluirComanda(mesa.id, comanda.id);
                        }}
                        style={styles.botaoExcluirComanda}
                        title="Excluir comanda"
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ fontSize: 12 }}>
                      Criada: {formatarData(comanda.dataCriacao)}
                    </div>
                    <div style={{ fontWeight: "bold" }}>
                      Total: R$ {totalComanda(comanda).toFixed(2)}
                    </div>
                    <div>Status: {comanda.status}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Comanda selecionada para edição */}
        <section style={styles.secaoComandaSelecionada}>
          <h2>Comanda Selecionada</h2>
          {!comandaSelecionada && <p>Selecione uma comanda para editar.</p>}
          {comandaSelecionada && (
            <>
              {(() => {
                const mesa = mesas.find(
                  (m) => m.id === comandaSelecionada.mesaId
                );
                if (!mesa) return <p>Mesa não encontrada.</p>;
                const comanda = mesa.comandas.find(
                  (c) => c.id === comandaSelecionada.comandaId
                );
                if (!comanda) return <p>Comanda não encontrada.</p>;

                return (
                  <div>
                    <h3>
                      Mesa: {mesa.nome} - Comanda #{comanda.id} - Status:{" "}
                      {comanda.status}
                    </h3>

                    {/* Itens do cardápio por categoria */}
                    <div style={styles.cardapio}>
                      <h4>Cardápio</h4>
                      {Object.entries(produtosPorCategoria).map(
                        ([categoria, produtos]) => (
                          <div key={categoria} style={styles.categoria}>
                            <h5>{categoria}</h5>
                            <div style={styles.produtosLista}>
                              {produtos.map((produto) => (
                                <button
                                  key={produto.nome}
                                  onClick={() =>
                                    adicionarItem(
                                      mesa.id,
                                      comanda.id,
                                      produto
                                    )
                                  }
                                  style={styles.botaoProduto}
                                  disabled={comanda.status !== "Aberta"}
                                  title={`Adicionar ${produto.nome} - R$ ${produto.preco.toFixed(
                                    2
                                  )}`}
                                >
                                  {produto.nome} (R$ {produto.preco.toFixed(2)})
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Itens adicionados na comanda */}
                    <div style={styles.itensComanda}>
                      <h4>Itens na Comanda</h4>
                      {comanda.itens.length === 0 && (
                        <p>Sem itens adicionados.</p>
                      )}
                      <ul style={{ paddingLeft: 20 }}>
                        {comanda.itens.map((item) => (
                          <li key={item.nome} style={styles.itemComanda}>
                            {item.nome} - Qtd: {item.quantidade} - R${" "}
                            {(item.preco * item.quantidade).toFixed(2)}
                            {comanda.status === "Aberta" && (
                              <button
                                onClick={() =>
                                  removerItem(mesa.id, comanda.id, item.nome)
                                }
                                style={styles.botaoRemoverItem}
                                title="Remover item"
                              >
                                ✕
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                      <p style={{ fontWeight: "bold" }}>
                        Total: R$ {totalComanda(comanda).toFixed(2)}
                      </p>
                      {comanda.status === "Aberta" && (
                        <>
                          <button
                            onClick={() => limparComanda(mesa.id, comanda.id)}
                            style={styles.botaoLimpar}
                          >
                            Limpar Comanda
                          </button>
                          <button
                            onClick={() => finalizarComanda(mesa.id, comanda.id)}
                            style={styles.botaoFinalizar}
                          >
                            Finalizar Comanda
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => imprimirComanda(mesa.id, comanda.id)}
                        style={styles.botao}
                      >
                        Imprimir Comanda
                      </button>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </section>

        {/* Seção com comandas finalizadas agrupadas */}
        <section style={styles.secaoFinalizadas}>
          <h2>Comandas Finalizadas</h2>
          {comandasFinalizadas.length === 0 && <p>Nenhuma comanda finalizada.</p>}
          {comandasFinalizadas.map(({ mesaId, mesaNome, comanda }) => (
            <div
              key={comanda.id}
              style={{
                ...styles.comandaCard,
                borderColor: "#6c757d",
                backgroundColor: "#e2e3e5",
                cursor: "default",
                marginBottom: 8,
              }}
            >
              <div>
                <strong>Mesa:</strong> {mesaNome} | <strong>Comanda:</strong> #{comanda.id}
              </div>
              <div>Finalizada em: {formatarData(comanda.dataCriacao)}</div>
              <div>
                Total: R$ {totalComanda(comanda).toFixed(2)}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 1200,
    margin: "0 auto",
    padding: 15,
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    padding: 8,
    fontSize: 16,
    marginRight: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
    width: 200,
  },
  botao: {
    padding: "8px 14px",
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  botaoLimpar: {
    padding: "8px 14px",
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  botaoFinalizar: {
    padding: "8px 14px",
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  secaoMesas: {
    marginBottom: 30,
  },
  mesaCard: {
    border: "1px solid #ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  inputMesaNome: {
    fontSize: 18,
    padding: 6,
    marginBottom: 6,
    borderRadius: 4,
    border: "1px solid #ccc",
    width: "70%",
  },
  botaoAdicionarComanda: {
    fontSize: 20,
    fontWeight: "bold",
    padding: "4px 10px",
    marginLeft: 10,
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  listaComandas: {
    marginTop: 10,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  comandaCard: {
    border: "2px solid",
    borderRadius: 6,
    padding: 8,
    width: 160,
    cursor: "pointer",
    userSelect: "none",
  },
  comandaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  botaoExcluirComanda: {
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: 4,
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: "16px",
    padding: "0 6px",
  },
  secaoComandaSelecionada: {
    borderTop: "2px solid #007bff",
    paddingTop: 20,
    marginBottom: 30,
  },
  cardapio: {
    marginBottom: 20,
  },
  categoria: {
    marginBottom: 12,
  },
  produtosLista: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  botaoProduto: {
    padding: "6px 10px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  },
  itensComanda: {
    borderTop: "1px solid #ccc",
    paddingTop: 10,
  },
  itemComanda: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  botaoRemoverItem: {
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: 4,
    color: "white",
    cursor: "pointer",
    marginLeft: 8,
    fontWeight: "bold",
  },
  secaoFinalizadas: {
    borderTop: "2px solid #6c757d",
    paddingTop: 20,
  },
  main: {
    display: "flex",
    flexWrap: "wrap",
    gap: 30,
    justifyContent: "space-between",
  },
};
export default App;
