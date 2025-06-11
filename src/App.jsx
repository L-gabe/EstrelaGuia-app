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

function App() {
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || {});
  const [dataSelecionada, setDataSelecionada] = useState(() => localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10));
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
    localStorage.setItem("comandas", JSON.stringify(comandas));
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [mesas, comandas, dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim() !== "") {
      setMesas([...mesas, { id: Date.now(), nome: nome.trim() }]);
    }
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim() !== "") {
      setMesas(mesas.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
    }
  };

  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }

    const mesaId = mesaSelecionada;
    let comanda = comandasDoDia[mesaId];

    if (!comanda) {
      comanda = { status: "Aberta", itens: [] };
    } else if (Array.isArray(comanda)) {
      comanda = { status: "Aberta", itens: comanda };
    }

    const indexItem = comanda.itens.findIndex(i => i.nome === item.nome);

    if (indexItem >= 0) {
      comanda.itens[indexItem].quantidade += 1;
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

  const removerItem = (mesaId, nomeItem) => {
    let comanda = comandasDoDia[mesaId];
    if (!comanda) return;
    if (Array.isArray(comanda)) {
      comanda = { status: "Aberta", itens: comanda };
    }
    const novosItens = comanda.itens.filter(i => i.nome !== nomeItem);

    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: novosItens },
      },
    });
  };

  const toggleStatus = (mesaId) => {
    let comanda = comandasDoDia[mesaId];
    if (!comanda) return;
    if (Array.isArray(comanda)) {
      comanda = { status: "Aberta", itens: comanda };
    }
    const novoStatus = comanda.status === "Finalizada" ? "Aberta" : "Finalizada";

    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, status: novoStatus },
      },
    });
  };

  const limparComanda = (mesaId) => {
    let comanda = comandasDoDia[mesaId];
    if (!comanda) return;
    if (Array.isArray(comanda)) {
      comanda = { status: "Aberta", itens: comanda };
    }
    setComandas({
      ...comandas,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comanda, itens: [], status: "Aberta" },
      },
    });
  };

  const excluirComanda = (mesaId) => {
    const novasComandasDoDia = { ...comandasDoDia };
    delete novasComandasDoDia[mesaId];

    setComandas({
      ...comandas,
      [dataSelecionada]: novasComandasDoDia,
    });

    if (mesaSelecionada === mesaId) {
      setMesaSelecionada(null);
    }
  };

  const limparHistorico = () => {
    if (window.confirm("Confirma limpeza do histórico de comandas do dia?")) {
      const novasComandas = { ...comandas };
      delete novasComandas[dataSelecionada];
      setComandas(novasComandas);
      setMesaSelecionada(null);
    }
  };

  const totalComanda = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda) return 0;
    const itens = Array.isArray(comanda) ? comanda : comanda.itens;
    return itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  const totalVendasDoDia = () => {
    return Object.keys(comandasDoDia).reduce((acc, mesaId) => acc + totalComanda(mesaId), 0);
  };

  const mesasAberta = Object.entries(comandasDoDia)
    .filter(([, comanda]) => {
      const status = comanda.status || "Aberta";
      return status === "Aberta";
    })
    .map(([mesaId]) => mesaId);

  const mesasFinalizada = Object.entries(comandasDoDia)
    .filter(([, comanda]) => {
      const status = comanda.status || "Aberta";
      return status === "Finalizada";
    })
    .map(([mesaId]) => mesaId);

  // Função para imprimir uma comanda
  const imprimirComanda = (mesaId) => {
    const mesa = mesas.find((m) => m.id === Number(mesaId));
    const comanda = comandasDoDia[mesaId];
    if (!mesa || !comanda) return;

    // Criar uma nova janela para impressão
    const itens = Array.isArray(comanda) ? comanda : comanda.itens;
    const total = totalComanda(mesaId).toFixed(2);

    const html = `
      <html>
        <head>
          <title>Impressão da Comanda</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 10px; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 8px; }
            .total { font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>Comanda - ${mesa.nome}</h2>
          <ul>
            ${itens
              .map(
                (item) =>
                  `<li>${item.nome} x ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}</li>`
              )
              .join("")}
          </ul>
          <div class="total">Total: R$ ${total}</div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "PRINT", "width=400,height=600");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      alert("Por favor, permita popups para imprimir a comanda.");
    }
  };

  return (
    <>
      <style>
        {`
          /* RESET e básicos */
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333;
          }

          /* Container principal */
          #root {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
          }

          h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #2c3e50;
          }

          /* Flex container para mesas e cardápio */
          .top-section {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: center;
          }

          /* Mesas */
          .mesas {
            flex: 1 1 300px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
          }

          .mesas h2 {
            margin-top: 0;
            margin-bottom: 15px;
          }

          .lista-mesas {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .mesa {
            background: #ecf0f1;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            user-select: none;
            flex: 1 1 90px;
            text-align: center;
            font-weight: 600;
            transition: background-color 0.2s, border 0.2s;
          }

          .mesa:hover {
            background-color: #bdc3c7;
          }

          .mesa.selecionada {
            border: 3px solid #2980b9;
            background-color: #d6eaf8;
          }

          /* Botões */
          button {
            cursor: pointer;
            border: none;
            background-color: #2980b9;
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-weight: 600;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #1f618d;
          }

          button.danger {
            background-color: #c0392b;
          }

          button.danger:hover {
            background-color: #922b21;
          }

          button.orange {
            background-color: #e67e22;
            color: black;
          }

          button.orange:hover {
            background-color: #ca6f1e;
          }

          /* Cardápio */
          .cardapio {
            flex: 2 1 600px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
            max-height: 600px;
            overflow-y: auto;
          }

          .cardapio h2 {
            margin-top: 0;
            margin-bottom: 15px;
          }

          .categoria {
            margin-bottom: 20px;
          }

          .categoria h3 {
            margin-bottom: 8px;
            border-bottom: 2px solid #2980b9;
            padding-bottom: 4px;
            color: #2980b9;
          }

          .produto {
            padding: 6px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            user-select: none;
          }

          .produto:hover {
            background-color: #d6eaf8;
          }

          .produto.disabled {
            color: #999;
            cursor: not-allowed;
          }

          /* Comandas do dia */
          .comandas {
            margin-top: 30px;
          }

          .comandas h2 {
            margin-bottom: 10px;
            text-align: center;
            color: #2c3e50;
          }

          .comandas-lista {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
          }

          .comanda {
            background: white;
            border-radius: 8px;
            padding: 15px;
            width: 300px;
            box-shadow: 0 0 8px rgb(0 0 0 / 0.1);
            display: flex;
            flex-direction: column;
          }

          .comanda.finalizada {
            background-color: #e9f7ef;
          }

          .comanda h3 {
            margin: 0 0 10px 0;
            color: #27ae60;
          }

          .comanda .botoes {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
            flex-wrap: wrap;
          }

          .comanda ul {
            list-style: none;
            padding-left: 0;
            margin: 0 0 10px 0;
            flex-grow: 1;
            overflow-y: auto;
            max-height: 150px;
          }

          .comanda li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            font-size: 14px;
          }

          .comanda li button {
            background: transparent;
            border: none;
            color: #c0392b;
            font-weight: bold;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            padding: 0 5px;
          }

          .comanda .total {
            font-weight: 700;
            font-size: 16px;
            text-align: right;
            margin-top: auto;
          }

          /* Checkbox para mostrar finalizadas */
          .mostrar-finalizadas {
            margin-bottom: 10px;
            text-align: center;
          }

          /* Total geral */
          .total-geral {
            text-align: center;
            font-weight: 700;
            font-size: 18px;
            margin-top: 20px;
            color: #34495e;
          }

          /* Responsivo */
          @media (max-width: 900px) {
            .top-section {
              flex-direction: column;
            }

            .cardapio {
              max-height: 300px;
            }
          }

          @media (max-width: 480px) {
            .mesas,
            .cardapio,
            .comanda {
              width: 100%;
              max-width: none;
            }

            .comandas-lista {
              flex-direction: column;
              align-items: center;
            }
          }

          /* Impressão */
          @media print {
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 10px;
              background: white;
              color: black;
              font-size: 12pt;
            }
          }
        `}
      </style>

      <div>
        <h1>Controle de Vendas do Restaurante</h1>

        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <button onClick={adicionarMesa}>Adicionar Mesa</button>
        </div>

        <div className="top-section">
          <div className="mesas">
            <h2>Mesas</h2>
            <div className="lista-mesas">
              {mesas.map((mesa) => (
                <div
                  key={mesa.id}
                  className={`mesa ${
                    mesaSelecionada && mesaSelecionada.id === mesa.id
                      ? "selecionada"
                      : ""
                  }`}
                  onClick={() => selecionarMesa(mesa)}
                >
                  {mesa.nome}
                </div>
              ))}
            </div>
          </div>

          <div className="cardapio">
            <h2>Cardápio</h2>
            {Object.entries(cardapioCategorias).map(([categoria, produtos]) => (
              <div key={categoria} className="categoria">
                <h3>{categoria}</h3>
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className={`produto ${
                      produto.disponivel === false ? "disabled" : ""
                    }`}
                    onClick={() =>
                      produto.disponivel !== false && adicionarItem(mesaSelecionada.id, produto)
                    }
                  >
                    {produto.nome} - R$ {produto.preco.toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mostrar-finalizadas">
          <label>
            <input
              type="checkbox"
              checked={mostrarFinalizadas}
              onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
            />{" "}
            Mostrar comandas finalizadas
          </label>
        </div>

        <div className="comandas">
          <h2>Comandas Abertas</h2>
          <div className="comandas-lista">
            {mesasAberta.length === 0 && <p>Nenhuma comanda aberta.</p>}
            {mesasAberta.map((mesaId) => (
              <div key={mesaId} className="comanda">
                <h3>{mesas.find((m) => m.id === Number(mesaId))?.nome}</h3>
                <div className="botoes">
                  <button onClick={() => imprimirComanda(mesaId)}>Imprimir</button>
                  <button onClick={() => finalizarComanda(mesaId)} className="orange">
                    Finalizar
                  </button>
                  <button onClick={() => limparComanda(mesaId)} className="danger">
                    Limpar
                  </button>
                  <button onClick={() => excluirComanda(mesaId)} className="danger">
                    Excluir
                  </button>
                </div>
                <ul>
                  {comandasDoDia[mesaId].itens.map((item, idx) => (
                    <li key={idx}>
                      {item.nome} x {item.quantidade} - R$ {(item.preco * item.quantidade).toFixed(2)}
                      <button onClick={() => removerItem(mesaId, idx)}>x</button>
                    </li>
                  ))}
                </ul>
                <div className="total">Total: R$ {totalComanda(mesaId).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {mostrarFinalizadas && (
            <>
              <h2>Comandas Finalizadas</h2>
              <div className="comandas-lista">
                {mesasFinalizada.length === 0 && <p>Nenhuma comanda finalizada.</p>}
                {mesasFinalizada.map((mesaId) => (
                  <div key={mesaId} className="comanda finalizada">
                    <h3>{mesas.find((m) => m.id === Number(mesaId))?.nome}</h3>
                    <div className="botoes">
                      <button onClick={() => imprimirComanda(mesaId)}>Imprimir</button>
                      <button onClick={() => excluirComanda(mesaId)} className="danger">
                        Excluir
                      </button>
                    </div>
                    <ul>
                      {comandasDoDia[mesaId].itens.map((item, idx) => (
                        <li key={idx}>
                          {item.nome} x {item.quantidade} - R$ {(item.preco * item.quantidade).toFixed(2)}
                          <button onClick={() => removerItem(mesaId, idx)}>x</button>
                        </li>
                      ))}
                    </ul>
                    <div className="total">Total: R$ {totalComanda(mesaId).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="total-geral">
            Total Geral: R$ {totalGeral().toFixed(2)}
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={imprimirTodasComandas}>Imprimir Todas as Comandas</button>
            <button
              onClick={limparHistorico}
              className="danger"
              style={{ marginLeft: "10px" }}
            >
              Limpar Histórico de Comandas
            </button>
          </div>
        </div>
      </div>
    </>
  );
}Aqui está o código completo atualizado do seu sistema de comandas para restaurante em React, já com:

- **Botão para adicionar mesas e editar nomes** (pede prompt para nome ao criar);
- **Salvar e carregar dados de mesas e comandas no localStorage** para manter persistência;
- **Comandas organizadas e separadas por status Aberta e Finalizada**;
- **Impressão individual e impressão de todas as comandas do dia**;
- **Botões para limpar comanda, excluir comanda e limpar histórico**;
- **Cardápio organizado por categoria**;
- **Layout responsivo e visual agradável**.

```jsx
import React, { useState, useEffect } from "react";

