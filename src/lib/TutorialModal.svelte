<script>
    import { onMount } from "svelte";
    import { q_learning } from "$lib/q_learning.js";
    import EnvironmentGrid from "$lib/EnvironmentGrid.svelte";
    import AccuracyChart from "$lib/AccuracyChart.svelte";
    import QTableArrows from "$lib/QTableArrows.svelte";
    import QTableValues from "$lib/QTableValues.svelte";
    import QCellActions from "$lib/QCellActions.svelte";
    import QValuesChart from "$lib/QValuesChart.svelte";
    import ControlsPanel from "$lib/Buttons.svelte";
    import Icon from "$lib/Icons.svelte";

    export let showModal;

    // --- Start of Q-Learning and Visualization State (Copied from +page.svelte) ---
    // Grid Params
    let world_width = 5;
    let world_height = 5;
    let start = [0, 0];
    let goal = [4, 4];
    let holes = [
        [1, 2],
        [2, 3],
        [3, 1],
        [4, 0],
        [0, 2],
        [4, 3],
    ];

    let alpha = 0.1;
    let gamma = 0.9;
    let epsilon = 0.1;
    let epsilon_decay = 0.003;
    let num_episodes = 1000;
    let max_steps = 9;

    let agent_positions_data = [];
    let q_tables_data = [];
    let success_rates_data = [];

    let currentEpisode = 0;
    let currentStep = 0;

    let playing = false;
    let intervalId;
    const speeds = [500, 100, 20, 1];
    let currentSpeedIndex = 0;
    let playSpeed = speeds[currentSpeedIndex];

    let globalMaxAbsQValue = 0;

    let inspectedRow = null;
    let inspectedCol = null;

    function getCellQValues(row, col, qTable) {
        if (!qTable) return { up: 0, down: 0, left: 0, right: 0 };
        const stateKey = `${row},${col}`;
        return qTable[stateKey] || { up: 0, down: 0, left: 0, right: 0 };
    }

    // A REATIVAÇÃO ABAIXO PODE ESTAR CAUSANDO O PROBLEMA "null,null"
    // Vamos ajustar como inspectedRow/inspectedCol são gerenciados.
    // Manteremos esta reativação para quando os valores *forem* definidos.
    $: qValuesForInspectedCell = getCellQValues(
        inspectedRow,
        inspectedCol,
        currentQTable,
    );

    $: currentAgentPosition =
        agent_positions_data[currentEpisode]?.[currentStep] || start;

    $: currentQTable = q_tables_data[currentEpisode]?.[currentStep];


    function initializeQLearning() {
        const { agent_positions, q_tables, success_rates } = q_learning({
            world_width,
            world_height,
            start,
            goal,
            holes,
            alpha,
            gamma,
            epsilon,
            epsilon_decay,
            num_episodes,
            max_steps,
        });
        agent_positions_data = agent_positions;
        q_tables_data = q_tables;
        success_rates_data = success_rates;
        currentEpisode = success_rates_data.length - 1;
        currentStep = 0;
    }

    // Tutorial-specific state
    let currentTutorialStep = 0;

