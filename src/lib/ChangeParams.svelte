<script>
    import { createEventDispatcher } from "svelte";
    import InfoTooltip from './InfoTooltip.svelte';

    // Props for two-way binding
    export let alpha;
    export let gamma;
    export let epsilon;
    export let epsilon_decay;
    export let num_episodes;
    export let max_steps;
    export let showParamRL;

    const dispatch = createEventDispatcher();

    // Internal temporary variables to hold changes before applying
    let tempAlpha = alpha;
    let tempGamma = gamma;
    let tempEpsilon = epsilon;
    let tempEpsilonDecay = epsilon_decay;
    let tempNumEpisodes = num_episodes;
    let tempMaxSteps = max_steps;

    // Error or feedback messages
    let errorMessage = "";

    function applyParameters() {
        errorMessage = ""; // Clear previous error messages

        // Basic validation (you can add more robust validation if needed)
        if (tempAlpha < 0 || tempAlpha > 1 || isNaN(tempAlpha)) {
            errorMessage = "Alpha deve ser entre 0 e 1.";
            return;
        }
        if (tempGamma < 0 || tempGamma > 1 || isNaN(tempGamma)) {
            errorMessage = "Gamma deve ser entre 0 e 1.";
            return;
        }
        if (tempEpsilon < 0 || tempEpsilon > 1 || isNaN(tempEpsilon)) {
            errorMessage = "Epsilon deve ser entre 0 e 1.";
            return;
        }
        if (tempEpsilonDecay < 0 || isNaN(tempEpsilonDecay)) {
            errorMessage = "Epsilon Decay deve ser um número não negativo.";
            return;
        }
        if (tempNumEpisodes < 1 || isNaN(tempNumEpisodes)) {
            errorMessage = "Número de Episódios deve ser pelo menos 1.";
            return;
        }
        if (tempMaxSteps < 1 || isNaN(tempMaxSteps)) {
            errorMessage = "Máximo de Passos deve ser pelo menos 1.";
            return;
        }

        // Update the bound variables
        alpha = tempAlpha;
        gamma = tempGamma;
        epsilon = tempEpsilon;
        epsilon_decay = tempEpsilonDecay;
        num_episodes = tempNumEpisodes;
        max_steps = tempMaxSteps;
        showParamRL = false;

        // Dispatch an event to notify the parent component that parameters are updated
        dispatch("paramsUpdated");
        // Optionally, you might want to hide this component after applying
        // This component doesn't manage its own visibility, the parent does.
    }

    function resetParameters() {
        errorMessage = "";
        tempAlpha = alpha;
        tempGamma = gamma;
        tempEpsilon = epsilon;
        tempEpsilonDecay = epsilon_decay;
        tempNumEpisodes = num_episodes;
        tempMaxSteps = max_steps;
    }

    function unShowParamSetter() {
        showParamRL = false;
    }
    let colorbackground = "#9a5bf4"

</script>

