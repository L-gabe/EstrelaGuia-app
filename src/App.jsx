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
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);

  useEffect(() => { localStorage.setItem("mesas", JSON.stringify(mesas)); }, [mesas]);
  useEffect(() => { localStorage.setItem("comandas", JSON.stringify(comandas)); }, [comandas]);
  useEffect(() => { localStorage.setItem("dataSelecionada", dataSelecionada); }, [dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  const adicionarMesa = () => {
    const nome = prompt("Nome da nova mesa:");
    if (nome && nome.trim()) setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Novo nome da mesa:");
    if (novoNome && novoNome.trim()) setMesas(prev => prev.map(m => (m.id === id ? { ...m, nome: novoNome.trim() } : m)));
  };

  const excluirMesa = (id) => {
    if (!window.confirm("Excluir mesa? Isso remove a comanda também.")) return;
    setMesas(prev => prev.filter(m => m.id !== id));
    const novasComandas = { ...comandasDoDia };
    delete novasComandas[id];
    setComandas(prev => ({ ...prev, [dataSelecionada]: novasComandas }));
    if (mesaSelecionada === id) setMesaSelecionada(null);
  };

  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa antes.");
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
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: comanda },
    }));
  };

  const removerItem = (mesaId, nomeItem) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;
    const comanda = { ...com };
    comanda.itens = comanda.itens.filter(i => i.nome !== nomeItem);
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: comanda },
    }));
  };

  const toggleStatus = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;
    const novoStatus = com.status === "Finalizada" ? "Aberta" : "Finalizada";
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: { ...com, status: novoStatus } },
    }));
  };

  const limparComanda = (mesaId) => {
    const com = comandasDoDia[mesaId];
    if (!com || Array.isArray(com)) return;
    const comanda = { ...com, itens: [], status: "Aberta" };
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: { ...comandasDoDia, [mesaId]: comanda },
    }));
  };

  const excluirComanda = (mesaId) => {
    if (!window.confirm("Excluir essa comanda?")) return;
    const novas = { ...comandasDoDia };
    delete novas[mesaId];
    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novas,
    }));
    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  const limparTudo = () => {
    if (!window.confirm("Deseja realmente limpar tudo?")) return;
    setMesas([]);
    setComandas(prev => ({ ...prev, [dataSelecionada]: {} }));
    setMesaSelecionada(null);
  };

  const imprimirTodasComandas = () => {
    const todas = comandasDoDia;
    if (Object.keys(todas).length === 0) {
      alert("Nenhuma comanda para imprimir.");
      return;
    }

    let printContent = `<h2>Comandas do Dia ${dataSelecionada}</h2>`;
    Object.entries(todas).forEach(([mesaId, comanda]) => {
      if (!comanda || Array.isArray(comanda)) return;
      const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;
      printContent += `
        <div style="margin-bottom:10px; padding:4px; border-bottom:1px dashed #000;">
        <h4>Mesa: ${nomeMesa} (${comanda.status})</h4>
        <ul>
          ${comanda.itens.map(i => `<li>${i.nome} x${i.quantidade} = R$${(i.preco * i.quantidade).toFixed(2)}</li>`).join("")}
        </ul>
        <strong>Total: R$${comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0).toFixed(2)}</strong>
        </div>
      `;
    });

    const janela = window.open("", "", "width=400,height=600");
    janela.document.write(`<html><head><title>Imprimir Todas</title></head><body>`);
    janela.document.write(printContent);
    janela.document.write(`</body></html>`);
    janela.document.close();
    janela.print();
  };

  const totalGeral = Object.values(comandasDoDia).reduce((acc, com) => {
    if (!com || Array.isArray(com)) return acc;
    return acc + com.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
  }, 0);

  const mesasAbertas = mesas.filter(m => !comandasDoDia[m.id] || comandasDoDia[m.id]?.status !== "Finalizada");
  const mesasFinalizadas = mesas.filter(m => comandasDoDia[m.id]?.status === "Finalizada");

  const imprimirMesa = (mesaId) => {
    const comanda = comandasDoDia[mesaId];
    if (!comanda || Array.isArray(comanda)) {
      alert("Não há comanda para esta mesa.");
      return;
    }
    const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;
    const content = `
      <div>
        <h3>Comanda Mesa: ${nomeMesa}</h3>
        <ul>
          ${comanda.itens.map(i => `<li>${i.nome} x${i.quantidade} = R$${(i.preco * i.quantidade).toFixed(2)}</li>`).join('')}
        </ul>
        <p><strong>Total: R$${comanda.itens.reduce((a, i) => a + i.preco * i.quantidade, 0).toFixed(2)}</strong></p>
      </div>
    `;
    const janela = window.open('', '', 'width=400,height=600');
    janela.document.write(`<html><head><title>Imprimir</title></head><body>${content}</body></html>`);
    janela.document.close();
    janela.print();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Controle de Comandas</h1>
      <div>
        <label>Data:</label>
        <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
        <button onClick={adicionarMesa}>+ Mesa</button>
        <button onClick={imprimirTodasComandas}>🖨️ Imprimir Todas</button>
        <button onClick={limparTudo} style={{ background: "#e74c3c", color: "#fff", marginLeft: 5 }}>Limpar Tudo</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Mesas Abertas</h3>
          <ul>
            {mesasAbertas.map(mesa => (
              <li key={mesa.id}>
                <button onClick={() => setMesaSelecionada(mesa.id)}>{mesa.nome}</button>
              </li>
            ))}
          </ul>

          <h3 style={{ cursor: "pointer" }} onClick={() => setMostrarFinalizadas(!mostrarFinalizadas)}>
            Mesas Finalizadas {mostrarFinalizadas ? "▲" : "▼"}
          </h3>
          {mostrarFinalizadas && (
            <ul>
              {mesasFinalizadas.map(mesa => (
                <li key={mesa.id}>
                  <button onClick={() => setMesaSelecionada(mesa.id)}>{mesa.nome}</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ flex: 3 }}>
          {mesaSelecionada && (
            <div>
              <h2>Comanda da Mesa: {mesas.find(m => m.id === mesaSelecionada)?.nome}</h2>
              <div>
                {(comandasDoDia[mesaSelecionada]?.itens || []).map(item => (
                  <div key={item.nome}>
                    {item.nome} x{item.quantidade} = R$ {(item.preco * item.quantidade).toFixed(2)}
                    <button onClick={() => removerItem(mesaSelecionada, item.nome)}>Remover</button>
                  </div>
                ))}
              </div>
              <div>
                <button onClick={() => toggleStatus(mesaSelecionada)}>Alterar Status</button>
                <button onClick={() => limparComanda(mesaSelecionada)}>Limpar</button>
                <button onClick={() => excluirComanda(mesaSelecionada)}>Excluir</button>
                <button onClick={() => imprimirMesa(mesaSelecionada)}>Imprimir</button>
              </div>
            </div>
          )}

          <div>
            {categoriasOrdenadas.map(c => (
              <div key={c}>
                <h3>{c}</h3>
                {produtosPorCategoria[c].map(p => (
                  <button key={p.nome} onClick={() => adicionarItem(p)}>
                    {p.nome} - R$ {p.preco}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 20, fontWeight: "bold" }}>
        Total Geral do Dia: R$ {totalGeral.toFixed(2)}
      </footer>
    </div>
  );
}

export default App;
