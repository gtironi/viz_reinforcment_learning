<script>
    import ChangeGrid from "./ChangeGrid.svelte";
    import ChangeParams from "././ChangeParams.svelte";
    import Icon from "./Icons.svelte";
    import { createEventDispatcher } from 'svelte'; // Import event dispatcher

    const dispatch = createEventDispatcher(); // Initialize dispatcher

    // Props ou estados internos (você pode passar isso como props também)
    export let showParamGrid = false;
    export let showParamRL = false;
    // export let showTutorial = false; // <<< REMOVE THIS, it's managed by parent

    export let world_width;
    export let world_height;
    export let holes = [];
    export let start;
    export let goal;

    export let alpha;
    export let gamma;
    export let epsilon;
    export let epsilon_decay;
    export let num_episodes;
    export let max_steps;

    export let playSpeedText = "Play Speed";
    export let playing = false;
    export let width_icon = 24;

    export let currentEpisode = 0;
    export let agent_positions_data = [];
    export let showBtnTutorial = false;

    // Eventos que você pode disparar ou funções internas para controlar ações
    export let initializeQLearning = () => {};
    export let prevStep = () => {};
    export let nextStep = () => {};
    export let togglePlay = () => {};
    export let togglePlaySpeed = () => {};
    export let goToEpisode = () => {};

    // Funções para mostrar/ocultar as seções
    function showParamSetter() {
        showParamGrid = !showParamGrid;
        if (showParamGrid) showParamRL = false;
    }
    function showRLSetter() {
        showParamRL = !showParamRL;
        if (showParamRL) showParamGrid = false;
    }

    // Function to dispatch an event to the parent to open the tutorial
    function openTutorialFromControls() {
        dispatch('openTutorial'); // Dispatch custom event
        // No need to manage showTutorial here, the parent will handle it
    }
</script>

