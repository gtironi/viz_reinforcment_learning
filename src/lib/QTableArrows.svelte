<script>
    export let qTable; // A Q-table para renderizar
    export let world_width;
    export let world_height;
    export let start;
    export let goal;
    export let holes;
    import { base } from '$app/paths';

    import InfoTooltip from "./InfoTooltip.svelte";

    // Mapeamento de ações para caracteres de seta ou ícones (você pode usar ícones SVG reais ou unicode)
    const arrowMap = {
        'up': '↑',
        'down': '↓',
        'left': '←',
        'right': '→',
        '': '·',
        'undefined': '?'
    };

    // Função para determinar a melhor ação (seta) para uma dada célula
    function calculateBestAction(row, col, currentQTable) {
        const stateKey = `${row},${col}`;
        const actions = currentQTable[stateKey];

        if (!actions) return ''; // Caso a célula não esteja na Q-table (pode acontecer com estados terminais)

        let bestActions = [];
        let maxValue = -Infinity;

        for (const action of ['up', 'down', 'left', 'right']) { // Iterar sobre ACTIONS explicitamente
            if (actions[action] > maxValue) {
                maxValue = actions[action];
                bestActions = [action];
            } else if (actions[action] === maxValue) {
                bestActions.push(action);
            }
        }

        if (bestActions.length > 1)
        {
            return "undefined";
        }
        else
        {
            return bestActions.length > 0 ? bestActions[Math.floor(Math.random() * bestActions.length)] : '';
        }
    }

    $: bestActionsGrid = (() => {
        const gridData = [];
        for (let r = 0; r < world_height; r++) {
            const rowData = [];
            for (let c = 0; c < world_width; c++) {
                rowData.push(calculateBestAction(r, c, qTable));
            }
            gridData.push(rowData);
        }
        return gridData;
    })();

    // Função para verificar se a célula é o início, objetivo ou buraco
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

<div class="q-grid-wrapper">
    <h3>Policy
        <InfoTooltip>
            <div slot = "tooltipContent">
                This grid visualizes the agent's<br>
                current optimal policy: the best action<br>
                to take from each cell to reach the goal.
            </div>
        </InfoTooltip>
    </h3>
    <div class="q-grid" style="grid-template-columns: repeat({world_width}, 1fr);">
        {#key world_width + world_height + JSON.stringify(holes) + JSON.stringify(start) + JSON.stringify(goal)}

        {#each Array(world_height) as _, r}
            {#each Array(world_width) as __, c}
                <div
                    class="q-grid-cell {getCellType(r, c)}"
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
                    {:else}
                        {#if arrowMap[bestActionsGrid[r][c]] == "?"}
                            ?
                        {:else}
                            <span class="arrows">
                                {arrowMap[bestActionsGrid[r][c]]}
                            </span> 
                        {/if}
                    {/if}
                </div>
            {/each}
        {/each}
        {/key}
    </div>
</div>

<style>
    :root {
        --color-border: #a39cd0;
        --size-border: 3px
    }
    .q-grid-wrapper h3 {
        text-align: center;
        font-family: "Press Start 2P";
        font-weight: normal;
        font-size: 14px;
    }

    .arrows {
        transform: translateY(-2px);
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
        font-family: Arial, sans-serif;
        font-weight: normal;
        background-color: #000000;
        color: #ffffff;
        position: relative;
    }

    .q-grid-cell.start {
        background-color: #000033;
    }


</style>