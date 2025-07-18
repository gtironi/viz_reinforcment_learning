// Função para executar e gerar os dados do Q-learning
export function q_learning({
    world_width = 5,
    world_height = 5,
    alpha = 0.1,
    gamma = 0.9,
    epsilon = 0.1,
    epsilon_decay = 0.003,
    num_episodes = 1000,
    max_steps = 9 ,
    step_punishment = -1,
    hole_punishment = -100,
    goal_reward = 100,
    start = [0, 0],
    goal = [4, 4],
    holes = [[1, 2], [2, 3], [3, 1], [4, 0], [0, 2], [4, 3]],
} = {}) {

    // Ações do agente
    const ACTIONS = ['up', 'down', 'left', 'right'];

    // Gerando o gridworld
    const grid = Array.from({ length: world_height }, () =>
        Array.from({ length: world_width }, () => ' ')
    );

    // Configurando as casas de início e de fim
    grid[start[0]][start[1]] = 'S';
    grid[goal[0]][goal[1]] = 'G';

    // Colocando os buracos
    for (const [r, c] of holes) {
        
        if ((r !== start[0] || c !== start[1]) && (r !== goal[0] || c !== goal[1])) {
            grid[r][c] = 'H';
        }
    }

    // Função para calcular o estado resultante da execução de uma ação em um estado
    function nextState([r, c], action) {
        switch (action) {
            case 'up': return [Math.max(0, r - 1), c];
            case 'down': return [Math.min(world_height - 1, r + 1), c];
            case 'left': return [r, Math.max(0, c - 1)];
            case 'right': return [r, Math.min(world_width - 1, c + 1)];
        }
    }

    // Função para obter a recompensa de um estado
    function getReward([r, c]) {
        if (grid[r][c] === 'H') return hole_punishment;
        if (grid[r][c] === 'G') return goal_reward;
        return step_punishment;
    }

    // Inicializando a Q-table
    const Q = {};
    for (let r = 0; r < world_height; r++) {
        for (let c = 0; c < world_width; c++) {
            Q[`${r},${c}`] = {};
            for (const a of ACTIONS) {
                Q[`${r},${c}`][a] = 0;
            }
        }
    }

    // Função para escolher uma ação com base na política epsilon-greedy
    function chooseAction(state) {
        if (Math.random() < epsilon) {
            return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        }
        const qs = Q[state];
        let bestA = ACTIONS[0];
        for (const a of ACTIONS) {
            if (qs[a] > qs[bestA]) bestA = a;
        }
        return bestA;
    }

    // Listas para guardar os dados
    const all_agent_positions = [];
    var agent_positions = [];
    const all_q_tables = [];
    var q_tables = []
    const recentResults = [];
    const success_rates = [];

    // Tamanho da janela de cálculo da média móvel de sucessos
    let window_size;

    if (num_episodes >= 500) {
        window_size = 100;
    } else if (num_episodes >= 250) {
        window_size = 50;
    } else {
        window_size = 20;
    }

    // Para cada episódio...
    for (let episode = 1; episode <= num_episodes; episode++) {
        // Inicia as listas do episódio
        agent_positions = [];
        q_tables = [];

        // Inicia o agente no início
        let [r, c] = start;
        agent_positions.push([r, c]);

        q_tables.push(JSON.parse(JSON.stringify(Q)));

        let reachedGoal = false;

        // Para cada passo...
        for (let step = 0; step < max_steps; step++) {
            const stateKey = `${r},${c}`;
            // Escolhe uma ação e a executa
            const action = chooseAction(stateKey);
            const [nr, nc] = nextState([r, c], action);
            const nextKey = `${nr},${nc}`;

            // Pega a recompensa e atualiza a Q-table
            const reward = getReward([nr, nc]);
            const maxQNext = Math.max(...Object.values(Q[nextKey]));

            Q[stateKey][action] += alpha * (reward + gamma * maxQNext - Q[stateKey][action]);

            // Salva os dados
            agent_positions.push([nr, nc]);
            q_tables.push(JSON.parse(JSON.stringify(Q)));

            // Se for a meta, ganhou
            if (grid[nr][nc] === 'G') {
                reachedGoal = true;
                break;
            }
            // Se for um buraco, perdeu
            if (grid[nr][nc] === 'H') break;

            // Avança o agente
            [r, c] = [nr, nc];
        }

        // Diminui o epsilon
        epsilon *= epsilon_decay;

        // Armazena se foi sucesso
        recentResults.push(reachedGoal ? 1 : 0);
        if (recentResults.length > window_size) recentResults.shift();

        // Calcula a taxa móvel de sucessos
        const sum = recentResults.reduce((a, b) => a + b, 0);
        const rate = (sum / recentResults.length * 100).toFixed(1);

        // Salva todos os dados do episódio
        all_agent_positions.push(agent_positions);
        all_q_tables.push(q_tables);
        success_rates.push(rate);
    }

    return {
        agent_positions: all_agent_positions,
        q_tables: all_q_tables,
        success_rates: success_rates
    };
}