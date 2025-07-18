<script>
    export let alpha = 0.1;
    export let gamma = 0.9;
    export let epsilon = 0.1;
    export let epsilon_decay = 0.003;
    export let n_of_episodes = 1000;
    export let max_steps = 9;
    export let final_accuracy = 1;

    let all_problems_text_ids = [];
    let all_suggestions_text_ids = [];

    function defineTexts(alpha, gamma, epsilon, epsilon_decay, final_accuracy) {
        let problems_text_ids = [];
        let suggestions_text_ids = [];
        let n_texts = 0;

        if (final_accuracy <= 1) {
            let problem_found = false;
            if (alpha < 0.01 && n_texts < 3) {
                problems_text_ids.push("alpha_low");
                n_texts += 1;
                problem_found = true;
            }
            if (gamma < 0.1 && n_texts < 3) {
                problems_text_ids.push("gamma_low");
                n_texts += 1;
                problem_found = true;
            }
            if (epsilon > 0.1 && epsilon_decay > 0.999 && n_texts < 3) {
                problems_text_ids.push("epsilons_combination");
                n_texts += 1;
                problem_found = true;
            }
            if (!problem_found) {
                problems_text_ids.push("max_steps_low");
                n_texts += 1;
            }
        }
        else if (final_accuracy > 1 && final_accuracy < 90) {
            let problem_found = false;
            if (epsilon > 0.1 && n_texts < 3) {
                problems_text_ids.push("epsilon_high");
                n_texts += 1;
                problem_found = true;
            }
            if (epsilon_decay > 0.999 && n_texts < 3) {
                problems_text_ids.push("epsilon_decay_high");
                n_texts += 1;
                problem_found = true;
            }
            if (!problem_found && n_texts < 3) {
                problems_text_ids.push("num_episodes_low");
                n_texts += 1;
            }
        }
        else if (epsilon < 0.01 && n_texts < 3) {
            problems_text_ids.push("epsilon_low");
            n_texts += 1;
        }
        else if (alpha > 0.9 && n_texts < 3) {
            problems_text_ids.push("alpha_high");
            n_texts += 1;
        }
        else if (gamma > 0.99 && n_texts < 3) {
            problems_text_ids.push("gamma_high");
            n_texts += 1;
        }

        if (n_texts < 3) {
            let all_ids = ["alpha_low", "gamma_low", "epsilons_combination", "max_steps_low", "epsilon_high",
                           "epsilon_decay_high", "num_episodes_low", "epsilon_low", "alpha_high", "gamma_high"];
            let shuffled = all_ids.filter(id => !problems_text_ids.includes(id));
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            suggestions_text_ids = shuffled.slice(0, 3 - n_texts);
        }

        return {problems: problems_text_ids, suggestions: suggestions_text_ids};
    }

    $: ({problems: all_problems_text_ids, suggestions: all_suggestions_text_ids} = defineTexts(alpha, gamma, epsilon, epsilon_decay, final_accuracy));
</script>

