<script>
    export let allQTables;
    export let qTable;
    export let world_width;
    export let world_height;
    export let start;
    export let goal;
    export let holes;
    export let maxAbsVal;
    import { base } from '$app/paths';
    import { afterUpdate } from 'svelte'; // Import afterUpdate
    import * as d3 from "d3";
    import InfoTooltip from "./InfoTooltip.svelte";

    // Variável para armazenar a referência ao elemento do grid
    let qGridElement;
    // Variável reativa para a altura do grid
    let qGridHeight = 0;

    afterUpdate(() => {
        if (qGridElement && qGridElement.offsetHeight !== qGridHeight) {
            qGridHeight = qGridElement.offsetHeight;
        }
    });

    // Função para encontrar o valor absoluto máximo entre todas as Q-tables
    function getGlobalMaxAbsoluteQValue(allQTables) {
        maxAbsVal = 0;

        allQTables.forEach(qTable => {
            for (const stateKey in qTable) {
                const cells = qTable[stateKey];
                for (const cell in cells) {
                    const actions = cells[cell];
                    for (const action in actions)
                    {
                        const qValue = actions[action];
                        if (qValue !== -Infinity) {
                            const absQValue = Math.abs(qValue);
                            if (absQValue > maxAbsVal) {
                                maxAbsVal = absQValue;
                            }
                        }
                    }
                }
            }
        });
        return maxAbsVal;
    }

    // Calcula o valor absoluto máximo global de forma reativa
    $: globalMaxAbsQValue = getGlobalMaxAbsoluteQValue(allQTables);

    // Variáveis reativas para os valores min/max para a legenda
    $: legendMinQValue = -globalMaxAbsQValue.toFixed(0);
    $: legendMaxQValue = globalMaxAbsQValue.toFixed(0);
    $: legendZeroValue = 0;

    const interpolateQValueColor = d3.interpolateRgbBasis(["#ce0303", "#1A1A1A", "#E6E6FA"]);

    // Funções para determinar a cor do gradiente
    function getGradientColor(qValue) {
        if (globalMaxAbsQValue === 0) {
            return `hsl(0, 0%, 15%)`;
        }

        const maxQValue = globalMaxAbsQValue;
        const minQValue = -globalMaxAbsQValue;

        const normalizedValue = (qValue - minQValue) / (maxQValue - minQValue);

        return interpolateQValueColor(normalizedValue);
    }

    // Gera o gradiente para a legenda (agora vertical)
    $: legendGradient = `linear-gradient(to top,
        ${getGradientColor(-globalMaxAbsQValue)},
        ${getGradientColor(0)},
        ${getGradientColor(globalMaxAbsQValue)})`;


    // Função para determinar a melhor ação para uma dada célula e seu Q-value
    function getBestActionAndValue(row, col, currentQTable) {
        const stateKey = `${row},${col}`;
        const actions = currentQTable[stateKey];

        if (!actions) return { bestAction: '', bestQValue: 0 };

        let bestAction = '';
        let maxValue = -Infinity;

        for (const action of ['up', 'down', 'left', 'right']) {
            if (actions[action] > maxValue) {
                maxValue = actions[action];
                bestAction = action;
            }
        }
        return { bestAction, bestQValue: maxValue };
    }

    // Matriz reativa para armazenar o Q-value da melhor ação para cada célula
    $: bestQValuesGrid = (() => {
        const gridData = [];
        for (let r = 0; r < world_height; r++) {
            const rowData = [];
            for (let c = 0; c < world_width; c++) {
                rowData.push(getBestActionAndValue(r, c, qTable).bestQValue);
            }
            gridData.push(rowData);
        }
        return gridData;
    })();

    function getCellType(row, col) {
        if (row === start[0] && col === start[1]) return 'start';
        if (row === goal[0] && col === goal[1]) return 'goal';
        if (holes.some(hole => hole[0] === row && hole[1] === col)) return 'hole';
        return '';
    }
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Tiny5&family=VT323&display=swap" rel="stylesheet">