const tutorialSteps = [
    {
        title: "Welcome to the Tutorial!",
        description: "This tutorial will guide you through the visualization, explaining how the Q-Learning algorithm works and how to interact with the environment.",
        setup: () => {
            currentEpisode = 0;
            currentStep = 0;
            inspectedRow = null;
            inspectedCol = null;
        }
    },
    {
        title: "Control Panel and Parameters",
        description: `The control panel at the top let you interact with the application: Adjust "Grid parameters" to change grid size and ghosts, "RL parameters" to modify algorithm settings or other options like control visualization speed. You can click on them.`,
        setup: () => {
            currentEpisode = success_rates_data.length - 1; // Show the final learned state
            currentStep = 0;
            inspectedRow = null; // Ensure no cell is inspected to show full Q-tables
            inspectedCol = null;
        }
    },
    {
        title: "The Gridworld Environment",
        description: "This is the Gridworld, where the Q-Learning agent learns. Pacman is the agent, the cherry is the goal, and ghosts are obstacles. Click on any cell to view specific information.",
        setup: () => {
            currentEpisode = 0;
            currentStep = 0;
            inspectedRow = null;
            inspectedCol = null;
        }
    },
    {
        title: "Success Rate Over Episodes",
        description: "This chart displays the agent's success rate in reaching the goal throughout training. A rising rate indicates learning. Click on the graph to jump to a specific episode.",
        setup: () => {
            currentEpisode = success_rates_data.length - 1;
            currentStep = 0;
            inspectedRow = null;
            inspectedCol = null;
        }
    },
    {
        title: "Q-Table: Action Arrows",
        description: "Each cell is a state, and arrows show the agent's preferred action based on Q-values. Larger signify higher (better) Q-values. This graph is not clickable.",
        setup: () => {
            currentEpisode = success_rates_data.length - 1;
            currentStep = 0;
            inspectedRow = null;
            inspectedCol = null;
        }
    },
    {
        title: "Q-Table: Numeric Values",
        description: "Here you can see the maximum Q-value for each cell. A visible white path to the goal indicates successful algorithm learning. This graph is not clickable.",
        setup: () => {
            currentEpisode = success_rates_data.length - 1;
            currentStep = 0;
            inspectedRow = null;
            inspectedCol = null;
        }
    },
    {
        title: "Inspect Individual Cells",
        description: "By clicking a cell in the main Gridworld, you can inspect it to see detailed Q-values for each action. For this tutorial, cell (2,2) is highlighted as an example. You can hover over the arrows to highlight the corresponding action in the sideline chart.",
        setup: (row = 2, col = 2) => { // Added default parameters for setup
            currentEpisode = success_rates_data.length - 1;
            currentStep = 0;
            inspectedRow = row; // Set inspectedRow directly
            inspectedCol = col; // Set inspectedCol directly
        }
    },
    {
        title: "Q-Values Chart (Inspected Cell)",
        description: "This chart shows how Q-values evolve for the currently inspected cell (e.g., cell (2,2) in this tutorial) across episodes, demonstrating the agent's learning process. You can click to go to a specific episode.",
        setup: (row = 2, col = 2) => { // Added default parameters for setup
            currentEpisode = success_rates_data.length - 1;
            currentStep = 0;
            inspectedRow = row; // Keep example inspected cell
            inspectedCol = col;
        }
    },
    {
        title: "End of Tutorial!",
        description: "You've completed the tutorial! You're now ready to explore the Q-Learning visualization independently. Have fun experimenting with parameters and observing the agent learn!",
        setup: () => {
            currentEpisode = 0;
            currentStep = 0;
            inspectedRow = null;
            inspectedCol = null;
        }
    }
];

    function nextTutorialStep() {
        if (currentTutorialStep < tutorialSteps.length - 1) {
            currentTutorialStep++;
            tutorialSteps[currentTutorialStep].setup();
        }
    }

    function prevTutorialStep() {
        if (currentTutorialStep > 0) {
            currentTutorialStep--;
            tutorialSteps[currentTutorialStep].setup();
        }
    }

    function closeTutorial() {
        showModal = false;
        currentTutorialStep = 0;
        initializeQLearning();
    }

    onMount(() => {
        initializeQLearning();
        tutorialSteps[currentTutorialStep].setup();
    });

     function nextStep() {
        if (!agent_positions_data[currentEpisode]) return;

        if (currentStep < agent_positions_data[currentEpisode].length - 1) {
            currentStep++;
        } else if (currentEpisode < agent_positions_data.length - 1) {
            currentEpisode++;
            currentStep = 0;
        } else {
            stopAnimation();
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
        } else if (currentEpisode > 0) {
            currentEpisode--;
            currentStep =
                (agent_positions_data[currentEpisode]?.length || 1) - 1;
        }
    }

    function togglePlay() {
        if (playing) {
            stopAnimation();
        } else if (
            !playing &&
            currentEpisode == success_rates_data.length - 1
        ) {
            currentEpisode = 0;
            startAnimation();
        } else {
            startAnimation();
        }
    }

    function startAnimation() {
        playing = true;
        clearInterval(intervalId);
        intervalId = setInterval(nextStep, playSpeed);
    }

    function stopAnimation() {
        playing = false;
        clearInterval(intervalId);
    }

    function goToEpisode(e) {
        const episodeNum = parseInt(e.target.value, 10);
        if (
            !isNaN(episodeNum) &&
            episodeNum >= 0 &&
            episodeNum < agent_positions_data.length
        ) {
            currentEpisode = episodeNum;
            currentStep = 0; // Reset step when changing episode
        }
    }

    function goToStep(e) {
        const stepNum = parseInt(e.target.value, 10);
        if (
            !isNaN(stepNum) &&
            stepNum >= 0 &&
            stepNum < (agent_positions_data[currentEpisode]?.length || 0)
        ) {
            currentStep = stepNum;
        }
    }

    // Função para alternar a velocidade de reprodução
    function togglePlaySpeed() {
        currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
        playSpeed = speeds[currentSpeedIndex];
        // Se estiver tocando, reinicia a animação com a nova velocidade
        if (playing) {
            startAnimation();
        }
    }
    let showParamGrid = false;
    let showParamRL = false;
     // Texto dinâmico para o botão de velocidade
    $: playSpeedText =
        currentSpeedIndex === 0
            ? "1X"
            : currentSpeedIndex === 1
              ? "2X"
              : currentSpeedIndex === 2
                ? "5X"
                : "10X";

    $: showParamGrid = false;
    function showParamSetter() {
        showParamGrid = true;
    }

    $: showParamRL = false;
    function showRLSetter() {
        console.log(showParamRL);
        showParamRL = true;
    }

    let width_icon = 19
