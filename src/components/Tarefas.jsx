import { useState, useEffect } from 'react' // useState e useEffect são Hooks do React usados para controlar estados e executar efeitos no componente

const Tarefas = () => {

  const [tarefas, setTarefas] = useState(() => { // useState cria o estado tarefas e permite armazenar e atualizar a lista de tarefas
    const salvarTarefas = localStorage.getItem("item-tarefa");
    return salvarTarefas ? JSON.parse(salvarTarefas) : [];
  });

  const [campo, setCampo] = useState("");        // controla o valor digitado no campo de nome da tarefa
  const [data, setData] = useState("");           // controla a data informada pelo usuário
  const [descricao, setDescricao] = useState(""); // controla a descrição da tarefa
  const [prioridade, setPrioridade] = useState(""); // controla o nível de prioridade da tarefa
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    localStorage.setItem("item-tarefa", JSON.stringify(tarefas)); // salva as tarefas no localStorage sempre que o estado tarefas é alterado
  }, [tarefas]);

  const AdicionarTarefa = (e) => {
    e.preventDefault();
    if (!campo.trim() || !data.trim() || !descricao.trim() || !prioridade.trim()) return;

    const novaTarefa = {
      id: Date.now(),
      text: campo,
      data: data,
      descricao: descricao,
      prioridade: prioridade,
      concluida: false
    };

    setTarefas([...tarefas, novaTarefa]);

    setCampo("");
    setData("");
    setDescricao("");
    setPrioridade("");
  };

  const removerTarefa = (id) => {
    // filter cria um novo array removendo a tarefa que possui o ID selecionado
    //// O "(tarefa) => tarefa.id !== id" é um callback executado para cada tarefa.
    const apagarTarefa = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(apagarTarefa);
  };

  const alternarTarefa = (id) => {
    //// map percorre todas as tarefas e cria um novo array
    // O callback verifica qual tarefa foi selecionada e altera
    // o seu status de concluída
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    ));
  };
// filter cria um novo array contendo somente as tarefas
// de acordo com o filtro selecionado
// O "tarefa =>" é um callback executado para cada tarefa
  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtro === 'pendentes') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true; // 'todas'
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-300 rounded-2xl shadow-lg border border-gray-900">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Minha Lista de Tarefas</h2>

      <form onSubmit={AdicionarTarefa} className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          value={campo}
          onChange={(e) => setCampo(e.target.value)}
          placeholder="Digite o nome da tarefa..."
          className="flex-1 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-gray-950"
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-gray-950"
        />
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva a tarefa..."
          className="flex-1 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-gray-950"
        />
        <input
          type="text"
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
          placeholder="Nível de prioridade da tarefa..."
          className="flex-1 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-gray-950"
        />
        <button type="submit" className="bg-gray-500 hover:bg-blue-900 text-white font-medium px-5 py-2 rounded-2xl transition-colors ">
          Adicionar
        </button>
      </form>
        {/* Callbacks executados ao clicar nos botões para alterar o filtro das tarefas. */}
      <div className="flex gap-2 mb-4 justify-center"> 
        <button onClick={() => setFiltro('todas')} className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-400 cursor-pointer transition-transform duration-300 hover:-translate-y-2">Todas</button> 
        <button onClick={() => setFiltro('pendentes')} className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-400 cursor-pointer transition-transform duration-300 hover:-translate-y-2">Pendentes</button>
        <button onClick={() => setFiltro('concluidas')} className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-400 cursor-pointer transition-transform duration-300 hover:-translate-y-2">Concluídas</button>
      </div>

      <ul className="flex flex-col gap-2">
            {/* 
                map percorre o array de tarefas e cria um elemento <li>
                para cada tarefa. O "(tarefa) =>" é um callback executado
                para cada elemento do array.
            */}        {tarefasFiltradas.map((tarefa) => (
          <li
            key={tarefa.id}
            className="flex items-center justify-between p-3 bg-blue-200 border border-blue-600 rounded-2xl shadow-xl hover:bg-b-400 transition-colors"
          >
            <span
              style={{ textDecoration: tarefa.concluida ? 'line-through' : 'none'}}
              className="flex-1 justify-center text-gray-950 whitespace-pre-line"
            > 
              {`Nome: ${tarefa.text} \nData: ${tarefa.data} \nDescrição: ${tarefa.descricao} \nPrioridade: ${tarefa.prioridade}`}
            </span>
            <div className="flex gap-2 ml-2"> {/*Callback executado ao clicar no botão para alterar
                                                 o status da tarefa entre concluída e pendente.*/}
              <button onClick={() => alternarTarefa(tarefa.id)} className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer hover:text-green-900 hover:font-bold transition-transform duration-300 hover:-translate-y-2 ">
                {tarefa.concluida ? 'Editar' : 'Concluir'}
              </button> {/* Callback executado ao clicar em Excluir,
                            passando o ID da tarefa para a função removerTarefa. */}
              <button onClick={() => removerTarefa(tarefa.id)} className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer hover:text-red-600 hover:font-bold transition-transform duration-300 hover:-translate-y-2"> 
                Excluir 
              </button> 
            </div>
            
          </li>
        ))}
      </ul>

      {tarefasFiltradas.length === 0 && <p className="text-center mt-4">Nenhuma tarefa salva.</p>}
    </div>
  )
}

export default Tarefas