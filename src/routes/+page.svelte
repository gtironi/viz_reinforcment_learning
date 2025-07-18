<script>
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    function goToVisualization() {
        goto(`${base}/visualization`);
    }

    function goToExplanation() {
        goto(`${base}/explained`);
    }

    function goToTheory() {
        goto(`${base}/teorical_explanation`);
    }
</script>

<svelte:head>
    <title>Reinforcement Learning Unveiled</title>
</svelte:head>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Press+Start+2P&display=swap"
    rel="stylesheet"
/>

<div class="main-container">
    <!-- Seção de Aprendizado -->
    <div class="learning-section">
        <div class="explanation-card">
            <h3>What is Reinforcement Learning?</h3>
            <p>
                Understand the basic concepts behind reinforcement learning
                through an interactive, step-by-step explanation with visual
                examples.
            </p>
            <button class="btn-secondary" on:click={goToExplanation}>
                Learn the Basics
            </button>
        </div>

        <div class="explanation-card">
            <h3>Formal Definition</h3>
            <p>
                Dive deeper into the theory with formal definitions of agents,
                environments, policies, and rewards in reinforcement learning.
            </p>
            <button class="btn-secondary" on:click={goToTheory}>
                Explore Theory
            </button>
        </div>
    </div>

    <!-- Seção de Visualização Interativa -->
    <div class="visualization-showcase">
        <div class="showcase-content">
            <h2>Interactive Visualization</h2>
            <p>
                Explore how reinforcement learning works by interacting with a
                live model. Adjust parameters, watch the agent learn, and see
                the results in real time.
            </p>
            <button class="btn-primary" on:click={goToVisualization}>
                Start Exploring
            </button>
        </div>
    </div>

    <!-- Recursos: Vídeos e Relatório -->
    <div class="resources-section">
        <h2>Project Resources</h2>

        <div class="video-grid">
            <div class="video-card">
                <h3>Teaser</h3>
                <div class="video-wrapper">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/VTPore3dL1A" 
                            title="Teaser - Reinforcement Learning Unveiled" 
                            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>

            <div class="video-card">
                <h3>Full Presentation</h3>
                <div class="video-wrapper">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/ZsLunhm9WqM" 
                            title="Full Presentation - Reinforcement Learning Unveiled" 
                            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
        </div>

        <div class="paper-link">
            <h3>Full Report (PDF)</h3>
            <a href="https://github.com/FGV-VIS-2025/final-project-rl-explained-vis/blob/main/FinalPaper.pdf?raw=true" 
               target="_blank" rel="noopener noreferrer" class="btn-secondary">
                Download Report
            </a>
        </div>
    </div>

    <!-- Sobre o Projeto -->
    <div class="about-section">
        <h2>About This Project</h2>
        <div class="about-content">
            <p>
                This interactive learning platform helps demystify reinforcement
                learning by combining visual explanations with hands-on
                exploration. Our main focus is the interactive visualization
                that lets you control the learning process and see how RL works
                using Q-learning.
            </p>
            <p>
                This project was developed as part of the Data Visualization
                course at FGV. The main inspirations were the projects <a href="https://jalammar.github.io/illustrated-transformer/">The Illustrated Transformer</a> and <a href="https://huggingface.co/learn/deep-rl-course/unit0/introduction">Hugging Face</a>. To run it locally, clone the repository at <a href="https://github.com/FGV-VIS-2025/final-project-rl-explained-vis">this link</a> and, after installing the dependencies required by Svelte, run "npm run dev --open".
            </p>
        </div>

        <!-- Autores -->
        <div class="authors-section">
            <h3>Developed by</h3>
            <div class="authors-list">
                <a
                    href="https://github.com/kauanmaf"
                    class="author-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div class="author-card">
                        <span class="author-name">Kauan Mariani Ferreira</span>
                        <span class="github-icon">GitHub</span>
                    </div>
                </a>
                <a
                    href="https://github.com/PedroPHC25"
                    class="author-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div class="author-card">
                        <span class="author-name">Pedro Henrique Coterli</span>
                        <span class="github-icon">GitHub</span>
                    </div>
                </a>
                <a
                    href="https://github.com/gtironi"
                    class="author-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div class="author-card">
                        <span class="author-name">Gustavo Tironi</span>
                        <span class="github-icon">GitHub</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>


