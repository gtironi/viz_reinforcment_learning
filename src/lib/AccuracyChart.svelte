<script>
    import * as d3 from "d3";

    export let success_rates_data = [];
    export let currentEpisode = 0;
    export let width = 1000;
    export let height = 300;
    export let speedIndex = 0;
    export let playing;

    import InfoTooltip from './InfoTooltip.svelte';

    let svgContainer;

    let focusLine;
    let focusCircle;
    let tooltip;
    let tooltipBg;
    let tooltipTextEpisode;
    let tooltipTextRate;
    let overlayRect;

    let interactiveElementsCreated = false;

    // Função reativa para desenhar/atualizar o gráfico
    $: if (svgContainer && success_rates_data.length > 0) {
        const svg = d3.select(svgContainer);
        drawChart(svg, width, height, success_rates_data.slice(0, currentEpisode + 1));
        
        if (!interactiveElementsCreated) {
            createInteractiveElements(svg, width, height);
            interactiveElementsCreated = true;
        }
        
        if (focusLine && focusCircle && tooltip && overlayRect) {
            focusLine.raise();
            focusCircle.raise();
            tooltip.raise();
            overlayRect.raise(); 
        }
    }

    function createInteractiveElements(svg, w, h) {
        const margin = { top: 30, right: 48, bottom: 50, left: 60 };

        // Elementos de interatividade
        focusLine = svg.append("line")
            .attr("class", "focus-line")
            .attr("y1", margin.top)
            .attr("y2", h - margin.bottom)
            .attr("stroke", "#6B5FE8")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0);

        focusCircle = svg.append("circle")
            .attr("class", "focus-circle")
            .attr("r", 5)
            .attr("fill", "#6B5FE8")
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0);

        tooltip = svg.append("g")
            .attr("class", "tooltip")
            .attr("opacity", 0);

        tooltipBg = tooltip.append("rect")
            .attr("width", 90)
            .attr("height", 40)
            .attr("fill", "rgba(0, 0, 0, 0.9)")
            .attr("rx", 5)
            .attr("ry", 5);

        tooltipTextEpisode = tooltip.append("text")
            .attr("x", 10)
            .attr("y", 16)
            .style("fill", "white");

        tooltipTextRate = tooltip.append("text")
            .attr("x", 10)
            .attr("y", 31)
            .style("fill", "white");

        // Retângulo invisível para capturar eventos do mouse sobre a área do gráfico
        overlayRect = svg.append("rect") 
            .attr("class", "overlay")
            .attr("width", w - margin.left - margin.right)
            .attr("height", h - margin.top - margin.bottom)
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            // .on("mouseover", () => {
            //     focusLine.raise().transition().duration(50).attr("opacity", 0.15);
            //     focusCircle.raise().transition().duration(50).attr("opacity", 0.5);
            //     tooltip.raise().transition().duration(50).attr("opacity", 1);
            // })
            .on("mouseout", () => {
                focusLine.transition().duration(50).attr("opacity", 0);
                focusCircle.transition().duration(50).attr("opacity", 0);
                tooltip.transition().duration(50).attr("opacity", 0);
            })
            .on("mousemove", mousemove)
            .on("click", clickHandler);
    }

    function drawChart(svg, w, h, data) {
        const margin = { top: 30, right: 48, bottom: 50, left: 60 };

        svg.attr("width", w)
           .attr("height", h);

        // Remover elementos que serão redesenhados a cada atualização
        svg.selectAll(".chart-line, .last-point-circle, .last-point-line, .success-rate-label").remove();

        const x = d3
            .scaleLinear()
            .domain([0, success_rates_data.length > 0 ? success_rates_data.length - 1 : 0])
            .range([margin.left, w - margin.right]);

        const y = d3
            .scaleLinear()
            .domain([0, 100])
            .nice()
            .range([h - margin.bottom, margin.top]);

        const line = d3
            .line()
            .x((d, i) => x(i))
            .y((d) => y(d));

        const tickInterval = Math.round(success_rates_data.length / 100) * 10;
        const xTicks = [];
        const totalEpisodes = success_rates_data.length;
        
        for (let i = 0; i <= totalEpisodes; i += tickInterval) {
            xTicks.push(i);
        }

        if (totalEpisodes > 0 && xTicks[xTicks.length - 1] < totalEpisodes - 1) {
            xTicks.push(totalEpisodes - 1);
        }

        // Eixos e Títulos de Eixos
        const xAxisGroup = svg.selectAll(".x-axis-group").data([null]);
        xAxisGroup.enter().append("g")
            .attr("class", "x-axis-group")
            .attr("transform", `translate(0,${h - margin.bottom})`)
            .merge(xAxisGroup)
            .call(d3.axisBottom(x).tickValues(xTicks));

        const yAxisGroup = svg.selectAll(".y-axis-group").data([null]);
        yAxisGroup.enter().append("g")
            .attr("class", "y-axis-group")
            .attr("transform", `translate(${margin.left},0)`)
            .merge(yAxisGroup)
            .call(d3.axisLeft(y));

        svg.selectAll(".x-axis-label").data([null]).enter().append("text")
            .attr("class", "x axis-label")
            .merge(svg.selectAll(".x-axis-label"))
            .attr("text-anchor", "middle")
            .attr("x", w / 2 + 35)
            .attr("y", h - 12)
            .style("fill", "#ffffff")
            .text("Episodes");

        svg.selectAll(".y-axis-label").data([null]).enter().append("text")
            .attr("class", "y axis-label")
            .merge(svg.selectAll(".y-axis-label"))
            .attr("text-anchor", "middle")
            .attr("x", - (h / 2) + 15)
            .attr("y", margin.left - 45)
            .attr("transform", "rotate(-90)")
            .style("fill", "#ffffff")
            .text("Success Rate (%)");

        // Linha do gráfico
        svg.append("path")
            .datum(data)
            .attr("class", "chart-line")
            .attr("fill", "none")
            .attr("stroke", "#6B5FE8")
            .attr("stroke-width", 2)
            .attr("d", line);

        if (data.length > 0) {
            const lastDataPoint = data[data.length - 1];
            const lastEpisodeIndex = data.length - 1;

            const circleX = x(lastEpisodeIndex);
            const circleY = y(lastDataPoint);

            // Círculo do último ponto
            svg.append("circle")
                .attr("class", "last-point-circle")
                .attr("cx", circleX)
                .attr("cy", circleY)
                .attr("r", 5)
                .attr("fill", "#6B5FE8")
                .attr("stroke", "white")
                .attr("stroke-width", 1.5);

            // Linha vertical do último ponto
            svg.append("line")
                .attr("class", "last-point-line")
                .attr("x1", circleX)
                .attr("y1", margin.top)
                .attr("x2", circleX)
                .attr("y2", h - margin.bottom)
                .attr("stroke", "#6B5FE8")
                .attr("stroke-width", 2)
                .attr("opacity", 0.2);

            // Texto da taxa de sucesso do último ponto
            svg.append("text")
                .attr("class", "success-rate-label")
                .attr("x", circleX + 12)
                .attr("y", lastDataPoint < 7 ? y(7) + 5 : circleY + 5)
                .attr("text-anchor", "left")
                .style("fill", "white")
                .text(`${Math.trunc(lastDataPoint)}%`);
        }
    }

    function mousemove(event) {
        const margin = { top: 30, right: 48, bottom: 50, left: 60 };
        const x = d3.scaleLinear()
            .domain([0, success_rates_data.length > 0 ? success_rates_data.length - 1 : 0])
            .range([margin.left, width - margin.right]);
        const y = d3.scaleLinear()
            .domain([0, 100])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const x0 = x.invert(d3.pointer(event)[0]);
        const i = Math.round(x0);

        if (!focusLine || !focusCircle || !tooltip || !overlayRect) return;
        
        if (i < 0 || i >= success_rates_data.length || i > currentEpisode) {
            focusLine.transition().duration(50).attr("opacity", 0);
            focusCircle.transition().duration(50).attr("opacity", 0);
            tooltip.transition().duration(50).attr("opacity", 0);
            return;
        }

        const d = success_rates_data[i];

        focusLine.attr("x1", x(i)).attr("x2", x(i));
        focusCircle.attr("cx", x(i)).attr("cy", y(d));

        const tooltipX = x(i) + 15;
        const tooltipY = d < 15 ? y(15) - 20 : y(d) - 20;

        const tooltipWidth = 120;
        const adjustedTooltipX = (tooltipX + tooltipWidth > width - margin.right) ? (x(i) - tooltipWidth + 15) : tooltipX;

        tooltip.attr("transform", `translate(${adjustedTooltipX},${tooltipY})`);
        tooltipTextEpisode.text(`Episode: ${i}`);
        tooltipTextRate.text(`Rate: ${Math.trunc(d)}%`);

        focusLine.raise().attr("opacity", 0.15);
        focusCircle.raise().attr("opacity", 0.5);
        tooltip.raise().attr("opacity", 1);
        overlayRect.raise();
    }

    // Função para atualizar o episódio atual ao clicar no gráfico
    function clickHandler(event) {
        // Se estiver muito rápido, desativa o clique
        if (playing && speedIndex >= 2) return;

        const margin = { top: 30, right: 48, bottom: 50, left: 60 };
        const x = d3.scaleLinear()
            .domain([0, success_rates_data.length > 0 ? success_rates_data.length - 1 : 0])
            .range([margin.left, width - margin.right]);

        const x0 = x.invert(d3.pointer(event)[0]);
        const clickedEpisode = Math.round(x0);

        if (clickedEpisode < 0 || clickedEpisode >= success_rates_data.length) {
            return;
        }

        currentEpisode = clickedEpisode;
        if (focusLine && focusCircle && tooltip) {
            focusLine.attr("opacity", 0);
            focusCircle.attr("opacity", 0);
            tooltip.attr("opacity", 0);
        }
        // Garante que o overlay ainda esteja pronto para capturar eventos após o clique
        if (overlayRect) {
            overlayRect.raise();
        }
    }
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Tiny5&family=VT323&display=swap" rel="stylesheet">

