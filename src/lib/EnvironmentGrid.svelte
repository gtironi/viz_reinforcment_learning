<script>
    export let world_width;
    export let world_height;
    export let start;
    export let goal;
    export let holes;
    export let currentAgentPosition;
    export let inspectedRow;
    export let inspectedCol;

    import { base } from '$app/paths';
    import { afterUpdate } from "svelte";

    // ... seus exports e funções anteriores ...

    let agentDirection = 0;
    let lastAgentPosition = [...currentAgentPosition];

    afterUpdate(() => {
        const [r, c] = currentAgentPosition;
        const [lastR, lastC] = lastAgentPosition;

        if (r !== lastR || c !== lastC) {
            if (r === lastR && c > lastC)
                agentDirection = 0; // direita
            else if (r === lastR && c < lastC)
                agentDirection = 180; // esquerda
            else if (r > lastR && c === lastC)
                agentDirection = 90; // baixo
            else if (r < lastR && c === lastC) agentDirection = 270; // cima

            lastAgentPosition = [r, c];
        }
    });

    import InfoTooltip from "./InfoTooltip.svelte";

    // Função para determinar o tipo da célula
    function getCellType(row, col) {
        if (row === start[0] && col === start[1]) return "start";
        if (row === goal[0] && col === goal[1]) return "goal";
        if (holes.some((hole) => hole[0] === row && hole[1] === col))
            return "hole";
        return "";
    }

    // Função para obter o conteúdo da célula
    function getCellContent(row, col) {
        const type = getCellType(row, col);
        if (type === "goal") return `${base}/coin.png`;
        if (type === "hole") return `${base}/fantasma.png`;
        return "";
    }

    // Manipulador de clique na célula
    function handleCellClick(row, col) {
        const cellType = getCellType(row, col);
        if (cellType === "goal" || cellType === "hole") {
            return;
        }
        if (
            getCellContent(row, col) != "H" &&
            getCellContent(row, col) != "G"
        ) {
            // Se a célula clicada já for a célula inspecionada, desseleciona
            if (inspectedRow === row && inspectedCol === col) {
                inspectedRow = null;
                inspectedCol = null;
            } else {
                // Caso contrário, seleciona a nova célula
                inspectedRow = row;
                inspectedCol = col;
            }
        }
    }
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Tiny5&family=VT323&display=swap"
    rel="stylesheet"
/>

<div class="q-grid-wrapper">
    <h3>
        Environment
        <InfoTooltip>
            <div slot="tooltipContent">
                This grid represents the environment,<br />
                showing the agent's current position,<br />
                the start, the goal, and any dangerous holes.
            </div>
        </InfoTooltip>
    </h3>
    <div
        class="q-grid"
        style="grid-template-columns: repeat({world_width}, 1fr);"
    >
        {#key world_width + world_height + JSON.stringify(holes) + JSON.stringify(start) + JSON.stringify(goal) + JSON.stringify(currentAgentPosition)}
            {#each Array(world_height) as _, r}
                {#each Array(world_width) as __, c}
                    {@const content = getCellContent(r, c)}
                    {@const isAgent =
                        r === currentAgentPosition[0] &&
                        c === currentAgentPosition[1]}
                    {@const isHole = holes.some((hole) => hole[0] === r && hole[1] === c)}
                    {@const isAgentInHole = isAgent && isHole}

                    <div
                        class="q-grid-cell {getCellType(r, c)}"
                        class:agent={isAgent}
                        class:inspected={r === inspectedRow &&
                            c === inspectedCol}
                        class:clickable={getCellType(r, c) != "goal" &&
                            getCellType(r, c) != "hole"}
                        on:click={() => handleCellClick(r, c)}
                    >
                        {#if isAgentInHole}
                            <img
                                src={base + "/skull.png"}
                                alt="Agent in Hole"
                                style="width: 35px; height: 35px;"
                            />
                        {:else if isAgent}
                            <img
                                src= {base + "/pacman.png"}
                                alt="Agent"
                                style="width: 24px; height: 24px; transform: rotate({agentDirection}deg); transition: transform 0.2s ease;"
                            />
                        {:else if content.endsWith("fantasma.png")}
                            <img
                                src={content}
                                alt="Hole"
                                style="width: 24px; height: 24px;"
                            />
                        {:else if content.endsWith("coin.png")}
                            <img
                                src={content}
                                alt="Goal"
                                style="width: 24px; height: 24px;"
                            />
                        {:else}
                            {content}
                        {/if}
                    </div>
                {/each}
            {/each}
        {/key}
    </div>
</div>

<style>
    :root {
        --color-border: #454b5e;
        --size-border: 1px;
    }
    .q-grid-wrapper h3 {
        /* margin-top: -10%; */
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
        font-weight: normal;
        background-color: #000000;
        color: #ffffff;
        position: relative;
        font-size: 1.5em;
    }

    .q-grid-cell.clickable {
        cursor: pointer;
    }

    .q-grid-cell.clickable:hover:not(.inspected) {
        background-color: #333333;
    }

    .q-grid-cell.inspected {
        outline: 3px solid #0084ff;
        outline-offset: -3px;
        box-shadow: 0 0 10px rgba(0, 174, 255, 0.3);
        background-color: #4a4a4a;
    }
</style>