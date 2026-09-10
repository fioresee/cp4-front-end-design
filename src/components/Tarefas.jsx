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
    <div className="">
      <h2 className="">Minha Lista de Tarefas</h2>

      <form onSubmit={AdicionarTarefa} className="">
        <input
          type="text"
          value={campo}
          onChange={(e) => setCampo(e.target.value)}
          placeholder="Digite o nome da tarefa..."
          className=""
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className=""
        />
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva a tarefa..."
          className=""
        />
        <input
          type="text"
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
          placeholder="Nível de prioridade da tarefa..."
          className=""
        />
        <button type="submit" className="">
          Adicionar
        </button>
      </form>
        {/* Callbacks executados ao clicar nos botões para alterar o filtro das tarefas. */}
      <div className=""> 
        <button onClick={() => setFiltro('todas')} className="">Todas</button> 
        <button onClick={() => setFiltro('pendentes')} className="">Pendentes</button>
        <button onClick={() => setFiltro('concluidas')} className="">Concluídas</button>
      </div>

      <ul className="">
            {/* 
                map percorre o array de tarefas e cria um elemento <li>
                para cada tarefa. O "(tarefa) =>" é um callback executado
                para cada elemento do array.
            */}        {tarefasFiltradas.map((tarefa) => (
          <li
            key={tarefa.id}
            className=""
          >
            <span
              style={{ textDecoration: tarefa.concluida ? 'line-through' : 'none'}}
              className=""
            > 
              {`Nome: ${tarefa.text} \nData: ${tarefa.data} \nDescrição: ${tarefa.descricao} \nPrioridade: ${tarefa.prioridade}`}
            </span>
            <div className=""> {/*Callback executado ao clicar no botão para alterar
                                                 o status da tarefa entre concluída e pendente.*/}
              <button onClick={() => alternarTarefa(tarefa.id)} className="">
                {tarefa.concluida ? 'Editar' : 'Concluir'}
              </button> {/* Callback executado ao clicar em Excluir,
                            passando o ID da tarefa para a função removerTarefa. */}
              <button onClick={() => removerTarefa(tarefa.id)} className=""> 
                Excluir 
              </button> 
            </div>
            
          </li>
        ))}
      </ul>

      {tarefasFiltradas.length === 0 && <p className="">Nenhuma tarefa salva.</p>}
    </div>
  )
}

export default Tarefas