<div class="overlay">
    <div class="change-params-container">
        <div class="header-section">
            <h2>Q-Learning Parameters Configuration</h2>
            <button
                class="close-button"
                on:click={unShowParamSetter}
                aria-label="Fechar configurações">X</button
            >
        </div>


        {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
        {/if}

        <div class="param-grid">
            <div class="param-group">
                <div class = "info-container">
                <label class="label-name" for="alpha">Alpha (Learning Rate):</label>
                <InfoTooltip colorbackground={colorbackground} size=20>
                    <div slot = "tooltipContent">
                        Controls how much the agent updates <br> its knowledge after each move.
                    </div>
                </InfoTooltip>
                </div>
                
                <div class="slider-wrapper">
                    <span class="slider-value" style="--value: {tempAlpha};"
                        >{tempAlpha.toFixed(3)}</span
                    >
                    <input
                        type="range"
                        id="alpha"
                        bind:value={tempAlpha}
                        min="0"
                        max="1"
                        step="0.001"
                    />
                </div>
            </div>

            <div class="param-group">
                <div class = "info-container">
                <label class="label-name" for="gamma">Gamma (Discount Factor)</label>
                <InfoTooltip colorbackground={colorbackground} size=20>
                    <div slot = "tooltipContent">
                        Determines how much the agent values <br> future rewards over immediate ones.
                    </div>
                </InfoTooltip>
                </div>
                <div class="slider-wrapper">
                    <span class="slider-value" style="--value: {tempGamma};"
                        >{tempGamma.toFixed(3)}</span
                    >
                    <input
                        type="range"
                        id="gamma"
                        bind:value={tempGamma}
                        min="0"
                        max="1"
                        step="0.001"
                    />
                </div>
            </div>

            <div class="param-group">
                <div class = "info-container">
                <label class="label-name" for="epsilon">Epsilon (Exploration)</label>
                <InfoTooltip colorbackground={colorbackground} size=20 align="left">
                    <div slot = "tooltipContent">
                        Sets how often the agent explores random <br> paths instead of the best-known ones.
                    </div>
                </InfoTooltip>
                </div>
                <div class="slider-wrapper">
                    <span class="slider-value" style="--value: {tempEpsilon};"
                        >{tempEpsilon.toFixed(3)}</span
                    >
                    <input
                        type="range"
                        id="epsilon"
                        bind:value={tempEpsilon}
                        min="0"
                        max="1"
                        step="0.001"
                    />
                </div>
            </div>

            <div class="param-group">
                <div class = "info-container">
                <label class="label-name" for="epsilon_decay">Epsilon Decay:</label>
                <InfoTooltip colorbackground={colorbackground} size=20>
                    <div slot = "tooltipContent">
                        Gradually reduces exploration across <br> episodes to favor learned strategies.
                    </div>
                </InfoTooltip>
                </div>
                <div class="slider-wrapper">
                    <span
                        class="slider-value"
                        style="--value: {tempEpsilonDecay};"
                        >{tempEpsilonDecay.toFixed(4)}</span
                    >
                    <input
                        type="range"
                        id="epsilon_decay"
                        bind:value={tempEpsilonDecay}
                        min="0.95"
                        max="1"
                        step="0.0001"
                    />
                </div>
            </div>

            <div class="param-group">
                <div class = "info-container">
                <label class="label-name" for="num_episodes">Number of Episodes:</label>
                <InfoTooltip colorbackground={colorbackground} size=20>
                    <div slot = "tooltipContent">
                        Defines how many times the agent <br> will train in the grid environment.
                    </div>
                </InfoTooltip>
                </div>
                <div class="slider-wrapper">
                    <span
                        class="slider-value"
                        style="--value: {tempNumEpisodes};"
                        >{tempNumEpisodes}</span
                    >
                    <input
                        type="range"
                        id="num_episodes"
                        bind:value={tempNumEpisodes}
                        min="1000"
                        max="3500"
                        step="100"
                    />
                </div>
            </div>

            <div class="param-group">
                <div class = "info-container">
                <label class="max_steps" for="epsilon_decay">Max Steps per Episode:</label>
                <InfoTooltip colorbackground={colorbackground} size=20 align = left>
                    <div slot = "tooltipContent">
                        Limits how many moves the agent <br> can take before the episode ends.
                    </div>
                </InfoTooltip>
                </div>
                <div class="slider-wrapper">
                    <span class="slider-value" style="--value: {tempMaxSteps};"
                        >{tempMaxSteps}</span
                    >
                    <input
                        type="range"
                        id="max_steps"
                        bind:value={tempMaxSteps}
                        min="1"
                        max="60"
                        step="1"
                    />
                </div>
            </div>
        </div>

        <div class="action-buttons">
            <button on:click={resetParameters} class="reset-button"
                >Reset</button
            >
            <button on:click={applyParameters}>Apply Parameters</button>
        </div>
    </div>
</div>

<style>
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
    .change-params-container {
        
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    background-color: #1e1e1e;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: sans-serif;
    width: 80vw;
    max-width: 1000px;
    height: 80vh;
    max-height: 800px;
    overflow-y: auto;
    box-sizing: border-box;
}

.param-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-items: start;
    width: 100%; /* Ensure the grid takes full available width to allow centering */
    max-width: 900px; /* Optional: set a max-width for the grid itself */
    margin: 0 auto; /* This is crucial for centering the grid horizontally */
    font-size: 20px;    
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
    }

    .error-message {
        color: #ff6666; /* Redder error message */
        font-weight: bold;
        text-align: center;
        margin-bottom: 15px;
    }

    .info-container {
        position: relative;
          display: flex;
            align-items: center;
            justify-content: space-between;
    }

    .label-name {
  position: relative;
  top: 3px;
  margin-right: 10;
}


    .param-group {
        
        font-size: 0.7em;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 10px;
        border-radius: 5px;
    }

    .param-group label {
        font-weight: bold;
        color: #ffffff; /* White text for labels */
        font-size: 0.95em;
        margin-bottom: 5px; /* Space between label and input */
    }

    /* Override the default number input styling to match the dark theme */

    .param-group input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    background: transparent;
    border-radius: 3px;
    outline: none;
    margin-top: 5px;
}

/* Track */
.param-group input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    background: #9a5bf4;
    border-radius: 3px;
    cursor: pointer;
}

.param-group input[type="range"]::-moz-range-track {
    width: 100%;
    height: 6px;
    background: #9a5bf4;
    border-radius: 3px;
    cursor: pointer;
}

.param-group input[type="range"]::-ms-track {
    width: 100%;
    height: 6px;
    background: transparent;
    border-color: transparent;
    color: transparent;
    cursor: pointer;
}

.param-group input[type="range"]::-ms-fill-lower {
    background: #9a5bf4;
    border-radius: 3px;
}

.param-group input[type="range"]::-ms-fill-upper {
    background: #ccc;
    border-radius: 3px;
}

/* Thumb */
.param-group input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    margin-top: -6px;
    box-shadow:
        1px 1px 1px #000000,
        0px 0px 1px #0d0d0d;
}

.param-group input[type="range"]::-moz-range-thumb {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    box-shadow:
        1px 1px 1px #ffffff,
        0px 0px 1px #0d0d0d;
}

.param-group input[type="range"]::-ms-thumb {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    margin-top: 0px;
    box-shadow:
        1px 1px 1px #ffffff,
        0px 0px 1px #0d0d0d;
}


    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    }

    button {
        font-family: "Press Start 2P";
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #4E2BD9;
        color: white;
        cursor: pointer;
        font-size: 1em;
        transition: background-color 0.2s ease;
    }

    button:hover {
        background-color: #5B8DDE; /* Darker blue on hover */
    }

    .reset-button {
        background-color: #4E2BD9; /* Orange reset button */
    }

    .reset-button:hover {
        background-color: #5B8DDE; /* Darker orange on hover */
    }
</style>