</script>

{#if showModal}
    <div class="tutorial-modal-overlay" on:click={closeTutorial}>
        <div class="tutorial-modal-content" on:click|stopPropagation>
            <button class="close-button" on:click={closeTutorial}>
                x
            </button>

            <h2>{tutorialSteps[currentTutorialStep].title}</h2>
            <p class="info">{tutorialSteps[currentTutorialStep].description}</p>

            <div class="tutorial-visualization-area">
                {#if tutorialSteps[currentTutorialStep].title === "The Gridworld Environment"}
                    <div class="grid-container">
                        <EnvironmentGrid
                            world_width={world_width}
                            world_height={world_height}
                            start={start}
                            goal={goal}
                            holes={holes}
                            currentAgentPosition={currentAgentPosition}
                            bind:inspectedRow={inspectedRow}
                            bind:inspectedCol={inspectedCol}
                        />
                    </div>
                {:else if tutorialSteps[currentTutorialStep].title === "Success Rate Over Episodes"}
                    <div class="chart-container">
                        <AccuracyChart
                            success_rates_data={success_rates_data}
                            bind:currentEpisode={currentEpisode}
                            width={650} height={200} speedIndex={currentSpeedIndex}
                            playing={playing}
                        />
                    </div>
                {:else if tutorialSteps[currentTutorialStep].title === "Q-Table: Action Arrows"}
                    <div class="grid-container">
                        {#if currentQTable}
                            <QTableArrows
                                qTable={currentQTable}
                                {world_width}
                                {world_height}
                                {start}
                                {goal}
                                {holes}
                            />
                        {:else}
                            <p>Loading Q-table visualization (Arrows)...</p>
                        {/if}
                    </div>
                {:else if tutorialSteps[currentTutorialStep].title === "Q-Table: Numeric Values"}
                    <div class="grid-container valores-q">
                        {#if currentQTable}
                            <QTableValues
                                allQTables={q_tables_data}
                                qTable={currentQTable}
                                {world_width}
                                {world_height}
                                {start}
                                {goal}
                                {holes}
                                bind:maxAbsVal={globalMaxAbsQValue}
                            />
                        {:else}
                            <p>Loading Q-table visualization (Values)...</p>
                        {/if}
                    </div>
                {:else if tutorialSteps[currentTutorialStep].title === "Inspect Individual Cells"}
                    <div class="cell-details-container q-value-triang">
                        {#if inspectedRow != null && inspectedCol != null}
                            <QCellActions
                                qValuesForCell={qValuesForInspectedCell}
                                globalMaxAbsQValue={100}
                                inspectedRow={inspectedRow}
                                inspectedCol={inspectedCol}
                            />
                        {:else}
                            <p>Cell details will appear here.</p>
                        {/if}
                    </div>
                {:else if tutorialSteps[currentTutorialStep].title === "Q-Values Chart (Inspected Cell)"}
                    <div class="chart-container q-value-container">
                        <QValuesChart
                            allQTables={q_tables_data}
                            inspectedRow={inspectedRow}
                            inspectedCol={inspectedCol}
                            width={650} height={180} bind:currentEpisode={currentEpisode}
                            playing={playing}
                            speedIndex={currentSpeedIndex}
                        />
                    </div>
                {:else if tutorialSteps[currentTutorialStep].title === "Control Panel and Parameters"}
                    <ControlsPanel
                    bind:showParamGrid
                    bind:showParamRL
                    bind:world_width
                    bind:world_height
                    bind:holes
                    bind:start
                    bind:goal
                    bind:alpha
                    bind:gamma
                    bind:epsilon
                    bind:epsilon_decay
                    bind:num_episodes
                    bind:max_steps
                    {playSpeedText}
                    bind:playing
                    {width_icon}
                    bind:currentEpisode
                    {agent_positions_data}
                    {initializeQLearning}
                    {prevStep}
                    {nextStep}
                    {togglePlay}
                    {togglePlaySpeed}
                    on:goToEpisode={goToEpisode}
                />
                {:else}
                    <p>Let's start!</p>
                {/if}
            </div>

            <div class="tutorial-navigation">
                <button on:click={prevTutorialStep} disabled={currentTutorialStep === 0}>Previous</button>
                <span class = "number-total">{currentTutorialStep + 1} / {tutorialSteps.length}</span>
                <button on:click={nextTutorialStep} disabled={currentTutorialStep === tutorialSteps.length - 1}>Next</button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Cores roxas */
    :root {
        --primary-purple: #9a5bf4;
        --secondary-purple: #8278c1;
        --dark-background: #1a1a1a;
        --light-text: #f0f0f0;
    }
    .number-total {
        font-family: "Arial";
        font-size: 1px;
    }
    .tutorial-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }


    .tutorial-modal-content {
        background-color: var(--dark-background);
        padding: 25px;
        border-radius: 10px;
        max-width: 900px; 
        width: 90%;
        color: var(--light-text);
        position: relative;
        /* border: 2px solid var(--secondary-purple); */
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-family: 'Pixelify Sans', sans-serif;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none; /* Keep background none */
        border: none; /* Keep no border */
        font-size: 16px; /* Matched font size from previous component's .btn-config */
        cursor: pointer;
        color: white; /* Matched initial color to white */
        padding: 5px;
        border-radius: 5px;
        font-family: "Press Start 2P"; /* Applied the font family */
    }

    .info {
        font-family: Arial, sans-serif ;
    }


    h2 {
        color: var(--primary-purple);
        margin-bottom: 8px;
        font-family: 'Press Start 2P', cursive;
        text-align: center;
        font-size: 1.5em;
    }

    p {
        font-size: 1em;
        line-height: 1.4;
        margin-bottom: 15px;
        text-align: center;
    }

    .tutorial-visualization-area {
        height: 300px; /* Mantido altura fixa */
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        /* border: 1px dashed var(--secondary-purple); */
        /* padding: 15px; */
        border-radius: 8px;
        background-color: #0d0d0d;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
    }

    .tutorial-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }

    .tutorial-navigation button {
        background-color: var(--primary-purple);
        color: var(--dark-background);
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9em;
        font-weight: bold;
        transition: background-color 0.3s ease, transform 0.2s ease;
        font-family: 'DotGothic16', sans-serif;
    }

    .tutorial-navigation button:hover {
        background-color: #7b4ac9;
        transform: translateY(-2px);
    }

    .tutorial-navigation button:disabled {
        background-color: #333;
        color: #888;
        cursor: not-allowed;
        transform: none;
    }

    .tutorial-navigation span {
        font-size: 1.1em;
        font-weight: bold;
        color: var(--light-text);
    }

    /* Estilos para os componentes de visualização dentro do modal */
    .grid-container, .chart-container, .cell-details-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 550px; /* Mantido o max-width para os componentes internos */
    }
    .valores-q{
        margin: 0;
    }
    .q-value-container {
        margin-top: 10%;
    }
    .q-value-triang {
        margin-top: 5%;
    }

    .cell-details-container p {
        margin-bottom: 10px;
        font-size: 0.95em;
        color: #aaa;
    }
</style>