<ul class="feedback-list">
    {#if all_problems_text_ids}
        {#if final_accuracy < 90}
            <h3 class="feedback-heading problem">Houston, we have a problem...</h3>
        {:else if all_problems_text_ids.length > 0}
            <h3 class="feedback-heading warning">Ok, but something weird may be happening...</h3>
        <!-- {:else}
            <h3 class="feedback-heading success">Nice! What if we try some different things?</h3> -->
        {/if}

        {#if all_problems_text_ids.includes("alpha_low")}
            <li>Your learning rate (alpha) is a bit too shy! It's like your robot is learning to dance in slow motion. Try bumping it up to 0.1 or 0.2 so it can pick up new moves faster!</li>
        {/if}
        {#if all_problems_text_ids.includes("gamma_low")}
            <li>Your discount factor (gamma) is a little short-sighted! It's like your robot only cares about the very next step and forgets about future rewards. Try raising it to 0.8 or 0.9 so it can plan better for the long run!</li>
        {/if}
        {#if all_problems_text_ids.includes("epsilons_combination")}
            <li>Your robot is staying too curious for too long with a high epsilon and high epsilon decay, just wandering instead of using its knowledge; try lowering epsilon (e.g., to 0.1) and decreasing epsilon decay (e.g., to 0.99).</li>
        {/if}
        {#if all_problems_text_ids.includes("max_steps_low")}
            <li>Your robot's 'game time' (maximum steps per episode) is too short! It's like ending the game just as it's figuring things out. Give it more turns so it can learn properly.</li>
        {/if}
        {#if all_problems_text_ids.includes("epsilon_high")}
            <li>Your robot is a bit too adventurous with such a high epsilon! It's like it's just randomly wandering around instead of using all the cool stuff it's learned. This can make it take ages to find the best path. Try bringing it down a bit, maybe to 0.1 or 0.2, so it can focus better!</li>
        {/if}
        {#if all_problems_text_ids.includes("epsilon_decay_high")}
            <li>Your robot's epsilon decay is a bit too slow! It's like your robot is staying curious for ages, constantly exploring even when it should be using what it's learned to find the best path. Try speeding up its learning by decreasing the decay, maybe to 0.99 or 0.995.</li>
        {/if}
        {#if all_problems_text_ids.includes("num_episodes_low")}
            <li>Your robot needs more 'game time'! A low number of episodes means it's not getting enough practice to master the grid world. Try giving it more episodes to really learn the ropes!</li>
        {/if}
        {#if all_problems_text_ids.includes("epsilon_low")}
            <li>Your robot's epsilon is a bit too shy! It's like it's always taking the same familiar path and never dares to explore new ways, which means it might miss out on even better routes! Try bumping it up to 0.1 or 0.2 so it can discover more of the grid world.</li>
        {/if}
        {#if all_problems_text_ids.includes("alpha_high")}
            <li>Your learning rate (alpha) is a bit too excited! It's like your robot is trying to learn by jumping straight into a triple backflip before it's even mastered a pirouette, which can make its learning very unstable. Try bringing it down a notch, maybe to 0.1 or 0.05, so it can learn more smoothly.</li>
        {/if}
        {#if all_problems_text_ids.includes("gamma_high")}
            <li>Your discount factor (gamma) is a bit too focused on the distant future! It's like your robot only cares about rewards way down the road and might ignore what's important right now. Try lowering it to 0.8 or 0.9 for better balance.</li>
        {/if}
    {/if}

    {#if all_suggestions_text_ids && all_suggestions_text_ids.length > 0}
        <h3 class="feedback-heading suggestion-header">It's working! What if we do some tests?</h3>

        {#if all_suggestions_text_ids.includes("alpha_low")}
            <li>Curious what happens when learning slows to a crawl? Try setting your alpha (learning rate) to a tiny value (0.01 or lower) and see how your robot struggles to make progress!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("gamma_low")}
            <li>Curious what happens if your robot only thinks about right now? Try setting your gamma (discount factor) to a super tiny value (0.1 or lower) and watch it completely ignore future rewards!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("epsilons_combination")}
            <li>Curious what happens if your robot just keeps wandering and never learns to focus? Try setting epsilon super high (0.1 or higher) and epsilon decay super high (0.999 or higher), and watch it explore endlessly without making real progress!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("max_steps_low")}
            <li>Ever wondered what happens if the 'game timer' runs out too fast? Set your maximum steps per episode super low and watch your robot's attempts get cut short before it can even learn!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("epsilon_high")}
            <li>Want to see your robot get super distracted? Set epsilon to a really high value (0.1 or higher) and watch it wander around aimlessly instead of sticking to the plan!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("epsilon_decay_high")}
            <li>Want to see your robot stay a random explorer forever? Set epsilon decay to a super high value (0.999 or higher) and watch it never truly settle down and exploit its best paths!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("num_episodes_low")}
            <li>Want to see your robot stay a total beginner? Set your number of episodes to a tiny amount and watch it struggle to learn anything substantial!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("epsilon_low")}
            <li>Want to see your robot get stuck in a rut? Set epsilon to a super tiny value (0.01 or lower) and watch it never truly explore new paths!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("alpha_high")}
            <li>Want to see your robot learn in a chaotic, wild way? Set your alpha (learning rate) to a super high value (0.9 or higher) and watch it bounce all over the place without settling down!</li>
        {/if}
        {#if all_suggestions_text_ids.includes("gamma_high")}
            <li>Want to see your robot get stuck thinking too far ahead? Set your gamma (discount factor) to a super high value (0.99 or higher) and watch it ignore all the important steps right in front of it!</li>
        {/if}
    {/if}
</ul>

<style>
    body {
        background-color: #1e1e1e;
        color: #e0e0e0;
        font-family: 'DotGothic16', sans-serif;
        margin: 0;
        padding: 20px;
    }

    .feedback-list {
        background-color: #161616;
        /* border: 1px solid #454b5e; */
        border-radius: 8px;
        padding: 5px 15px;
        margin: 40px auto;
        max-width: 500px;
        /* box-shadow: 0 0 15px rgba(0, 174, 255, 0.2); */
    }

    .feedback-heading {
        font-family: 'Press Start 2P', cursive;
        text-align: center;
        font-size: 0.8em;
        margin-bottom: 10px;
        padding-bottom: 10px;
        margin-top: 12px;
        border-bottom: 1px dashed #454b5e;
        color: #e0e0e0;
    }

    .feedback-heading.problem {
        color: #ff4d4d;
        /* text-shadow: 0 0 8px rgba(255, 77, 77, 0.5); */
    }

    .feedback-heading.warning {
        color: #ffeb3b;
        /* text-shadow: 0 0 8px rgba(255, 235, 59, 0.5); */
    }

    .feedback-heading.suggestion-header {
        color: #8a81ed;
        /* text-shadow: 0 0 8px rgba(0, 174, 255, 0.5); */
    }

    .feedback-list li {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 0.8em;
        line-height: 1.6;
        margin-bottom: 5px;
        background-color: #1a1a2e;
        padding: 5px 5px;
        border-left: 3px solid #58a3e9;
        border-radius: 5px;
        transition: background-color 0.3s ease, transform 0.2s ease;
        list-style: none;
        position: relative;
        padding-left: 25px;
    }

    .feedback-list li::before {
        content: '🎮';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 5px;
        font-size: 0.8em;
    }

    /*
    .feedback-list li:hover {
        background-color: #2a2a44;
        transform: translateY(-2px);
    }
    */

    @media (max-width: 768px) {
        .feedback-list {
            margin: 20px auto;
            padding: 15px 20px;
            border-radius: 5px;
        }

        .feedback-heading {
            font-size: 1em;
            margin-bottom: 20px;
        }

        .feedback-list li {
            font-size: 0.95em;
            padding: 10px 15px;
            margin-bottom: 10px;
            padding-left: 25px;
        }
    }

    @media (max-width: 480px) {
        .feedback-list {
            margin: 10px auto;
            padding: 10px 15px;
        }

        .feedback-heading {
            font-size: 0.9em;
            margin-bottom: 15px;
        }

        .feedback-list li {
            font-size: 0.9em;
            line-height: 1.5;
            margin-bottom: 8px;
            padding: 8px 12px;
            padding-left: 20px;
        }
    }
</style>
