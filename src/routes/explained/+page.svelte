<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let currentStep = 0;

  // Referências para os elementos de cada passo
  let step1Element;
  let step2Element;
  let step3Element;

  let gameBoard = [
    [0, 0, 2],
    [0, 0, 0],
    [0, 2, 1]
  ];

  let pacmanPosition = { x: 0, y: 0 };
  let animationStep = 0;
  let animationInterval;
  let showReward = false;
  let pacmanRotation = 0; // 0 = direita, 90 = baixo, 180 = esquerda, 270 = cima

  function nextStep() {
    if (currentStep < 3) {
      currentStep++;

      // Se estiver no passo 3, inicia a animação
      if (currentStep === 3) {
        startPacmanAnimation();
      }

      // Rola a página para mostrar o novo conteúdo
      setTimeout(() => {
        const elementToScrollTo = getElementForStep(currentStep);
        if (elementToScrollTo) {
          elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  // Função para obter o elemento correspondente ao passo atual
  function getElementForStep(step) {
    switch(step) {
      case 1:
        return step1Element;
      case 2:
        return step2Element;
      case 3:
        return step3Element;
      default:
        return null;
    }
  }

  function resetDemo() {
    currentStep = 0;
    stopPacmanAnimation();
    pacmanPosition = { x: 0, y: 0 };
    animationStep = 0;
    showReward = false;
    pacmanRotation = 0;

    // Rola a página de volta para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startPacmanAnimation() {
    stopPacmanAnimation();
    animationStep = 0;
    pacmanPosition = { x: 0, y: 0 };

    // Define o caminho que o Pacman vai percorrer
    const path = [
      { x: 0, y: 0 }, // Posição inicial
      { x: 0, y: 1 }, // Desce
      { x: 1, y: 1 }, // Desce
      { x: 2, y: 1 }, // Direita
      { x: 2, y: 2 }  // Desce (até a moeda)
    ];

    function moveStep() {
      if (animationStep < path.length - 1) {
        animationStep++;
        const prevPosition = pacmanPosition;
        pacmanPosition = path[animationStep];

        // Atualiza a rotação do Pacman com base na direção do movimento
        if (pacmanPosition.x > prevPosition.x) {
          pacmanRotation = 0; // Direita
        } else if (pacmanPosition.x < prevPosition.x) {
          pacmanRotation = 180; // Esquerda
        } else if (pacmanPosition.y > prevPosition.y) {
          pacmanRotation = 90; // Baixo
        } else if (pacmanPosition.y < prevPosition.y) {
          pacmanRotation = 270; // Cima
        }

        // Mostra a recompensa quando chegar na moeda
        if (animationStep === path.length - 1) {
          showReward = true;
        }

        animationInterval = setTimeout(moveStep, 800);
      } else {
        // Quando chega ao final, espera 3 segundos e reinicia
        setTimeout(() => {
          showReward = false;
          animationStep = 0;
          pacmanPosition = path[0];
          pacmanRotation = 0;
          animationInterval = setTimeout(moveStep, 800);
        }, 3000);
      }
    }

    // Inicia a animação
    animationInterval = setTimeout(moveStep, 800);
  }

  function stopPacmanAnimation() {
    if (animationInterval) {
      clearTimeout(animationInterval);
      animationInterval = null;
    }
  }

  onMount(() => {
    return () => {
      stopPacmanAnimation();
    };
  });
</script>

<svelte:head>
  <title>What is Reinforcement Learning?</title>
</svelte:head>

<div class="container">
  <h1>The Idea Behind</h1>

  <p>The idea behind Reinforcement Learning is that an agent (an AI) will learn from the environment by interacting with it (through trial and error) and receiving rewards (negative or positive) as feedback for performing actions.</p>

  <p>Learning from interactions with the environment comes from our natural experiences.</p>

  <p>For instance, imagine putting your little brother in front of a video game he never played, giving him a controller, and leaving him alone.</p>

  <!-- Primeiro container - sempre visível -->
  <div class="demo-container">
    <div class="boy-container">
      <img src={base + "/menino.png"} alt="Menino jogando" class="boy-icon" />
    </div>

    <div class="game-container">
      <div class="game-board">
        {#each gameBoard as row, i}
          {#each row as cell, j}
          <div class="game-cell">
            {#if i === 0 && j === 0}
              <img src="{base}/pacman.png" alt="Avatar" class="avatar-icon"/>
            {/if}
            {#if cell === 1}
              <img src="{base}/coin.png" alt="Moeda" class="coin-icon" />
            {/if}
            {#if cell === 2}
              <img src="{base}/fantasma.png" alt="Fantasma" class="ghost-icon" />
            {/if}
          </div>
          {/each}
        {/each}
      </div>
    </div>
  </div>
  <!-- Botões de controle iniciais -->
  {#if currentStep < 1}
    <div class="button-container">
      <button on:click={nextStep} disabled={currentStep >= 3}>Next Step</button>
      <button on:click={resetDemo}>Restart</button>
    </div>
  {/if}

  <!-- Conteúdo do passo 1 - aparece depois do primeiro clique -->
  {#if currentStep >= 1}
    <div bind:this={step1Element} class="step-content">
      <p>Your brother will interact with the environment (the video game) by pressing buttons (actions). At first, he doesn't know what to do, so he tries moving to the right.</p>

      <div class="demo-container">
        <div class="boy-container">
          <img src={base +"/menino.png"} alt="Menino jogando" class="boy-icon" />
        </div>

        <div class="game-container">
          <div class="game-board">
            {#each gameBoard as row, i}
              {#each row as cell, j}
                <div class="game-cell">
                  {#if i === 0 && j === 1}
                      <img src={base + "/pacman.png"} alt="Avatar" class="avatar-icon"/>
                  {/if}
                  {#if cell === 1}
                    <img src={base + "/coin.png"} alt="Moeda" class="coin-icon" />
                  {/if}
                  {#if cell === 2}
                    <img src={base + "/fantasma.png"} alt="Fantasma" class="ghost-icon" />
                  {/if}
                  {#if i === 0 && j === 0}
                    <div class="arrow">→</div>
                  {/if}
                </div>
              {/each}
            {/each}
          </div>
        </div>
      </div>

      <!-- Botões de controle após o passo 1 -->
      {#if currentStep === 1}
        <div class="button-container">
          <button on:click={nextStep} disabled={currentStep >= 3}>Next Step</button>
          <button on:click={resetDemo}>Restart</button>
        </div>
      {/if}
    </div>
  {/if}

  {#if currentStep >= 2}
    <div bind:this={step2Element} class="step-content">
      <p>But then, he moves right again and encounters a ghost. He just died, so that's a -1 reward. He learns that encountering ghosts is bad and should be avoided.</p>

      <div class="demo-container">
        <div class="boy-container">
          <img src={base + "/menino.png"} alt="Menino jogando" class="boy-icon" />
          <div class="death-indicator">-1</div>
        </div>

        <div class="game-container">
          <div class="game-board">
            {#each gameBoard as row, i}
              {#each row as cell, j}
                <div class="game-cell">
                  {#if i === 0 && j === 2}
                      <img src={base + "/pacman.png"} alt="Avatar" class="avatar-icon"/>
                  {/if}
                  {#if cell === 1}
                    <img src={base + "/coin.png"} alt="Moeda" class="coin-icon" />
                  {/if}
                  {#if cell === 2}
                    <img src={base + "/fantasma.png"} alt="Fantasma" class="ghost-icon" />
                  {/if}
                  {#if i === 0 && j === 1}
                    <div class="arrow">→</div>
                  {/if}
                </div>
              {/each}
            {/each}
          </div>
        </div>
      </div>

      <!-- Botões de controle após o passo 2 -->
      {#if currentStep === 2}
        <div class="button-container">
          <button on:click={nextStep} disabled={currentStep >= 3}>Next Step</button>
          <button on:click={resetDemo}>Restart</button>
        </div>
      {/if}
    </div>
  {/if}

  {#if currentStep >= 3}
    <div bind:this={step3Element} class="step-content">
      <p>He continues playing, avoiding ghosts, until he reaches the cherry for the first time. He gets a +1 reward! Now he understands that in this game he must avoid ghosts and collect cherries.</p>

      <div class="demo-container">
        <div class="boy-container">
          <img src={base + "/menino.png"} alt="Menino jogando" class="boy-icon" />
          {#if showReward}
            <div class="reward-indicator">+1</div>
          {/if}
        </div>

        <div class="game-container">
          <div class="game-board">
            {#each gameBoard as row, i}
              {#each row as cell, j}
                <div class="game-cell">
                  {#if i === pacmanPosition.y && j === pacmanPosition.x}
                    <img src={base + "/pacman.png"} alt="Avatar" class="avatar-icon" style="transform: rotate({pacmanRotation}deg);"/>
                  {/if}
                  {#if cell === 1 && !(i === pacmanPosition.y && j === pacmanPosition.x)}
                    <img src={base + "/coin.png"} alt="Moeda" class="coin-icon" />
                  {/if}
                  {#if cell === 2}
                    <img src={base + "/fantasma.png"} alt="Fantasma" class="ghost-icon" />
                  {/if}

                  <!-- Setas indicando o movimento -->
                  {#if animationStep >= 1 && i === 0 && j === 0}
                    <div class="arrow down-arrow">→</div>
                  {/if}
                  {#if animationStep >= 2 && i === 1 && j === 0}
                    <div class="arrow">→</div>
                  {/if}
                  {#if animationStep >= 3 && i === 1 && j === 1}
                    <div class="arrow">→</div>
                  {/if}
                  {#if animationStep >= 4 && i === 1 && j === 2}
                    <div class="arrow down-arrow">→</div>
                  {/if}
                </div>
              {/each}
            {/each}
          </div>
        </div>
      </div>

      <p>By interacting with his environment through trial and error, your little brother understands that he needs to avoid ghosts and collect cherries in this environment. Without any supervision, the child will get better and better at playing the game.</p>

      <p>That's how humans and animals learn, through interaction. Reinforcement Learning is just a computational approach of learning from actions.</p>

      <div class="button-container column">
        <button class="large-button">
          <a href="{base + "/teorical_explanation"}" style="text-decoration: none; color: inherit;">A Formal Definition</a>
        </button>
        <button on:click={resetDemo} class="small-button">Restart</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Lato', sans-serif;
    color: white;
  }

  h1, h2 {
    font-family: 'Press Start 2P', cursive;
    margin-top: 2em;
    margin-bottom: 1em;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 1.5em;
    text-align: justify;
  }

  .step-content {
    margin-top: 2rem;
    padding-top: 1rem;
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .demo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2em 0;
    gap: 2em;
  }

  .boy-container {
    position: relative;
    width: 150px;
    height: 150px;
  }

  .boy-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .death-indicator {
    position: absolute;
    top: -20px;
    right: -20px;
    background-color: red;
    color: white;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 50%;
    animation: pulse 1s infinite;
  }

  .reward-indicator {
    position: absolute;
    top: -20px;
    right: -20px;
    background-color: green;
    color: white;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 50%;
    animation: pulse 1s infinite;
  }

  .game-container {
    background-color: #333;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #666;
  }

  .game-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 4px;
    width: 200px;
    height: 200px;
  }

  .game-cell {
    background-color: #222;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .coin-icon {
    width: 60%;
    height: 60%;
    object-fit: contain;
    z-index: 1;
  }

  .avatar-icon {
    width: 70%;
    height: 70%;
    object-fit: contain;
    z-index: 2;
    animation: bounce 0.5s infinite alternate;
    transition: transform 0.3s ease;
  }

  .ghost-icon {
    width: 60%;
    height: 60%;
    object-fit: contain;
    z-index: 3;
  }

  .arrow {
    position: absolute;
    font-size: 2rem;
    color: yellow;
    z-index: 4;
  }

  .down-arrow {
    transform: rotate(90deg);
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 1em;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  button {
    font-family: 'Press Start 2P', cursive;
    background-color: #333;
    color: white;
    border: 2px solid white;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 0.8rem;
  }

  button:hover:not(:disabled) {
    background-color: #555;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-container.column {
    flex-direction: column;
    gap: 1em;
    margin: 2em auto;
  }

  .large-button {
    width: 100%;
    max-width: 400px;
    padding: 15px 20px;
    font-size: 1.2rem;
    margin: 0 auto;
  }

  .small-button {
    width: auto;
    max-width: 120px;
    padding: 8px 15px;
    font-size: 0.7rem;
    margin: 0 auto;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-5px); }
  }
</style>
