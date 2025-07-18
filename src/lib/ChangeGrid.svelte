<script>
    import { createEventDispatcher } from "svelte";
    import { base } from '$app/paths';

    export let world_width;
    export let world_height;
    export let hole_positions;
    export let start_position;
    export let goal_position;
    export let showconfig;
    const dispatch = createEventDispatcher();

    // === Component State Variables ===
    // For grid size selection
    let tempWorldWidth = world_width;
    let tempWorldHeight = world_height;
    const MIN_DIMENSION = 2;
    const MAX_DIMENSION = 7;
    $: {
        if (tempWorldWidth < MIN_DIMENSION) {
            tempWorldWidth = MIN_DIMENSION;
        }
        if (tempWorldWidth > MAX_DIMENSION) {
            tempWorldWidth = MAX_DIMENSION;
        }
    }

    $: {
        if (tempWorldHeight < MIN_DIMENSION) {
            tempWorldHeight = MIN_DIMENSION;
        }
        if (tempWorldHeight > MAX_DIMENSION) {
            tempWorldHeight = MAX_DIMENSION;
        }
    }

    // Start and Goal are now derived from grid dimensions
    $: tempStart = [0, 0];
    $: tempGoal = [tempWorldHeight - 1, tempWorldWidth - 1];

    // For hole selection
    let tempHoles = JSON.parse(JSON.stringify(hole_positions)); // Deep copy to avoid direct mutation

    // Auxiliary variables for grid interface
    let hoveredCell = null; // [r, c] of the cell under the mouse

    // Error or feedback messages
    let errorMessage = "";

    // === Utility Functions ===

    // Function to check if a cell is Start, Goal or Hole
    function isStart(r, c) {
        return tempStart[0] === r && tempStart[1] === c;
    }

    function isGoal(r, c) {
        return tempGoal[0] === r && tempGoal[1] === c;
    }

    function isHole(r, c) {
        return (
            tempHoles.some((hole) => hole[0] === r && hole[1] === c) &&
            !isGoal(r, c) &&
            !isStart(r, c)
        );
    }

    // BFS algorithm to check if a path exists
    function hasPath(start, goal, holes, width, height) {
        const queue = [[start[0], start[1]]];
        const visited = new Set();
        visited.add(`${start[0]},${start[1]}`);

        const directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ]; // right, left, down, up

        while (queue.length > 0) {
            const [r, c] = queue.shift();

            if (r === goal[0] && c === goal[1]) {
                return true; // Path found!
            }

            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;

                // Check grid boundaries
                if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
                    const nextStateKey = `${nr},${nc}`;
                    // Check if it's not a hole and has not been visited
                    if (
                        !isHoleInPathCheck(nr, nc, holes) &&
                        !visited.has(nextStateKey)
                    ) {
                        visited.add(nextStateKey);
                        queue.push([nr, nc]);
                    }
                }
            }
        }
        return false; // No path found
    }

    // Auxiliary function for hasPath, to check holes in the path verification context
    function isHoleInPathCheck(r, c, holesArray) {
        return holesArray.some((hole) => hole[0] === r && hole[1] === c);
    }

    // === Event Handling Logic ===

    function handleCellClick(r, c) {
        errorMessage = ""; // Clear previous error messages

        if (isStart(r, c) || isGoal(r, c)) {
            errorMessage = "Cannot place holes on Start or Goal positions.";
            return;
        }

        if (isHole(r, c)) {
            // If it's already a hole, remove it
            tempHoles = tempHoles.filter(
                (hole) => !(hole[0] === r && hole[1] === c),
            );
        } else {
            // If it's not a hole, add it
            tempHoles = [...tempHoles, [r, c]];
        }
    }

    function handleRightClick(r, c) {
        // Remove holes when right-clicking
        if (isHole(r, c)) {
            tempHoles = tempHoles.filter(
                (hole) => !(hole[0] === r && hole[1] === c),
            );
            errorMessage = ""; // Clear any hole error, as one was removed
        }
    }

    function handleMouseEnter(r, c) {
        hoveredCell = [r, c];
    }

    function handleMouseLeave() {
        hoveredCell = null;
    }

    // === Apply Configuration Logic ===

    async function applyConfiguration() {
        errorMessage = ""; // Clear error messages on applying
        tempHoles = tempHoles.filter(
            (hole) => !(hole[0] === tempGoal[0] && hole[1] === tempGoal[1]) && (hole[0] < tempWorldHeight && hole[1] < tempWorldWidth),
        );
        
        if (tempWorldWidth < 2 || tempWorldHeight < 2) {
            errorMessage = "Grid size must be at least 2x2.";
            return;
        }

        // Validate path before applying
        if (
            !hasPath(
                tempStart,
                tempGoal,
                tempHoles,
                tempWorldWidth,
                tempWorldHeight,
            )
        ) {
            errorMessage =
                "Impossible path! Remove some holes to ensure a path from Start to Goal exists.";
            return;
        }
        tempHoles = tempHoles.filter(
            (hole) => !(hole[0] === tempGoal[0] && hole[1] === tempGoal[1]),
        );

        // Update stores with new values
        world_width = tempWorldWidth;
        world_height = tempWorldHeight;
        start_position = tempStart;
        goal_position = tempGoal;
        hole_positions = [...tempHoles];

        // Dispatch an event so the parent component knows the configuration has been updated
        dispatch("configUpdated");
        showconfig = false;
    }

    function resetConfiguration() {
        errorMessage = "";
        tempWorldWidth = world_width;
        tempWorldHeight = world_height;
        tempHoles = JSON.parse(JSON.stringify(hole_positions)); // Reset holes to the last applied state
    }

    // === Dynamic CSS Classes ===
    function getCellClass(r, c) {
        let classes = "";

        if (isStart(r, c)) classes += " is-start";
        if (isGoal(r, c)) classes += " is-goal";
        if (isHole(r, c)) classes += " is-hole";

        // Prevent Start/Goal from being styled as hovered holes
        if (
            hoveredCell &&
            hoveredCell[0] === r &&
            hoveredCell[1] === c &&
            !isStart(r, c) &&
            !isGoal(r, c)
        ) {
            classes += " hovered-cell";
        }

        return classes;
    }

    function unShowParamSetter() {
        showconfig = false;
    }
