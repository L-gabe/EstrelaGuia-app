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

export default function App() {
  const [mesas, setMesas] = useState(() => JSON.parse(localStorage.getItem("mesas")) || []);
  const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem("comandas")) || {});
  const [dataSelecionada, setDataSelecionada] = useState(() => localStorage.getItem("dataSelecionada") || new Date().toISOString().slice(0, 10));
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  // Salvar no localStorage sempre que alterar mesas, comandas ou dataSelecionada
  useEffect(() => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
    localStorage.setItem("comandas", JSON.stringify(comandas));
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [mesas, comandas, dataSelecionada]);

  const comandasDoDia = comandas[dataSelecionada] || {};

  // Funções para adicionar/editar mesas
  const adicionarMesa = () => {
    const nome = prompt("Digite o nome da nova mesa:");
    if (nome && nome.trim()) {
      setMesas(prev => [...prev, { id: Date.now().toString(), nome: nome.trim() }]);
    }
  };

  const editarNomeMesa = (id) => {
    const novoNome = prompt("Digite o novo nome da mesa:");
    if (novoNome && novoNome.trim()) {
      setMesas(prev => prev.map(mesa => (mesa.id === id ? { ...mesa, nome: novoNome.trim() } : mesa)));
    }
  };

  // Adicionar item na comanda da mesa selecionada (correção aqui)
  const adicionarItem = (item) => {
    if (!mesaSelecionada) {
      alert("Selecione uma mesa para adicionar itens.");
      return;
    }

    const mesaId = mesaSelecionada;

    // Pega a comanda atual da mesa, ou cria uma nova se não existir
    const comandaAtual = comandasDoDia[mesaId] || { status: "Aberta", itens: [] };

    // Cria uma cópia dos itens para evitar mutação direta
    const itensAtualizados = [...comandaAtual.itens];

    // Verifica se o item já existe
    const index = itensAtualizados.findIndex(i => i.nome === item.nome);
    if (index !== -1) {
      // Se existir, incrementa a quantidade
      itensAtualizados[index] = {
        ...itensAtualizados[index],
        quantidade: itensAtualizados[index].quantidade + 1,
      };
    } else {
      // Se não existir, adiciona novo item com quantidade 1
      itensAtualizados.push({ ...item, quantidade: 1 });
    }

    // Atualiza a comanda com os itens atualizados e mantém o status
    const novaComanda = {
      ...comandaAtual,
      itens: itensAtualizados,
    };

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: novaComanda,
      },
    }));
  };

  // Remover item da comanda
  const removerItem = (mesaId, nomeItem) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return;

    const itensAtualizados = comandaAtual.itens.filter(i => i.nome !== nomeItem);

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comandaAtual, itens: itensAtualizados },
      },
    }));
  };

  // Alternar status Aberta/Finalizada
  const toggleStatus = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return;
    const novoStatus = comandaAtual.status === "Finalizada" ? "Aberta" : "Finalizada";

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comandaAtual, status: novoStatus },
      },
    }));
  };

  // Limpar itens da comanda
  const limparComanda = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return;

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: {
        ...comandasDoDia,
        [mesaId]: { ...comandaAtual, itens: [], status: "Aberta" },
      },
    }));
  };

  // Excluir comanda da mesa (remove do histórico do dia)
  const excluirComanda = (mesaId) => {
    const novasComandas = { ...comandasDoDia };
    delete novasComandas[mesaId];

    setComandas(prev => ({
      ...prev,
      [dataSelecionada]: novasComandas,
    }));

    if (mesaSelecionada === mesaId) setMesaSelecionada(null);
  };

  // Total de uma comanda
  const totalComanda = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return 0;

    return comandaAtual.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  // Total geral do dia
  const totalGeral = () => {
    return Object.keys(comandasDoDia).reduce((acc, mesaId) => {
      return acc + totalComanda(mesaId);
    }, 0);
  };

  // Impressão da comanda individual
  const imprimirComanda = (mesaId) => {
    const comandaAtual = comandasDoDia[mesaId];
    if (!comandaAtual) return;

    let texto = `Comanda da mesa: ${mesas.find(m => m.id === mesaId)?.nome || mesaId}\n`;
    texto += `Status: ${comandaAtual.status}\n`;
    texto += "Itens:\n";
    comandaAtual.itens.forEach(i => {
      texto += `${i.nome} x${i.quantidade} - R$${(i.preco * i.quantidade).toFixed(2)}\n`;
    });
    texto += `Total: R$${totalComanda(mesaId).toFixed(2)}\n`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<pre>${texto}</pre>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Impressão de todas as comandas do dia
  const imprimirTodas = () => {
    let texto = `Comandas do dia ${dataSelecionada}\n\n`;

    Object.keys(comandasDoDia).forEach(mesaId => {
      const comandaAtual = comandasDoDia[mesaId];
      const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;

      texto += `Mesa: ${nomeMesa}\n`;
      texto += `Status: ${comandaAtual.status}\n`;
      comandaAtual.itens.forEach(i => {
        texto += `${i.nome} x${i.quantidade} - R$${(i.preco * i.quantidade).toFixed(2)}\n`;
      });
      texto += `Total: R$${totalComanda(mesaId).toFixed(2)}\n\n`;
    });

    texto += `Total Geral: R$${totalGeral().toFixed(2)}\n`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<pre>${texto}</pre>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Renderização da lista de mesas para seleção
  const renderMesas = () => (
    <div style={{ marginBottom: 20 }}>
      <button onClick={adicionarMesa}>Adicionar Mesa</button>
      {mesas.map(mesa => (
        <div key={mesa.id} style={{ marginTop: 10 }}>
          <button
            style={{
              backgroundColor: mesaSelecionada === mesa.id ? "#4caf50" : "",
              color: mesaSelecionada === mesa.id ? "white" : "",
              marginRight: 10,
            }}
            onClick={() => setMesaSelecionada(mesa.id)}
          >
            {mesa.nome}
          </button>
          <button onClick={() => editarNomeMesa(mesa.id)}>Editar Nome</button>
        </div>
      ))}
    </div>
  );

  // Renderiza as comandas (abertas ou finalizadas) separadas
  const renderComandas = () => {
    const mesasFiltradas = Object.entries(comandasDoDia).filter(
      ([mesaId, comanda]) => (mostrarFinalizadas ? comanda.status === "Finalizada" : comanda.status === "Aberta")
    );

    if (mesasFiltradas.length === 0) {
      return <p>Nenhuma comanda {mostrarFinalizadas ? "finalizada" : "aberta"} para essa data.</p>;
    }

    return mesasFiltradas.map(([mesaId, comanda]) => {
      const nomeMesa = mesas.find(m => m.id === mesaId)?.nome || mesaId;

      return (
        <div
          key={mesaId}
          style={{
            border: "1px solid black",
            padding: 10,
            marginBottom: 10,
            backgroundColor: comanda.status === "Finalizada" ? "#eee" : "white",
          }}
        >
          <h3>{nomeMesa} ({comanda.status})</h3>
          <ul>
            {comanda.itens.map((item, i) => (
              <li key={i} style={{ cursor: "pointer" }} onClick={() => removerItem(mesaId, item.nome)}>
                {item.nome} x{item.quantidade} - R${(item.preco * item.quantidade).toFixed(2)} (Clique para remover)
              </li>
            ))}
          </ul>
          <p>Total: R${totalComanda(mesaId).toFixed(2)}</p>
          <button onClick={() => toggleStatus(mesaId)}>
            {comanda.status === "Aberta" ? "Finalizar" : "Reabrir"}
          </button>
          <button onClick={() => limparComanda(mesaId)}>Limpar Itens</button>
          <button onClick={() => excluirComanda(mesaId)}>Excluir Comanda</button>
          <button onClick={() => imprimirComanda(mesaId)}>Imprimir Comanda</button>
        </div>
      );
    });
  };

  // Renderiza o cardápio por categoria
  const renderCardapio = () => (
    <div>
      {categoriasOrdenadas.map(categoria => (
        <div key={categoria} style={{ marginBottom: 20 }}>
          <h4>{categoria}</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {produtosPorCategoria[categoria].map(produto => (
              <button
                key={produto.nome}
                onClick={() => adicionarItem(produto)}
                style={{ padding: "5px 10px", cursor: "pointer" }}
              >
                {produto.nome} - R${produto.preco.toFixed(2)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Sistema de Comandas</h1>

      <label>
        Selecione a data:
        <input
          type="date"
          value={dataSelecionada}
          onChange={e => setDataSelecionada(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </label>

      <div style={{ marginTop: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={mostrarFinalizadas}
            onChange={e => setMostrarFinalizadas(e.target.checked)}
          />
          Mostrar comandas finalizadas
        </label>
      </div>

      <hr />

      {renderMesas()}

      <hr />

      <h2>Cardápio</h2>
      {mesaSelecionada ? (
        <>
          <p>Mesa selecionada: {mesas.find(m => m.id === mesaSelecionada)?.nome}</p>
          {renderCardapio()}
        </>
      ) : (
        <p>Selecione uma mesa para adicionar itens.</p>
      )}

      <hr />

      <h2>Comandas {mostrarFinalizadas ? "Finalizadas" : "Abertas"}</h2>
      {renderComandas()}

      <hr />

      <h2>Total Geral do Dia: R${totalGeral().toFixed(2)}</h2>
      <button onClick={imprimirTodas}>Imprimir Todas as Comandas</button>
    </div>
  );
}