<style>
    /* Letra média */
    h2 {
        font-family: "Press Start 2P", monospace;
        font-size: 1.2rem;
        margin-top: 1rem;
        margin-bottom: 1.2rem;
        color: white;
    }

    /* Letra menor */
    h3 {
        font-family: "Press Start 2P", monospace;
        font-size: 1rem;
        margin-bottom: 1.2rem;
        color: white;
    }

    /* Muda o estilo do paragrafo*/
    p {
        font-family: "Lato", sans-serif;
        font-size: 1rem;
        color: white;
        margin-bottom: 1.5rem;
    }

    .main-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    /* Box da viz */
    .visualization-showcase {
        background-color: #2d2d2d;
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    /* Muda espaço do paragrafo*/
    .showcase-content p {
        font-size: 1.2rem;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }

    /* Box das explicaçẽos em 2 colunas*/
    .learning-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .explanation-card {
        background-color: #2d2d2d;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
    }

    /* Box d osobre*/
    .about-section {
        background-color: #2d2d2d;
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    .about-content {
        max-width: 800px;
        margin: 0 auto 2rem;
    }

    /* Aumenta um pouco a letra*/
    .about-section p {
        font-size: 1.1rem;
    }

    /* Botoes da Viz */
    .btn-primary {
        background-color: #9a5bf4;
        color: white;
        font-family: "Press Start 2P", monospace;
        font-size: 1.2rem;
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }

    .btn-primary:hover {
        background-color: #b278ff;
    }

    /* Botões das explicações */
    .btn-secondary {
        background-color: #9a5bf4;
        color: white;
        font-family: "Press Start 2P", monospace;
        font-size: 0.8rem;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }

    .btn-secondary:hover {
        background-color: #b278ff;
    }

    /* Autores */
    .authors-section {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #444;
    }

    /* Coloca os autores lado a lado */
    .authors-list {
        display: flex;
        justify-content: center;
        gap: 2rem;
    }

    .author-link {
        text-decoration: none;
        color: inherit;
    }

    /* Cria um box bonitinho para os autores */
    .author-card {
        background-color: #333;
        border: 2px solid #444;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        text-align: center;
    }

    .author-link:hover .author-card {
        border-color: #9a5bf4;
    }

    .author-name {
        font-family: "Lato", sans-serif;
        font-weight: bold;
        color: white;
        margin-bottom: 0.5rem;
    }

    /* Firula para ficar bonito*/
    .github-icon {
        font-family: "Press Start 2P", monospace;
        font-size: 0.6rem;
        color: #9a5bf4;
        padding: 0.3rem 0.6rem;
        background-color: #222;
        border-radius: 4px;
    }
    .video-section {
    background-color: #2d2d2d;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.video-section h2 {
    margin-bottom: 1.5rem;
    color: white;
}

.video-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
}

.video-card {
    flex: 1 1 45%;
    min-width: 300px;
}

.video-card h3 {
    color: white;
    margin-bottom: 1rem;
}

.video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 ratio */
    height: 0;
}

.video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
}

/* Ajuste extra para telas muito pequenas */
@media (max-width: 700px) {
    .video-card {
        flex: 1 1 100%;
    }
}
/* Seção de Recursos (vídeos e relatório) */
.resources-section {
    background-color: #2d2d2d;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.resources-section h2 {
    color: white;
    margin-bottom: 1.5rem;
}

.resources-section p {
    color: white;
    margin-bottom: 1rem;
}

.paper-link {
    margin-top: 2rem;
}

.paper-link a {
    display: inline-block;
    margin-top: 0.5rem;
    background-color: #9a5bf4;
    color: white;
    font-family: "Press Start 2P", monospace;
    font-size: 0.8rem;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 6px;
    text-decoration: none;
}

.paper-link a:hover {
    background-color: #b278ff;
}

    a {
        color: #b278ff;
    }

</style>