<div class="controls">
    <div class="buttons-change">
        {#if showBtnTutorial}
        <button class="btn-change" on:click={openTutorialFromControls}> Tutorial
        </button>
        {/if}
        <button class="btn-change" on:click={showParamSetter}>
            Grid Parameters
        </button>

        {#if showParamGrid}
            <ChangeGrid
                on:configUpdated={initializeQLearning}
                bind:showconfig={showParamGrid}
                bind:world_width
                bind:world_height
                bind:hole_positions={holes}
                bind:start_position={start}
                bind:goal_position={goal}
            />
        {/if}

        <button class="btn-change" on:click={showRLSetter}>
            RL Parameters
        </button>

        {#if showParamRL}
            <ChangeParams
                on:paramsUpdated={initializeQLearning}
                bind:alpha
                bind:gamma
                bind:epsilon
                bind:epsilon_decay
                bind:num_episodes
                bind:max_steps
                bind:showParamRL
            />
        {/if}
    </div>

    <div class="player-controls">
        <button class="play-btn" on:click={togglePlaySpeed}>
            {playSpeedText}
        </button>

        <button on:click={initializeQLearning} title="Reset">
            <Icon {width_icon} name="reset" color="white" />
        </button>

        <button on:click={prevStep} title="Previous Step">
            <Icon {width_icon} name="previous" />
        </button>

        <button on:click={togglePlay} title={playing ? "Pause" : "Play"}>
            {#if playing}
                <Icon {width_icon} name="pause" />
            {:else}
                <Icon {width_icon} name="play" />
            {/if}
        </button>

        <button on:click={nextStep} title="Next Step">
            <Icon {width_icon} name="next" />
        </button>

        <div class="episode-slider">
            <label for="episodeSlider">
                &ensp;Ep: {currentEpisode + 1}/{agent_positions_data.length}
            </label>
            <input
                type="range"
                id="episodeSlider"
                min="0"
                max={agent_positions_data.length > 0
                    ? agent_positions_data.length - 1
                    : 0}
                bind:value={currentEpisode}
                on:input={goToEpisode}
                disabled={agent_positions_data.length === 0}
            />
        </div>
    </div>
</div>

<style>
    .controls {
  display: flex;
  justify-content: space-between; /* separa os dois lados, um em cada extremidade */
  align-items: center; /* alinha verticalmente ao centro */
  flex-wrap: wrap; /* para melhorar em telas pequenas */
}
    .btn-change {
        padding: 6px 12px;
        cursor: pointer;
        background-color: #9a5bf4; /* tom roxo da imagem */
        color: white;
        border: 2px solid black;
        border-radius: 0; /* estilo quadrado */
        font-family: "Press Start 2P", monospace; /* estilo pixel retro */
        font-size: 10px;
        text-transform: none;
        letter-spacing: 1px;
        display: inline-block;
        text-align: center;
    }

    .buttons-change {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px; /* opcional: espaço entre botões */
    }

    .btn-change:hover {
        background-color: #0056b3;
    }
    .episode-slider {
        font-family: "Press Start 2P", monospace;
        font-size: 0.8em;
    }

    label {
        margin-top: 10px;
        font-weight: bold;
    }

    .player-controls {
        display: flex;
        font-size: 0.8rem;
        align-items: center;
        gap: 0.5rem;
        padding-top: 1rem;
        padding-left: 1rem;
        padding-bottom: 1rem;
    }

    .player-controls button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
    }

    .episode-slider {
        flex-grow: 1;
        min-width: 290px;
    }

    .play-btn {
        font-family: "Press Start 2P", monospace;
        color: #ffffff;
        min-width: 50px;
    }
    .episode-slider input[type="range"] {
        -webkit-appearance: none; /* Remove o estilo padrão do navegador para Webkit */
        appearance: none; /* Estilo padrão */
        width: 100%;
        height: 6px;
        background: transparent; /* Torna o fundo do input transparente para que a barra de progresso personalizada seja visível */
        border-radius: 3px;
        outline: none;
        margin-top: 8px;
    }

    /* Estilo para a barra de progresso (o "track") */
    .episode-slider input[type="range"]::-webkit-slider-runnable-track {
        width: 100%;
        height: 6px;
        background: #9a5bf4; /* A cor que você quer para a barra */
        border-radius: 3px;
        cursor: pointer;
    }

    .episode-slider input[type="range"]::-moz-range-track {
        width: 100%;
        height: 6px;
        background: #9a5bf4; /* A cor que você quer para a barra */
        border-radius: 3px;
        cursor: pointer;
    }

    .episode-slider input[type="range"]::-ms-track {
        width: 100%;
        height: 6px;
        background: transparent; /* Necessário para MS Edge/IE para o track */
        border-color: transparent;
        color: transparent;
        cursor: pointer;
    }

    .episode-slider input[type="range"]::-ms-fill-lower {
        background: #9a5bf4; /* Cor da parte "preenchida" para MS Edge/IE */
        border-radius: 3px;
    }

    .episode-slider input[type="range"]::-ms-fill-upper {
        background: #ccc; /* Cor da parte "não preenchida" para MS Edge/IE */
        border-radius: 3px;
    }

    /* Estilo para o "polegar" (o "thumb") */
    .episode-slider input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; /* Remove o estilo padrão do navegador para Webkit */
        height: 18px; /* Tamanho do thumb */
        width: 18px; /* Tamanho do thumb */
        border-radius: 50%; /* Para torná-lo redondo */
        background: #ffffff; /* Cor do thumb (verde para contraste) */
        cursor: pointer;
        margin-top: -6px; /* Ajuste para centralizar o thumb na track */
        box-shadow:
            1px 1px 1px #000000,
            0px 0px 1px #0d0d0d; /* Sombra opcional */
    }

    .episode-slider input[type="range"]::-moz-range-thumb {
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        box-shadow:
            1px 1px 1px #ffffff,
            0px 0px 1px #0d0d0d;
    }

    .episode-slider input[type="range"]::-ms-thumb {
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        margin-top: 0px; /* IE/Edge lidam com a posição do thumb de forma diferente */
        box-shadow:
            1px 1px 1px #ffffff,
            0px 0px 1px #0d0d0d;
    }

    input[type="range"] {
        width: 100%;
    }
</style>