</script>

<div class="overlay">
    <div class="change-container">
        <div class="header-section">
            <h2>Grid World Configuration</h2>
            <button
                class="close-button"
                on:click={unShowParamSetter}
                aria-label="Fechar configurações">X</button
            >
        </div>

        {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
        {/if}

        <div class="controls-and-grid">
            <div class="grid-size-inputs-text">
                <p class="texto-exp">
                    Click below to enlarge the grid. Click on the grid to add and remove monsters.</p>
                <div class="grid-size-inputs">
    <label for="width">Width:</label>
    <label for="height">Height:</label>

    <input
        type="number"
        id="width"
        bind:value={tempWorldWidth}
        min="2"
        max="10"
    />
    <input
        type="number"
        id="height"
        bind:value={tempWorldHeight}
        min="2"
        max="10"
    />
</div>

               
            </div>

            <div class="grid-display-area">
                <div
                    class="grid-container"
                    style="grid-template-columns: repeat({tempWorldWidth}, 1fr);"
                >
                    {#key tempWorldWidth + tempWorldHeight + JSON.stringify(tempHoles) + JSON.stringify(tempStart) + JSON.stringify(tempGoal) + JSON.stringify(hoveredCell)}
                        {#each Array(tempWorldHeight) as _, r}
                            {#each Array(tempWorldWidth) as __, c}
                                <div
                                    class="grid-cell {getCellClass(r, c)}"
                                    role="button"
                                    tabindex="0"
                                    on:click={() => handleCellClick(r, c)}
                                    on:keydown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            handleCellClick(r, c);
                                            e.preventDefault();
                                        }
                                        if (
                                            e.key === "Delete" ||
                                            e.key === "Backspace"
                                        ) {
                                            handleRightClick(r, c);
                                            e.preventDefault();
                                        }
                                    }}
                                    on:contextmenu|preventDefault={() =>
                                        handleRightClick(r, c)}
                                    on:mouseenter={() => handleMouseEnter(r, c)}
                                    on:mouseleave={handleMouseLeave}
                                    on:focus={() => handleMouseEnter(r, c)}
                                >
                                    {#if isStart(r, c)}
                                    <img
                                    src={base + "/pacman.png"}
                                    alt="Hole"
                                    style="width: 24px; height: 24px;"/>
                                    {/if}
                                    {#if isGoal(r, c)}
                                    <img
                                    src={base + "/coin.png"}
                                    alt="Hole"
                                    style="width: 24px; height: 24px;"/>
                            {/if}
                                    {#if isHole(r, c)}
                                    <img
      src={base + "/fantasma.png"}
      alt="Ghost"
      style="width: 24px; height: 24px;"
    />
                                    
                                    {/if}
                                </div>
                            {/each}
                        {/each}
                    {/key}
                </div>
            </div>
        </div>
        <div class="action-buttons">
            <button
                class="btn-config button-reset"
                on:click={resetConfiguration}>Reset</button
            >
            <button
                class="btn-config button-apply"
                on:click={applyConfiguration}>Apply Settings</button
            >
        </div>
    </div>
</div>

<style>
    :root {
        --color-border: #454b5e;
        --color-hole:#000000;
        --color-goal: #000000;
        --color-start: #000000;
        --size-border: 1px;
    }
    /* Overlay Styles */
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .change-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background-color: #1e1e1e;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        font-family: sans-serif;
        width: 80vw;
        max-width: 1000px;
        height: 90vh; /* Adjust height to give more space */
        max-height: 800px;
        overflow-y: auto;
        box-sizing: border-box;
    }

    .header-section {
        display: flex; /* Transforma a div em um container flex */
        align-items: center; /* Alinha os itens verticalmente ao centro */
        width: 100%;
        font-size: 0.8em;
        /* Remove o justify-content: space-between; */
    }

    .header-section h2 {
        font-family: "Press Start 2P";
        flex-grow: 1;
        text-align: center;
        margin: 0;
    }

    .close-button {
        border: none;
        background-color: #1e1e1e;
        color: white;
        margin-left: auto; /* ESSENCIAL: Empurra este item para a direita */
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-family: "Press Start 2P"; /* Added font-family */
        font-size: 1em; /* Adjust size if needed */
        
    }

    .info-message {
        color: white;
        margin-top: 10px;
        font-size: 0.9em;
    }


.texto-exp {
    line-height: 1.6;        /* Espaçamento entre linhas maior (ajuste conforme necessário) */
    text-align: justify;      /* Justifica o texto (correto é 'text-align', não 'justify') */
}

    .error-message {
        margin-top: 1em;
        font-family: "Press Start 2P";
        color: #d32f2f;
        margin-bottom: 15px;
        font-weight: bold;
        text-align: center;
    }

    .controls-and-grid {
        display: flex;
        flex-direction: row; /* Arrange inputs and grid side-by-side */
        gap: 5%; /* Reduced gap */
        width: 95%; /* Increased width */
        justify-content: center;
        flex-grow: 1; /* Allow this section to take available space */
    }

    .btn-config {
        padding: 6px 12px;
        cursor: pointer;
        background-color: #9a5bf4; /* tom roxo da imagem */
        color: white;
        border: 2px solid black;
        border-radius: 10px; /* estilo quadrado */
        font-family: "Press Start 2P", monospace; /* estilo pixel retro */
        font-size: 1em;
        text-transform: none;
        display: inline-block;
        text-align: center;
        
    }

    .grid-size-inputs-text {
        font-family: "Press Start 2P";
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        align-items: flex-start;
        padding-left: 20px;
        border-radius: 5px;
        width: 400px; /* Increased width */
        flex: 1; /* Added flex to control proportion */
    }

    .grid-size-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
    justify-items: center;
    align-items: center;
}

    
    
    .grid-size-inputs label {
        
        font-weight: bold;
        color: #ccc;
    }

    .grid-size-inputs input {
        font-family: "Press Start 2P";
        padding: 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 40px; /* Fixed width for inputs */
        text-align: center;
    }

    .grid-display-area {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        flex: 2; /* Added flex to make grid area twice as wide as controls */
        margin:0;
    }

    .grid-container {
        display: grid;
        border: var(--size-border) solid var(--color-border);
        background-color: #fff;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        /* Ensure the grid doesn't grow too large */
        max-width: 100%;
        max-height: 100%;
        overflow: auto; /* Add scrollbars if grid is too big */
    }

    .grid {
        display: grid;
        border-top: var(--size-border) solid var(--color-border);
        border-left: var(--size-border) solid var(--color-border);
        width: fit-content;
        margin: 0 auto;
    }

    .grid-cell {
        width: 50px; /* Increased cell size */
        height: 50px; /* Increased cell size */
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

    .grid-cell:hover:not(.is-start):not(.is-goal) {
        background-color: #e0e0e0;
    }

    /* Cell States */
    .grid-cell.is-start {
        background-color: var(--color-start);
        color: white;
        font-weight: bold;
    }

    .grid-cell.is-goal {
        background-color: var(--color-goal);
        color: white;
        font-weight: bold;
    }

    .grid-cell.is-hole {
        background-color: var(--color-hole); 
        color: white;
        font-weight: bold;
    }

    .grid-cell.hovered-cell {
        background-color: #bbdefb; /* Light blue for hovering */
    }

    .current-values {
        background-color: #ffeeba;
        padding: 10px;
        border-radius: 5px;
        font-size: 0.8em;
        color: #333;
        width: 100%;
        text-align: center;
    }

    .action-buttons {
        display: flex;
        gap: 15px;
        margin-top: 0.5em;
    }

    .reset-button {
        background-color: #ff9800;
    }

    .reset-button:hover {
        background-color: #e68a00;
    }
</style>