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
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  useEffect(() => { localStorage.setItem("mesas", JSON.stringify(mesas)); }, [mesas]);
  useEffect(() => { localStorage.setItem("comandas", JSON.stringify(comandas)); }, [comandas]);
  useEffect(() => { localStorage.setItem("dataSelecionada", dataSelecionada); }, [dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim()) setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
  };

  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }
    const mesaId = mesaSelecionada;
    const com = comandasDoDia[mesaId];
    const comanda = com && !Array.isArray(com) ? { ...com } : { status: "Aberta", itens: [] };
    if (!Array.isArray(comanda.itens)) comanda.itens = [];

    const idx = comanda.itens.findIndex(i => i.nome === item.nome);
    if (idx >= 0) comanda.itens[idx].quantidade += 1;
    else comanda.itens.push({ ...item, quantidade: 1 });

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: comanda,
      }
    }));
  };

  const imprimirTodasComandas = () => {
    const janela = window.open('', '', 'width=600,height=600');
    janela.document.write('<html><head><title>Impressão de Comandas</title></head><body>');
    janela.document.write(`<h2>Comandas do dia: ${dataSelecionada}</h2>`);
    Object.entries(comandasDoDia).forEach(([mesaId, comanda]) => {
      if (!comanda) return;
      janela.document.write(`<div style="margin-bottom:20px;">`);
      janela.document.write(`<h3>Mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId} (${comanda.status})</h3>`);
      janela.document.write('<table border="1" cellspacing="0" cellpadding="4" width="100%">');
      janela.document.write('<tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr>');
      comanda.itens.forEach(item => {
        janela.document.write(`<tr><td>${item.nome}</td><td>${item.quantidade}</td><td>R$ ${item.preco.toFixed(2)}</td><td>R$ ${(item.preco * item.quantidade).toFixed(2)}</td></tr>`);
      });
      const total = comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0);
      janela.document.write(`</table><p><strong>Total: R$ ${total.toFixed(2)}</strong></p>`);
      janela.document.write(`</div>`);
    });
    janela.document.write('</body></html>');
    janela.document.close();
    janela.print();
  };

  const totalGeral = Object.values(comandasDoDia).reduce((acc, comanda) => {
    if (!comanda || Array.isArray(comanda)) return acc;
    return acc + comanda.itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);
  }, 0);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Sistema de Comandas</h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <label>Data: </label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </div>
        <button onClick={adicionarMesa}>+ Adicionar Mesa</button>
        <button onClick={imprimirTodasComandas}>🖨️ Imprimir Todas Comandas</button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: "25%" }}>
          <h2>Mesas</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mesas.map(m => (
              <li
                key={m.id}
                onClick={() => setMesaSelecionada(m.id)}
                style={{
                  cursor: "pointer",
                  padding: 8,
                  backgroundColor: m.id === mesaSelecionada ? "#cce5ff" : "#f0f0f0",
                  marginBottom: 5,
                  borderRadius: 4
                }}
              >
                {m.nome}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ width: "75%" }}>
          {mesaSelecionada ? (
            <>
              <h2>Comanda - {mesas.find(m => m.id === mesaSelecionada)?.nome}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {categoriasOrdenadas.map(cat => (
                  <div key={cat} style={{ width: "100%" }}>
                    <h3>{cat}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {produtosPorCategoria[cat].map(prod => (
                        <button
                          key={prod.nome}
                          onClick={() => adicionarItem(prod)}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 4,
                            background: "#fff",
                            border: "1px solid #ccc",
                            cursor: "pointer"
                          }}
                        >
                          {prod.nome} <br />
                          <strong>R$ {prod.preco.toFixed(2)}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Selecione uma mesa para começar</p>
          )}
        </div>
      </div>

      <footer style={{ marginTop: 20 }}>
        <h3>Total Geral do Dia: R$ {totalGeral.toFixed(2)}</h3>
      </footer>
    </div>
  );
}

export default App;