<div class="chart-wrapper">
    <h3>Success Rate Over Episodes
        <InfoTooltip>
            <div slot = "tooltipContent">
                This chart tracks the agent's success rate,<br>
                showing the percentage of the last episodes<br>
                where it successfully reached the goal.
            </div>
        </InfoTooltip>
    </h3>
    <svg bind:this={svgContainer}></svg>
</div>

<style>
    .chart-wrapper {
        margin-top: 20px;
        text-align: center;
    }

    .chart-wrapper h3 {
        margin-bottom: -5px;
        color: #ffffff;
        font-weight: normal;
        font-size: 14px;
        font-family: "Press Start 2P";
        margin-left: 120px;
        min-width: 400px;
    }

    svg {
        margin-top: 5px;
        background-color: #1e1e1e;
        border-radius: 8px;
    }

    :global(.axis-label) {
        font-size: 0.9em;
        font-weight: bold;
        font-family: Arial, sans-serif;
    }

    :global(.tooltip) {
        pointer-events: none;
    }

    :global(.tick text)
    {
        font-family: Arial, sans-serif;
        font-weight: normal;
        font-size: 0.1em;
    }

    :global(.tooltip text)
    {
        font-family: "VT323";
        font-weight: normal;
        font-size: 0.9em;
    }

    :global(.success-rate-label) {
        font-family: "VT323";
        font-weight: normal;
        font-size: 1.3em;
    }
</style>