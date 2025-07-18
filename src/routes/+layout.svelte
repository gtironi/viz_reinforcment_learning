<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  function returnStart()
  {
    goto(`${base}/`);
  }

  function gotoLearn(){
    goto(`${base}/explained/`)
  }

  function gotoExplore(){
    goto(`${base}/q_learn`)
  }

  function gotoVis(){
    goto(`${base}/visualization`)
  }
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Tiny5&family=VT323&display=swap" rel="stylesheet">

<div class="header" on:click={returnStart} role="button" tabindex="0">
  <h1>Reinforcement Learning Unveiled</h1>
  <h2> <span class="clickable-word" on:click|stopPropagation={gotoLearn}>Learn</span>
  ·
  <span class="clickable-word" on:click|stopPropagation={gotoExplore}>Explore</span>
  ·
  <span class="clickable-word" on:click|stopPropagation={gotoVis}>Visualize</span>
</h2>
</div>

<slot></slot>


<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #1e1e1e;
        color: white;
        font-family: "Press Start 2P";
    }

    .header {
        background: linear-gradient(135deg, #7b42f6 0%, #b01eff 100%);
        padding: 1rem 2rem;
        text-align: center;
        color: white;
        cursor: pointer;
        margin-bottom: 1.5rem;
    }

    h1 {
        font-family: "Press Start 2P", sans-serif;
        font-size: 1.5rem;
        text-align: center;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        border-right: 2px solid white;
        width: 0;
        margin: 0 auto;
        animation: typing 3s steps(22, end) forwards,
                   blink 0.7s step-end infinite,
                   shake 2s infinite;
    }

    h2 {
        font-family: 'Press Start 2P', monospace;
        font-size: 0.8rem;
        margin-top: 0.8rem;
        margin-bottom: 0;
    }

    @keyframes typing {
      from { width: 0 }
      to { width: 32ch } /* 22 characters in "Reinforcement Learning" */
    }

    @keyframes blink {
      50% { border-color: transparent }
    }
</style>