<div class="main-container">
    <div class="q-grid-wrapper">
        <h3>Q-values
            <InfoTooltip>
                <div slot = "tooltipContent">
                    This grid displays the current maximum Q-value<br>
                    for each cell, representing the estimated<br>
                    long-term reward an agent can expect by<br>
                    following the optimal policy from that state.
                </div>
            </InfoTooltip>
        </h3>
        <div
            class="q-grid"
            style="grid-template-columns: repeat({world_width}, 1fr);"
            bind:this={qGridElement}
        >
            {#key world_width + world_height + JSON.stringify(holes) + JSON.stringify(start) + JSON.stringify(goal)}
            {#each Array(world_height) as _, r}
                {#each Array(world_width) as __, c}
                    <div
                        class="q-grid-cell {getCellType(r, c)}"
                        style="background-color: {getCellType(r,c) === '' ? getGradientColor(bestQValuesGrid[r][c]) : ''};"
                    >
                        {#if getCellType(r,c) === 'goal'}
                            <img
                                src={base + "/coin.png"}
                                alt="Coin"
                                style="width: 24px; height: 24px;"
                            />
                        {:else if getCellType(r,c) === 'hole'}
                            <img
                                src={base + "/fantasma.png"}
                                alt="Hole"
                                style="width: 24px; height: 24px;"
                            />
                        {/if}
                    </div>
                {/each}
            {/each}
            {/key}
        </div>
    </div>

    <div class="color-legend" style="--q-grid-height: {qGridHeight}px;">
        <div class="gradient-bar" style="background: {legendGradient}; height: {qGridHeight}px;"></div>
        <div class="labels">
            <span>{legendMaxQValue}</span>
            <span>{legendZeroValue}</span>
            <span>{legendMinQValue}</span>
        </div>
    </div>
</div>

<style>
    :root {
        --color-border: #9f96d8;
        --size-border: 3px
    }

    .main-container {
        display: flex;
        align-items: flex-start;
        gap: 20px;
    }

    .q-grid-wrapper h3 {
        text-align: center;
        font-family: "Press Start 2P";
        font-weight: normal;
        font-size: 14px;
    }

    .q-grid {
        display: grid;
        border-top: var(--size-border) solid var(--color-border);
        border-left: var(--size-border) solid var(--color-border);
        width: fit-content;
        margin: 0 auto;
    }

    .q-grid-cell {
        width: 35px;
        height: 35px;
        border-right: var(--size-border) solid var(--color-border);
        border-bottom: var(--size-border) solid var(--color-border);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5em;
        font-weight: normal;
        color: #ffffff;
        position: relative;
    }

    .q-grid-cell.start {
        background-color: #000033;
    }

    /* .q-grid-cell.goal {
        background-color: #000000;
    } */

    /* Estilos da Legenda Vertical */
    .color-legend {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 10px;
        width: 80px;
        margin-top: 50px;
        font-family: Arial, sans-serif;
        color: #ffffff;
        font-size: 0.5em;
        height: var(--q-grid-height, 180px);
    }

    .gradient-bar {
        width: 15px;
        border-radius: 3px;
        flex-shrink: 0;
    }

    .labels {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        font-family: "Press Start 2P";
        margin-top: 0;
        margin-left: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .labels span {
        text-align: left;
        position: relative;
    }

    /* Max Value */
    .labels span:nth-child(1) { 
        align-self: flex-start;
        top: 0;
        left: 0;
        /* transform: translateX(-50%); */
    }

    /* Zero Value */
    .labels span:nth-child(2) { 
        top: 0%;
        /* transform: translateX(-80%); */
    }

    /* Min Value */
    .labels span:nth-child(3) { 
        align-self: flex-start;
        bottom: 0;
        left: 0;    
        /* transform: translateX(-10%); */
    }
</style>