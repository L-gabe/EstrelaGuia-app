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
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(true); // ADICIONADO: controle para mostrar/ocultar mesas finalizadas
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

  // Excluir mesa (remove mesa e comanda relacionada)
  const excluirMesa = (id) => {  // ADICIONADO
    if (!window.confirm("Tem certeza que deseja excluir essa mesa? Isso também excluirá a comanda vinculada.")) return;

    setMesas(prev => prev.filter(m => m.id !== id));

    setComandas(prev => {
      const novasComandasDoDia = { ...prev[dataSelecionada] };
      delete novasComandasDoDia[id];
      return {
        ...prev,
        [dataSelecionada]: novasComandasDoDia
      };
    });

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

  // Excluir comanda (remove comanda da data)
  const excluirComanda = (mesaId) => {
    if (!window.confirm("Tem certeza que deseja excluir essa comanda?")) return;

    setComandas(prev => {
      const novasComandasDoDia = { ...prev[dataSelecionada] };
      delete novasComandasDoDia[mesaId];
      return {
        ...prev,
        [dataSelecionada]: novasComandasDoDia
      };
    });

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Calcular total da comanda
  const calcularTotal = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return 0;
    return com.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  // Calcular total geral do dia
  const totalGeral = () => {
    const coms = comandasDoDia;
    if (!coms) return 0;
    return Object.values(coms).reduce((acc, c) => {
      if (!c || Array.isArray(c)) return acc;
      return acc + c.itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);
    }, 0);
  };

  // Imprimir todas as comandas do dia (nova funcionalidade) - ADICIONADO
  const imprimirTodasComandas = () => {
    const janela = window.open('', 'Imprimir Comandas');
    if (!janela) return alert("Não foi possível abrir a janela de impressão.");

    let html = `<html><head><title>Comandas do dia ${dataSelecionada}</title>`;
    html += `<style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h2 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    </style></head><body>`;
    html += `<h1>Comandas do dia ${dataSelecionada}</h1>`;

    Object.entries(comandasDoDia).forEach(([mesaId, comanda]) => {
      if (!comanda || Array.isArray(comanda) || comanda.itens.length === 0) return;

      html += `<h2>Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId} - Status: ${comanda.status}</h2>`;
      html += `<table><thead><tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Total</th></tr></thead><tbody>`;

      comanda.itens.forEach(i => {
        html += `<tr>
          <td>${i.nome}</td>
          <td>${i.quantidade}</td>
          <td>R$ ${i.preco.toFixed(2)}</td>
          <td>R$ ${(i.preco * i.quantidade).toFixed(2)}</td>
        </tr>`;
      });

      const total = comanda.itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
      html += `<tr><td colspan="3"><b>Total</b></td><td><b>R$ ${total.toFixed(2)}</b></td></tr>`;
      html += `</tbody></table>`;
    });

    html += `</body></html>`;
    janela.document.write(html);
    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  };

  // Filtrar mesas para exibir de acordo com a opção de mostrar/ocultar finalizadas
  const mesasFiltradas = mostrarFinalizadas
    ? mesas
    : mesas.filter(mesa => {
      const com = comandasDoDia[mesa.id];
      return !com || com.status !== "Finalizada";
    });

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Controle de Comandas do Restaurante</h1>

      <div style={{ marginBottom: 20 }}>
        <label>
          Data:{" "}
          <input
            type="date"
            value={dataSelecionada}
            onChange={e => setDataSelecionada(e.target.value)}
          />
        </label>

        <button onClick={adicionarMesa} style={{ marginLeft: 10 }}>
          + Adicionar Mesa
        </button>

        <button onClick={imprimirTodasComandas} style={{ marginLeft: 10 }}>
          Imprimir Todas as Comandas do Dia
        </button>

        <label style={{ marginLeft: 20 }}>
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
          />{" "}
          Mostrar Mesas Finalizadas
        </label>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1, border: "1px solid #ccc", padding: 10 }}>
          <h2>Mesas</h2>
          {mesasFiltradas.length === 0 && <p>Nenhuma mesa para exibir.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mesasFiltradas.map(mesa => {
              const comanda = comandasDoDia[mesa.id];
              return (
                <li
                  key={mesa.id}
                  style={{
                    marginBottom: 5,
                    cursor: "pointer",
                    padding: 5,
                    backgroundColor:
                      mesaSelecionada === mesa.id ? "#d0f0d0" : "#f0f0f0",
                    borderRadius: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => setMesaSelecionada(mesa.id)}
                  title={comanda ? `Status: ${comanda.status}` : "Sem comanda"}
                >
                  <span>
                    {mesa.nome}{" "}
                    {comanda && (
                      <strong>
                        (R$ {calcularTotal(mesa.id).toFixed(2)} - {comanda.status})
                      </strong>
                    )}
                  </span>
                  <span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        editarNomeMesa(mesa.id);
                      }}
                      style={{ marginRight: 5 }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        excluirMesa(mesa.id);
                      }}
                      title="Excluir mesa"
                      style={{ color: "red" }}
                    >
                      🗑️
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{ flex: 2, border: "1px solid #ccc", padding: 10 }}>
          <h2>Comanda da Mesa {mesaSelecionada ? mesas.find(m => m.id === mesaSelecionada)?.nome : ""}</h2>
          {mesaSelecionada && comandasDoDia[mesaSelecionada] ? (
            <>
              <button onClick={() => toggleStatus(mesaSelecionada)}>
                {comandasDoDia[mesaSelecionada].status === "Aberta"
                  ? "Finalizar Comanda"
                  : "Reabrir Comanda"}
              </button>
              <button onClick={() => limparComanda(mesaSelecionada)} style={{ marginLeft: 5 }}>
                Limpar Comanda
              </button>
              <button onClick={() => excluirComanda(mesaSelecionada)} style={{ marginLeft: 5, color: "red" }}>
                Excluir Comanda
              </button>

              <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
                {comandasDoDia[mesaSelecionada].itens.map(item => (
                  <li key={item.nome} style={{ marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
                    <span>
                      {item.nome} - {item.quantidade} x R$ {item.preco.toFixed(2)} = R$ {(item.quantidade * item.preco).toFixed(2)}
                    </span>
                    <button onClick={() => removerItem(mesaSelecionada, item.nome)} style={{ color: "red" }}>
                      ❌
                    </button>
                  </li>
                ))}
              </ul>

              <h3>Total: R$ {calcularTotal(mesaSelecionada).toFixed(2)}</h3>
            </>
          ) : (
            <p>Selecione uma mesa para ver a comanda.</p>
          )}
        </div>

        <div style={{ flex: 3, border: "1px solid #ccc", padding: 10 }}>
          <h2>Cardápio</h2>
          {categoriasOrdenadas.map(categoria => (
            <div key={categoria}>
              <h3>{categoria}</h3>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: 10 }}>
                {produtosPorCategoria[categoria].map(produto => (
                  <li key={produto.nome}>
                    <button
                      onClick={() => adicionarItem(produto)}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: 4,
                        border: "1px solid #888",
                        backgroundColor: "#fff",
                      }}
                      title={`R$ ${produto.preco.toFixed(2)}`}
                    >
                      {produto.nome}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Total Geral do Dia: R$ {totalGeral().toFixed(2)}</h2>
      </div>
    </div>
  );
}

export default App;