// Exemplo de cardápio com categorias
const cardapioCategorias = {
  "Bebidas": [
    { id: 1, nome: "Coca-Cola", preco: 5.0, disponivel: true },
    { id: 2, nome: "Suco de Laranja", preco: 6.5, disponivel: true },
  ],
  "Comidas": [
    { id: 3, nome: "Hambúrguer", preco: 15.0, disponivel: true },
    { id: 4, nome: "Pizza Calabresa", preco: 30.0, disponivel: true },
  ],
};

export default function RestauranteComandas() {
  // Estado das mesas [{id, nome}]
  const [mesas, setMesas] = useState(() => {
    const salvo = localStorage.getItem("mesas");
    return salvo ? JSON.parse(salvo) : [];
  });

  // Estado das comandas {mesaId: {itens: [{id,nome,preco,quantidade}], status: "Aberta"|"Finalizada"}}
  const [comandasDoDia, setComandasDoDia] = useState(() => {
    const salvo = localStorage.getItem("comandasDoDia");
    return salvo ? JSON.parse(salvo) : {};
  });

  // Mesa selecionada para adicionar itens
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  // Mostrar comandas finalizadas
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);

  // Persistir mesas e comandas no localStorage
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem("comandasDoDia", JSON.stringify(comandasDoDia));
  }, [comandasDoDia]);

  // Adicionar mesa nova (pede nome via prompt)
  function adicionarMesa() {
    const nome = prompt("Nome da nova mesa:", `Mesa ${mesas.length + 1}`);
    if (!nome || nome.trim() === "") return;
    const novoId = mesas.length > 0 ? Math.max(...mesas.map((m) => m.id)) + 1 : 1;
    setMesas([...mesas, { id: novoId, nome: nome.trim() }]);
  }

  // Selecionar mesa para adicionar itens
  function selecionarMesa(mesa) {
    setMesaSelecionada(mesa);
  }

  // Adicionar item à comanda da mesa selecionada
  function adicionarItem(mesaId, produto) {
    if (!mesaId) {
      alert("Selecione uma mesa primeiro!");
      return;
    }
    setComandasDoDia((old) => {
      const comanda = old[mesaId] || { itens: [], status: "Aberta" };
      if (comanda.status === "Finalizada") {
        alert("Comanda finalizada, não pode adicionar itens.");
        return old;
      }
      const itens = [...comanda.itens];
      const idx = itens.findIndex((i) => i.id === produto.id);
      if (idx >= 0) {
        itens[idx].quantidade += 1;
      } else {
        itens.push({ ...produto, quantidade: 1 });
      }
      return { ...old, [mesaId]: { ...comanda, itens } };
    });
  }

  // Remover item da comanda
  function removerItem(mesaId, idxItem) {
    setComandasDoDia((old) => {
      const comanda = old[mesaId];
      if (!comanda) return old;
      const itens = [...comanda.itens];
      itens.splice(idxItem, 1);
      return { ...old, [mesaId]: { ...comanda, itens } };
    });
  }

  // Limpar itens da comanda
  function limparComanda(mesaId) {
    setComandasDoDia((old) => {
      if (!old[mesaId]) return old;
      return { ...old, [mesaId]: { itens: [], status: "Aberta" } };
    });
  }

  // Excluir comanda completamente
  function excluirComanda(mesaId) {
    if (!window.confirm("Confirma excluir essa comanda?")) return;
    setComandasDoDia((old) => {
      const copia = { ...old };
      delete copia[mesaId];
      return copia;
    });
  }

  // Finalizar comanda
  function finalizarComanda(mesaId) {
    setComandasDoDia((old) => {
      const comanda = old[mesaId];
      if (!comanda) return old;
      return { ...old, [mesaId]: { ...comanda, status: "Finalizada" } };
    });
  }

  // Calcular total da comanda
  function totalComanda(mesaId) {
    const comanda = comandasDoDia[mesaId];
    if (!comanda) return 0;
    return comanda.itens.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
  }

  // Calcular total geral do dia (somando todas comandas)
  function totalGeral() {
    return Object.values(comandasDoDia).reduce(
      (acc, comanda) =>
        acc + comanda.itens.reduce((acc2, item) => acc2 + item.preco * item.quantidade, 0),
      0
    );
  }

  // Imprimir comanda específica
  function imprimirComanda(mesaId) {
    const mesa = mesas.find((m) => m.id === Number(mesaId));
    const comanda = comandasDoDia[mesaId];
    if (!mesa || !comanda) return;

    const itens = comanda.itens;
    const total = totalComanda(mesaId).toFixed(2);

    const html = `
      <html>
        <head>
          <title>Impressão da Comanda</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 10px; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 8px; }
            .total { font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>Comanda - ${mesa.nome}</h2>
          <ul>
            ${itens
              .map(
                (item) =>
                  `<li>${item.nome} x ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}</li>`
              )
              .join("")}
          </ul>
          <div class="total">Total: R$ ${total}</div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "PRINT", "width=400,height=600");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      alert("Por favor, permita popups para imprimir a comanda.");
    }
  }

  // Imprimir todas comandas do dia (abertas e finalizadas)
  function imprimirTodasComandas() {
    const htmlComandas = Object.entries(comandasDoDia)
      .map(([mesaId, comanda]) => {
        const mesa = mesas.find((m) => m.id === Number(mesaId));
        if (!mesa) return "";
        const itensHtml = comanda.itens
          .map(
            (item) =>
              `<li>${item.nome} x ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(
                2
              )}</li>`
          )
          .join("");
        return `
          <div style="page-break-after: always;">
            <h2>Comanda - ${mesa.nome}</h2>
            <ul>${itensHtml}</ul>
            <div><strong>Total: R$ ${totalComanda(mesaId).toFixed(2)}</strong></div>
          </div>
        `;
      })
      .join("");

    const html = `
      <html>
        <head>
          <title>Impressão de Todas as Comandas</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 10px; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 8px; }
            div { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          ${htmlComandas}
        </body>
      </html>
    `;

    const printWindow = window.open("", "PRINT", "width=600,height=800");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      alert("Por favor, permita popups para imprimir as comandas.");
    }
  }

  // Limpar todo o histórico de comandas
  function limparHistorico() {
    if (!window.confirm("Confirma limpar todo o histórico de comandas?")) return;
    setComandasDoDia({});
  }

  // Mesas abertas e finalizadas (filtragem)
  const mesasAberta = Object.entries(comandasDoDia)
    .filter(([, comanda]) => comanda.status !== "Finalizada")
    .map(([mesaId]) => mesaId);

  const mesasFinalizada = Object.entries(comandasDoDia)
    .filter(([, comanda]) => comanda.status === "Finalizada")
    .map(([mesaId]) => mesaId);

  return (
    <>
      <style>
        {`
          /* RESET e básicos */
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333;
          }

          #root {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
          }

          h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #2c3e50;
          }

          .top-section {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .mesas {
            flex: 1 1 300px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
          }

          .mesas h2 {
            margin-top: 0;
            margin-bottom: 15px;
          }

          .lista-mesas {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .mesa {
            background: #ecf0f1;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            user-select: none;
            flex: 1 1 90px;
            text-align: center;
            font-weight: 600;
            transition: background-color 0.2s, border 0.2s;
          }

          .mesa:hover {
            background-color: #bdc3c7;
          }

          .mesa.selecionada {
            border: 3px solid #2980b9;
            background-color: #d6eaf8;
          }

          button {
            cursor: pointer;
            border: none;
            background-color: #2980b9;
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-weight: 600;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #1f618d;
          }

          button.danger {
            background-color: #c0392b;
          }

          button.danger:hover {
            background-color: #922b21;
          }

          button.orange {
            background-color: #e67e22;
            color: black;
          }

          button.orange:hover {
            background-color: #ca6f1e;
          }

          .cardapio {
            flex: 2 1 600px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
            max-height: 600px;
            overflow-y: auto;
          }

          .cardapio h2 {
            margin-top: 0;
            margin-bottom: 15px;
          }

          .categoria {
            margin-bottom: 20px;
          }

          .categoria h3 {
            margin-bottom: 10px;
            color: #34495e;
            border-bottom: 2px solid #2980b9;
            padding-bottom: 5px;
          }

          .produto {
            padding: 8px 10px;
            border-radius: 5px;
            background-color: #ecf0f1;
            margin-bottom: 6px;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s;
            display: flex;
            justify-content: space-between;
            font-weight: 600;
          }

          .produto:hover {
            background-color: #d0d7de;
          }

          .produto.disabled {
            background-color: #bdc3c7;
            cursor: not-allowed;
            color: #7f8c8d;
          }

          .comandas {
            margin-top: 30px;
          }

          .comandas-lista {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
          }

          .comanda {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 8px rgb(0 0 0 / 0.1);
            width: 320px;
            display: flex;
            flex-direction: column;
          }

          .comanda.finalizada {
            background-color: #f9e79f;
          }

          .comanda h3 {
            margin-top: 0;
            margin-bottom: 10px;
            text-align: center;
            color: #2c3e50;
          }

          .botoes {
            display: flex;
            justify-content: space-around;
            margin-bottom: 10px;
          }

          ul {
            list-style: none;
            padding-left: 0;
            margin: 0;
            flex-grow: 1;
            overflow-y: auto;
            max-height: 180px;
          }

          ul li {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-weight: 600;
            user-select: none;
          }

          ul li button {
            background: transparent;
            border: none;
            color: #c0392b;
            font-weight: bold;
            cursor: pointer;
            padding: 0 6px;
            font-size: 16px;
            line-height: 1;
            border-radius: 4px;
            transition: background-color 0.2s;
          }

          ul li button:hover {
            background-color: #e74c3c;
            color: white;
          }

          .total {
            font-weight: 700;
            text-align: right;
            margin-top: 10px;
            font-size: 1.1em;
          }

          .mostrar-finalizadas {
            text-align: center;
            margin-bottom: 20px;
          }

          .total-geral {
            font-weight: 800;
            font-size: 1.3em;
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
            color: #27ae60;
          }

          @media (max-width: 768px) {
            .top-section {
              flex-direction: column;
            }
            .mesas, .cardapio {
              flex: 1 1 100%;
              max-height: none;
              overflow-y: visible;
            }
            .comanda {
              width: 100%;
            }
          }
        `}
      </style>

      <div>
        <h1>Controle de Mesas e Comandas</h1>

        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <button onClick={adicionarMesa}>Adicionar Mesa</button>
        </div>

        <div className="top-section">
          <div className="mesas">
            <h2>Mesas</h2>
            <div className="lista-mesas">
              {mesas.map((mesa) => (
                <div
                  key={mesa.id}
                  className={`mesa ${
                    mesaSelecionada && mesaSelecionada.id === mesa.id
                      ? "selecionada"
                      : ""
                  }`}
                  onClick={() => selecionarMesa(mesa)}
                >
                  {mesa.nome}
                </div>
              ))}
            </div>
          </div>

          <div className="cardapio">
            <h2>Cardápio</h2>
            {Object.entries(cardapioCategorias).map(([categoria, produtos]) => (
              <div key={categoria} className="categoria">
                <h3>{categoria}</h3>
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className={`produto ${
                      produto.disponivel === false ? "disabled" : ""
                    }`}
                    onClick={() =>
                      produto.disponivel !== false && adicionarItem(mesaSelecionada?.id, produto)
                    }
                  >
                    <span>{produto.nome}</span>
                    <span>R$ {produto.preco.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mostrar-finalizadas">
          <label>
            <input
              type="checkbox"
              checked={mostrarFinalizadas}
              onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
            />{" "}
            Mostrar comandas finalizadas
          </label>
        </div>

        <div className="comandas">
          <h2>Comandas Abertas</h2>
          <div className="comandas-lista">
            {mesasAberta.length === 0 && <p>Nenhuma comanda aberta.</p>}
            {mesasAberta.map((mesaId) => (
              <div key={mesaId} className="comanda">
                <h3>{mesas.find((m) => m.id === Number(mesaId))?.nome}</h3>
                <div className="botoes">
                  <button onClick={() => imprimirComanda(mesaId)}>Imprimir</button>
                  <button onClick={() => finalizarComanda(mesaId)} className="orange">
                    Finalizar
                  </button>
                  <button onClick={() => limparComanda(mesaId)} className="danger">
                    Limpar
                  </button>
                  <button onClick={() => excluirComanda(mesaId)} className="danger">
                    Excluir
                  </button>
                </div>
                <ul>
                  {comandasDoDia[mesaId].itens.map((item, idx) => (
                    <li key={idx}>
                      {item.nome} x {item.quantidade} - R$ {(item.preco * item.quantidade).toFixed(2)}
                      <button onClick={() => removerItem(mesaId, idx)}>x</button>
                    </li>
                  ))}
                </ul>
                <div className="total">Total: R$ {totalComanda(mesaId).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {mostrarFinalizadas && (
            <>
              <h2>Comandas Finalizadas</h2>
              <div className="comandas-lista">
                {mesasFinalizada.length === 0 && <p>Nenhuma comanda finalizada.</p>}
                {mesasFinalizada.map((mesaId) => (
                  <div key={mesaId} className="comanda finalizada">
                    <h3>{mesas.find((m) => m.id === Number(mesaId))?.nome}</h3>
                    <div className="botoes">
                      <button onClick={() => imprimirComanda(mesaId)}>Imprimir</button>
                      <button onClick={() => excluirComanda(mesaId)} className="danger">
                        Excluir
                      </button>
                    </div>
                    <ul>
                      {comandasDoDia[mesaId].itens.map((item, idx) => (
                        <li key={idx}>
                          {item.nome} x {item.quantidade} - R$ {(item.preco * item.quantidade).toFixed(2)}
                          <button onClick={() => removerItem(mesaId, idx)}>x</button>
                        </li>
                      ))}
                    </ul>
                    <div className="total">Total: R$ {totalComanda(mesaId).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="total-geral">
            Total Geral: R$ {totalGeral().toFixed(2)}
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={imprimirTodasComandas}>Imprimir Todas as Comandas</button>
            <button
              onClick={limparHistorico}
              className="danger"
              style={{ marginLeft: "10px" }}
            >
              Limpar Histórico de Comandas
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
