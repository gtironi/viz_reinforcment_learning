<script>
    import { onMount } from "svelte";
    import { q_learning } from "$lib/q_learning.js";
    import * as d3 from "d3";
    import QTableArrows from "$lib/QTableArrows.svelte";
    import QTableValues from "$lib/QTableValues.svelte";
    import EnvironmentGrid from "$lib/EnvironmentGrid.svelte";
    import AccuracyChart from "$lib/AccuracyChart.svelte";
    import ChangeParams from "$lib/ChangeParams.svelte";
    import ChangeGrid from "$lib/ChangeGrid.svelte";
    import Icon from "$lib/Icons.svelte";
    import QCellActions from "$lib/QCellActions.svelte";
    import QValuesChart from "$lib/QValuesChart.svelte";
    import ControlsPanel from "$lib/Buttons.svelte";
    import { base } from '$app/paths';
    import SuggestionTexts from "$lib/SuggestionTexts.svelte";
    import TutorialModal from '$lib/TutorialModal.svelte';

    let showTutorial = false;

    function openTutorial() {
        showTutorial = true;
    }

    function closeTutorial() {
        showTutorial = false;
    }


    //Grid Params
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
    let epsilon_decay = 0.99;
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

    let svgContainer;

    // Function to initialize or re-run Q-learning
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
        stopAnimation();
    }

    onMount(() => {
        initializeQLearning();
    });

    let globalMaxAbsQValue = 0;

    // Variáveis para a célula que o usuário vai inspecionar
    let inspectedRow = null;
    let inspectedCol = null;
    let hoveredAction = null;

    // Função para obter os Q-valores de uma célula específica
    function getCellQValues(row, col, qTable) {
        if (!qTable) return { up: 0, down: 0, left: 0, right: 0 };
        const stateKey = `${row},${col}`;
        return qTable[stateKey] || { up: 0, down: 0, left: 0, right: 0 };
    }

    // Q-valores da célula inspecionada, reativos à currentQTable e inspectedRow/inspectedCol
    $: qValuesForInspectedCell = getCellQValues(
        inspectedRow,
        inspectedCol,
        currentQTable,
    );

    // Derived state for current agent position
    $: currentAgentPosition =
        agent_positions_data[currentEpisode]?.[currentStep] || start;

    $: currentQTable = q_tables_data[currentEpisode]?.[currentStep];

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

    let width_icon = 19;
    let showBtnTutorial= true;
</script>

<svelte:head>
    <title>Q-Learning Visualization</title>
</svelte:head>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Tiny5&family=VT323&display=swap"
    rel="stylesheet"
/>


<TutorialModal bind:showModal={showTutorial} on:close={closeTutorial} />


<div class="main-layout">
    <div class="right-panel">
        <div class="controls-wrapper">
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
                on:openTutorial={openTutorial}
                showBtnTutorial={showBtnTutorial} />
        </div>
        <div class="env-and-chart-wrapper">
            <div class="grid-display-wrapper-env">
                <EnvironmentGrid
                    {world_width}
                    {world_height}
                    {start}
                    {goal}
                    bind:holes
                    {currentAgentPosition}
                    bind:inspectedRow
                    bind:inspectedCol
                />
            </div>
            
            <div class="accuracy-chart-wrapper">
                <AccuracyChart
                    {success_rates_data}
                    bind:currentEpisode
                    width={630}
                    height={250}
                    speedIndex={currentSpeedIndex}
                    {playing}
                />
            </div>
        </div>
    </div>
</div>

<div class="details-panel">
    {#if inspectedRow != null && inspectedCol != null}

        <div class="cell-details-wrapper">
            <QCellActions
                qValuesForCell={qValuesForInspectedCell}
                globalMaxAbsQValue={100}
                {inspectedRow}
                {inspectedCol}
                bind:hoveredAction
            />

            <QValuesChart
                allQTables={q_tables_data}
                {inspectedRow}
                {inspectedCol}
                width={650}
                height={250}
                bind:currentEpisode
                {playing}
                speedIndex={currentSpeedIndex}
                hoveredAction={hoveredAction}
            />
        </div>

    {:else}
        <div class="qtables-wrapper">
            <div class="grid-display-wrapper">
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
                    <p>Carregando visualização da Q-table (Setas)...</p>
                {/if}
            </div>

            <div class="grid-display-wrapper">
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
                    <p>Carregando visualização da Q-table (Valores)...</p>
                {/if}
            </div>

            <div class="suggestions-wrapper">
                <SuggestionTexts
                    alpha={alpha}
                    gamma={gamma}
                    epsilon={epsilon}
                    epsilon_decay={epsilon_decay}
                    n_of_episodes={num_episodes}
                    max_steps={max_steps}
                    final_accuracy={success_rates_data[success_rates_data.length - 1]}
                />
            </div>
        </div>
    {/if}
</div>

<style>
    .main-layout {
        display: flex;
        justify-content: center; /* Centraliza todos os itens */
        padding: 20px;
        font-family: Arial, sans-serif;
        background-color: #1e1e1e;
        color: #ffffff;
        /* min-height: 60vh; */
        gap: 30px;
    }

    /* .controls-wrapper {
        max-width: 865px;
        margin-left: 50px;
    } */

    .grid-display-wrapper-env {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 395px;
    }

    .env-and-chart-wrapper {
        display: flex;
        flex-direction: row;
        /* gap: 30px; */
        width: 100%;
        align-items: center;
        /* margin-top: 40px; */
        box-sizing: border-box;
        margin-left: -80px;
    }

    .accuracy-chart-wrapper {
        width: 56.2%;
        flex-shrink: 0;
        flex-grow: 0;
        margin-top: 20px;
    }

    .details-panel {
        align-items: center;
        margin-top: -50px;
        margin-bottom: 20px;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        display: flex;
        gap: 50px;
        min-height: 70vh;
    }

    .cell-details-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        margin-top: -10px;
        background-color: #0d0d0d;
        /* border: 1px solid #8278c1; */
        border-radius: 8px;
        min-width: 1100px;
        padding-top: 30px;
    }

    .qtables-wrapper {
        display: flex;
        flex-direction: row;
        gap: 30px;
        align-items: center;
        margin-top: -60px;
    }

    .grid-display-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: fit-content;
    }

    .details-panel {
        margin-top: 10px;
    }

    .suggestions-wrapper {
        margin-top: 20px;
    }
</style>
