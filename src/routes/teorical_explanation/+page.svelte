<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  function returnToExplained() {
    goto(`${base}/explained`);
  }

  let currentSection = 'agent';

  function navigateToSection(section) {
    currentSection = section;
  }

  onMount(() => {
    // Inicializa a visualização ou configurações necessárias
  });
</script>

<svelte:head>
  <title>Formal Definition</title>
</svelte:head>

<div class="container">
  <h1>A Formal Definition</h1>

  <nav class="section-nav">
    <ul>
      <li><button class:active={currentSection === 'agent'} on:click={() => navigateToSection('agent')}>Agent</button></li>
      <li><button class:active={currentSection === 'environment'} on:click={() => navigateToSection('environment')}>Environment</button></li>
      <li><button class:active={currentSection === 'rewards'} on:click={() => navigateToSection('rewards')}>Rewards</button></li>
      <li><button class:active={currentSection === 'policy'} on:click={() => navigateToSection('policy')}>Policy</button></li>
    </ul>
  </nav>

  <!-- Section 1: Agent -->
  {#if currentSection === 'agent'}
  <section class="section" data-section="agent">
    <div class="section-container">
      <div class="text-content">
        <h2>The Agent</h2>
        <p>An <strong>agent</strong> is the learner and decision-maker in reinforcement learning. It's the entity that takes actions in an environment to achieve a goal.</p>

        <div class="key-points">
          <h3>Key Characteristics:</h3>
          <ul>
            <li><strong>Autonomous:</strong> Makes decisions independently</li>
            <li><strong>Goal-oriented:</strong> Seeks to maximize cumulative reward</li>
            <li><strong>Adaptive:</strong> Learns from experience over time</li>
            <li><strong>Interactive:</strong> Constantly engages with its environment</li>
          </ul>
        </div>

        <p>The agent observes the current state of the environment and selects actions based on its current knowledge and strategy. Initially, the agent may make random or poor decisions, but through experience, it learns to make better choices.</p>
      </div>

      <div class="visual-content">
        <div class="agent-visualization">
          <img src="{base}/pacman.png" alt="Pacman Agent" class="agent-image">
          <div class="actions-container">
            <h3>Available Actions</h3>
            <div class="action-grid">
              <div class="action-cell"></div>
              <div class="action-cell action-up">
                <span class="action-arrow">↑</span>
                <span class="action-label">Up</span>
              </div>
              <div class="action-cell"></div>
              <div class="action-cell action-left">
                <span class="action-arrow">←</span>
                <span class="action-label">Left</span>
              </div>
              <div class="action-cell agent-cell">
                <img src="{base}/pacman.png" alt="Pacman" class="small-agent">
              </div>
              <div class="action-cell action-right">
                <span class="action-arrow">→</span>
                <span class="action-label">Right</span>
              </div>
              <div class="action-cell"></div>
              <div class="action-cell action-down">
                <span class="action-arrow">↓</span>
                <span class="action-label">Down</span>
              </div>
              <div class="action-cell"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <!-- Section 2: Environment -->
  {#if currentSection === 'environment'}
  <section class="section" data-section="environment">
    <div class="section-container">
      <div class="text-content">
        <h2>The Environment</h2>
        <p>The <strong>environment</strong> is everything external to the agent. It's the world in which the agent operates and includes all factors that can affect the agent's performance.</p>

        <div class="key-points">
          <h3>Environment Properties:</h3>
          <ul>
            <li><strong>States:</strong> All possible situations the agent can encounter</li>
            <li><strong>Dynamics:</strong> How the environment changes in response to actions</li>
            <li><strong>Feedback:</strong> Provides rewards and new states to the agent</li>
            <li><strong>Rules:</strong> Defines what actions are possible in each state</li>
          </ul>
        </div>

        <p>In our example, we have a deterministic environment where Pacman moves in a grid. If he encounters a ghost, he dies. The environment is deterministic because the ghosts and the cherry are always in the same position.</p>
      </div>

      <div class="visual-content">
        <div class="environment-grid">
          <div class="grid-row">
            <div class="grid-cell"><img src="{base}/pacman.png" alt="Pacman" class="small-agent"></div>
            <div class="grid-cell"><img src="{base}/fantasma.png" alt="Fantasma" class="ghost-icon"></div>
            <div class="grid-cell"></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"></div>
            <div class="grid-cell"><img src="{base}/fantasma.png" alt="Fantasma" class="ghost-icon"></div>
            <div class="grid-cell"><img src="{base}/coin.png" alt="Cherry" class="coin-icon"></div>
          </div>
        </div>
        <div class="environment-legend">
          <div class="legend-item">
            <img src="{base}/pacman.png" alt="Pacman" class="small-agent">
            <span>Agent</span>
          </div>
          <div class="legend-item">
            <img src="{base}/coin.png" alt="Cherry" class="coin-icon">
            <span>Goal</span>
          </div>
          <div class="legend-item">
            <img src="{base}/fantasma.png" alt="Fantasma" class="ghost-icon">
            <span>Danger</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <!-- Section 3: Rewards -->
  {#if currentSection === 'rewards'}
  <section class="section" data-section="rewards">
    <div class="section-container">
      <div class="text-content">
        <h2>Rewards</h2>
        <p>The <strong>reward signal</strong> is the primary way the environment communicates with the agent about the quality of its actions. It's the foundation of learning in RL.</p>

        <div class="key-points">
          <h3>Types of Rewards:</h3>
          <ul>
            <li><strong>Positive:</strong> Encourages the behaviors that lead to this outcome</li>
            <li><strong>Negative:</strong> Discourages the behaviors that lead to this outcome (also called penalties)</li>
            <li><strong>Zero:</strong> Neutral feedback, neither encouraging nor discouraging</li>
          </ul>
        </div>

        <p>The reward signal must be carefully designed to align with the desired behavior. </p>
      </div>

      <div class="visual-content">
        <div class="rewards-visualization">
          <div class="reward-timeline">
            <div class="timeline-point negative">
              <div class="reward-value">-1</div>
              <div class="reward-label">Each Step</div>
            </div>
            <div class="timeline-point negative">
              <div class="reward-value">-100</div>
              <div class="reward-label">Ghost</div>
            </div>
            <div class="timeline-point positive">
              <div class="reward-value">+100</div>
              <div class="reward-label">Cherry</div>
            </div>
          </div>
          <div class="cumulative-reward">
            <div class="reward-explanation">
              <p>Pacman receives -1 for each step taken, encouraging it to find the shortest path.</p>
              <p>Gets +100 when collecting a cherry, -100 when hitting a ghost.</p>
              <p>The game ends when either a cherry is collected, a ghost is hit or a limit number of steps is reached.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/if}


  <!-- Section 5: Policy -->
  {#if currentSection === 'policy'}
  <section class="section" data-section="policy">
    <div class="section-container">
      <div class="text-content">
        <h2>Policy</h2>
        <p>A <strong>policy</strong> is the agent's function that maps states to actions. It represents what the agent has learned about how to behave in different situations.</p>

        <div class="key-points">
          <h3>Types of Policies:</h3>
          <ul>
            <li><strong>Deterministic:</strong> Always selects the same action for a given state</li>
            <li><strong>Stochastic:</strong> Selects actions based on probabilities</li>
            <li><strong>Optimal:</strong> The best possible policy that maximizes expected reward</li>
            <li><strong>Greedy:</strong> Always chooses the action with highest estimated value</li>
          </ul>
        </div>

        <p>The goal of reinforcement learning is to find an optimal policy that maximizes the expected cumulative reward over time. The agent updates its policy after each game, gradually improving its decision-making as it gains more experience.</p>

        <div class="formula">
          <h4>Policy Notation:</h4>
          <code>π(→|s) = probability of taking action → in state s</code>
        </div>

        <p>In our example, the learned policy indicates the best direction to follow in each grid position.</p>
      </div>

      <div class="visual-content">
        <div class="policy-visualization">
          <div class="policy-grid">
            <div class="policy-row">
              <div class="policy-cell"><img src="{base}/pacman.png" alt="Pacman" class="small-agent"></div>
              <div class="policy-cell"><img src="{base}/fantasma.png" alt="Fantasma" class="ghost-icon"></div>
              <div class="policy-cell"><span class="policy-question">?</span></div>
            </div>
            <div class="policy-row">
              <div class="policy-cell"><span class="policy-arrow right">→</span></div>
              <div class="policy-cell"><span class="policy-arrow right">→</span></div>
              <div class="policy-cell"><span class="policy-arrow down">↓</span></div>
            </div>
            <div class="policy-row">
              <div class="policy-cell"><span class="policy-question">?</span></div>
              <div class="policy-cell"><img src="{base}/fantasma.png" alt="Fantasma" class="ghost-icon"></div>
              <div class="policy-cell"><img src="{base}/coin.png" alt="Cherry" class="coin-icon"></div>
            </div>
          </div>
          <div class="policy-explanation">
            <p>The arrows represent the most likely actions the agent has learned so far for each state.</p>
            <p>The "?" indicate that the agent hasn't yet learned a specific policy for that grid cell.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <div class="button-container column">
    <button class="large-button">
      <a href="{base + "/q_learn"}" style="text-decoration: none; color: inherit;">How does it learn?</a>
    </button>
    <button class="small-button" on:click={returnToExplained}>Return</button>
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Lato', sans-serif;
    color: white;
  }

  h1, h2, h3, h4 {
    font-family: 'Press Start 2P', cursive;
    margin-top: 1em;
    margin-bottom: 0.8em;
  }

  h1 {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 1.5em;
  }

  h2 {
    font-size: 1.4rem;
    border-bottom: 2px solid #444;
    padding-bottom: 0.5em;
  }

  h3 {
    font-size: 1rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.2em;
    text-align: justify;
  }

  .section-nav {
    margin-bottom: 2em;
  }

  .section-nav ul {
    display: flex;
    justify-content: space-around;
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
  }

  .section-nav button {
    font-family: 'Press Start 2P', cursive;
    background-color: #333;
    color: white;
    border: 2px solid #555;
    padding: 10px 15px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.8rem;
    margin: 5px;
  }

  .section-nav button:hover, .section-nav button.active {
    background-color: #555;
    border-color: #777;
  }

  .section {
    margin-bottom: 4em;
    padding: 1em;
    border-radius: 8px;
    background-color: #2a2a2a;
  }

  .section-container {
    display: flex;
    flex-direction: row;
    gap: 2em;
  }

  .text-content {
    flex: 1;
  }

  .visual-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .key-points {
    background-color: #333;
    padding: 1em;
    border-radius: 8px;
    margin: 1.5em 0;
  }

  .key-points ul {
    padding-left: 1.5em;
  }

  .key-points li {
    margin-bottom: 0.5em;
  }

  .formula {
    background-color: #333;
    padding: 1em;
    border-radius: 8px;
    margin: 1.5em 0;
    font-family: monospace;
  }

  code {
    font-family: monospace;
    background-color: #444;
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }

  /* Agent Visualization */
  .agent-visualization {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2em;
  }

  .agent-image {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  .actions-container {
    width: 100%;
    max-width: 300px;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 5px;
  }

  .action-cell {
    background-color: #333;
    border-radius: 4px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .agent-cell {
    background-color: #444;
  }

  .action-arrow {
    font-size: 1.5rem;
    color: #ffcc00;
  }

  .action-label {
    font-size: 0.7rem;
    margin-top: 5px;
  }

  .small-agent {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  /* Environment Visualization */
  .environment-grid {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .grid-row {
    display: flex;
    gap: 5px;
  }

  .grid-cell {
    width: 60px;
    height: 60px;
    background-color: #333;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .danger-cell {
    background-color: #f44336;
  }

  .coin-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  .environment-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .small-danger-cell {
    width: 20px;
    height: 20px;
    background-color: #f44336;
    border-radius: 4px;
  }

  /* Rewards Visualization */
  .rewards-visualization {
    width: 100%;
    max-width: 400px;
  }

  .reward-timeline {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    position: relative;
  }

  .reward-timeline::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #555;
    z-index: 0;
  }

  .timeline-point {
    background-color: #333;
    border-radius: 8px;
    padding: 10px;
    z-index: 1;
    text-align: center;
  }

  .timeline-point.positive {
    border: 2px solid #4caf50;
  }

  .timeline-point.negative {
    border: 2px solid #f44336;
  }

  .timeline-point.neutral {
    border: 2px solid #ffeb3b;
  }

  .reward-value {
    font-size: 1.2rem;
    font-weight: bold;
    font-family: 'Press Start 2P', cursive;
  }

  .positive .reward-value {
    color: #4caf50;
  }

  .negative .reward-value {
    color: #f44336;
  }

  .neutral .reward-value {
    color: #ffeb3b;
  }

  .reward-label {
    font-size: 0.8rem;
    margin-top: 5px;
  }

  .cumulative-reward {
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }

  .cumulative-label {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .cumulative-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #4caf50;
    font-family: 'Press Start 2P', cursive;
  }

  .reward-explanation {
    margin-top: 15px;
    text-align: left;
    font-size: 0.9rem;
  }

  .reward-explanation p {
    font-size: 0.9rem;
    margin-bottom: 0.5em;
  }

  /* Policy Visualization */
  .policy-visualization {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .policy-grid {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 20px;
    align-items: center;
  }

  .policy-row {
    display: flex;
    gap: 5px;
    justify-content: center;
  }

  .policy-cell {
    width: 60px;
    height: 60px;
    background-color: #333;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .policy-arrow {
    font-size: 1.5rem;
    color: #ffcc00;
  }

  .policy-question {
    font-size: 1.5rem;
    color: #ffcc00;
    font-weight: bold;
  }

  .goal-cell {
    background-color: #4caf50;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .ghost-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  .policy-explanation {
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .policy-explanation p {
    font-size: 0.9rem;
    margin-bottom: 0.5em;
    text-align: center;
  }

  /* Button Container */
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 2em;
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
    font-family: 'Press Start 2P', cursive;
    background-color: #333;
    color: white;
    border: 2px solid white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .large-button:hover {
    background-color: #555;
  }

  .small-button {
    width: auto;
    max-width: 120px;
    padding: 8px 15px;
    font-size: 0.7rem;
    margin: 0 auto;
    font-family: 'Press Start 2P', cursive;
    background-color: #333;
    color: white;
    border: 2px solid white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .small-button:hover {
    background-color: #555;
  }

  /* Responsive Design */
  @media (max-width: 900px) {
    .section-container {
      flex-direction: column;
    }

    .visual-content {
      margin-top: 2em;
    }
  }

  /* Q-values Visualization */
  .qvalues-visualization {
    width: 100%;
    max-width: 400px;
  }

  .qvalues-grid {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 20px;
  }

  .qvalues-row {
    display: flex;
    gap: 5px;
  }

  .qvalues-cell {
    width: 60px;
    height: 60px;
    background-color: #000033;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .qvalues-cell.medium-value {
    background-color: #0055aa;
  }

  .qvalues-cell.high-value {
    background-color: #00aaff;
  }

  .qvalues-cell.highest-value {
    background-color: #55ffff;
  }

  .qvalues-legend {
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
  }

  .qvalue-scale {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .scale-gradient {
    flex-grow: 1;
    height: 20px;
    margin: 0 10px;
    background: linear-gradient(to right, #000033, #0055aa, #00aaff, #55ffff);
    border-radius: 4px;
  }

  .scale-label {
    font-size: 0.8rem;
  }

  .scale-label.high {
    color: #55ffff;
  }

  .qvalues-legend p {
    font-size: 0.9rem;
    margin-bottom: 0;
  }
</style>
