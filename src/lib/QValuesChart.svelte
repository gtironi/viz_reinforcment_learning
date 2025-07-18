<script>
    import * as d3 from "d3";
    import InfoTooltip from './InfoTooltip.svelte';

    export let allQTables = [];
    export let inspectedRow = null;
    export let inspectedCol = null;
    export let width = 650;
    export let height = 250;
    export let currentEpisode = 0;
    export let playing = false;
    export let speedIndex = 0;
    export let hoveredAction = null;

    let svgContainer;

    let qValuesOverEpisodes = {
        up: [],
        down: [],
        left: [],
        right: []
    };
    
    let minValue;
    let maxValue;

    // Elementos de interatividade
    let focusLine;
    let focusCircles = {};
    let tooltip;
    let tooltipBg;
    let tooltipTextEpisode;
    let tooltipTextQValues = {};
    let overlayRect;

    let interactiveElementsCreated = false;

    $: if (inspectedRow !== null && inspectedCol !== null && allQTables.length > 0) {
        calculateGlobalQValueExtremes(allQTables, inspectedRow, inspectedCol);
    }

    // Função reativa para recalcular os Q-valores e redesenhar o gráfico
    $: {
        if (allQTables.length > 0 && inspectedRow !== null && inspectedCol !== null) {
            // Limita os dados ao currentEpisode
            const dataToDraw = allQTables.slice(0, currentEpisode + 1);
            qValuesOverEpisodes = extractQValuesForCell(dataToDraw, inspectedRow, inspectedCol);
            if (svgContainer) {
                const svg = d3.select(svgContainer);
                drawChart(svg, width, height, qValuesOverEpisodes);

                if (!interactiveElementsCreated) {
                    createInteractiveElements(svg, width, height);
                    interactiveElementsCreated = true;
                }
                
                // Eleva os elementos interativos para garantir que estejam acima das linhas
                if (focusLine && overlayRect) {
                    focusLine.raise();
                    for (const action in focusCircles) {
                        focusCircles[action].raise();
                    }
                    tooltip.raise();
                    overlayRect.raise();
                }
            }
        }
    }

    $: {
        if (svgContainer && hoveredAction !== null) {
            const svg = d3.select(svgContainer);
            const actions = ['up', 'down', 'left', 'right'];
            actions.forEach(action => {
                svg.selectAll(`.${action}-line`)
                    .transition().duration(100)
                    .attr("opacity", hoveredAction ? (hoveredAction.toLowerCase() === action ? 1 : 0.2) : 1);
                svg.selectAll(`.${action}-q-value-label`)
                    .transition().duration(100)
                    .attr("opacity", hoveredAction ? (hoveredAction.toLowerCase() === action ? 1 : 0.2) : 1);
                svg.selectAll(`.${action}-last-point-circle`)
                    .transition().duration(100)
                    .attr("opacity", hoveredAction ? (hoveredAction.toLowerCase() === action ? 1 : 0.2) : 1);
            });
        }
    }

    function calculateGlobalQValueExtremes(allQTables, row, col) {
        minValue = Infinity;
        maxValue = -Infinity;

        if (!allQTables || allQTables.length === 0 || row === null || col === null) {
            return { minValue: 0, maxValue: 0 };
        }

        allQTables.forEach(episodeQTables => {
            const finalQTable = episodeQTables[episodeQTables.length - 1];
            const stateKey = `${row},${col}`;

            if (finalQTable && finalQTable[stateKey]) {
                const cellQValues = finalQTable[stateKey];

                Object.values(cellQValues).forEach(qValue => {
                    if (typeof qValue === 'number' && !isNaN(qValue)) {
                        if (qValue > maxValue) {
                            maxValue = qValue;
                        }
                        if (qValue < minValue) {
                            minValue = qValue;
                        }
                    }
                });
            }
        });

        if (minValue === Infinity || minValue === -Infinity) minValue = 0;
        if (maxValue === -Infinity || maxValue === Infinity) maxValue = 0;

        if (minValue === maxValue) {
            minValue -= 0.1;
            maxValue += 0.1;
        }
    }

    function extractQValuesForCell(qTablesData, row, col) {
        const qValues = {
            up: [],
            down: [],
            left: [],
            right: []
        };
    
        qTablesData.forEach(episodeQTables => {
            // Pega o último Q-table de cada episódio
            const finalQTable = episodeQTables[episodeQTables.length - 1];
            const stateKey = `${row},${col}`;

            if (finalQTable && finalQTable[stateKey]) {
                const cellQValues = finalQTable[stateKey];

                qValues.up.push(cellQValues.up);
                qValues.down.push(cellQValues.down);
                qValues.left.push(cellQValues.left);
                qValues.right.push(cellQValues.right);

            } else {
                // Se não houver dados para a célula, adiciona 0 para manter o comprimento do array
                qValues.up.push(0);
                qValues.down.push(0);
                qValues.left.push(0);
                qValues.right.push(0);
            }
        });
        return qValues;
    }

    function createInteractiveElements(svg, w, h) {
        const margin = { top: 30, right: 60, bottom: 50, left: 70 };
        const actions = ['up', 'down', 'left', 'right'];
        const colors = {
            up: "#007bff",
            down: "#28a745",
            left: "#ffc107",
            right: "#dc3545"
        };

        // Linha de foco vertical
        focusLine = svg.append("line")
            .attr("class", "focus-line")
            .attr("y1", margin.top)
            .attr("y2", h - margin.bottom)
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0);

        // Círculos de foco para cada linha
        actions.forEach(action => {
            focusCircles[action] = svg.append("circle")
                .attr("class", `focus-circle ${action}-focus-circle`)
                .attr("r", 5)
                .attr("fill", colors[action])
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .attr("opacity", 0);
        });

        // Tooltip group
        tooltip = svg.append("g")
            .attr("class", "tooltip")
            .attr("opacity", 0);

        tooltipBg = tooltip.append("rect")
            .attr("width", 90)
            .attr("height", 75)
            .attr("fill", "rgba(0, 0, 0, 0.9)")
            .attr("rx", 5)
            .attr("ry", 5);

        tooltipTextEpisode = tooltip.append("text")
            .attr("x", 10)
            .attr("y", 16)
            .style("fill", "white")
            .style("font-size", "0.9em");

        // Textos para os Q-values no tooltip
        actions.forEach((action, i) => {
            tooltipTextQValues[action] = tooltip.append("text")
                .attr("x", 10)
                .attr("y", 31 + (i * 13))
                .style("fill", colors[action])
                .style("font-size", "0.8em");
        });

        // Retângulo invisível para capturar eventos do mouse
        overlayRect = svg.append("rect")
            .attr("class", "overlay")
            .attr("width", w - margin.left - margin.right)
            .attr("height", h - margin.top - margin.bottom)
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mouseout", () => {
                focusLine.transition().duration(50).attr("opacity", 0);
                for (const action in focusCircles) {
                    focusCircles[action].transition().duration(50).attr("opacity", 0);
                }
                tooltip.transition().duration(50).attr("opacity", 0);
            })
            .on("mousemove", mousemove)
            .on("click", clickHandler);
    }

    function drawChart(svg, w, h, data) {
        const margin = { top: 30, right: 60, bottom: 50, left: 70 };
        const actions = ['up', 'down', 'left', 'right'];
        const colors = {
            up: "#007bff",
            down: "#28a745",
            left: "#ffc107",
            right: "#dc3545"
        };

        svg.selectAll(".chart-line, .last-point-circle, .last-point-line, .q-value-label, .axis-label, .x-axis-group, .y-axis-group, .current-episode-line").remove();

        const x = d3
            .scaleLinear()
            .domain([0, allQTables.length > 0 ? allQTables.length - 1 : 0])
            .range([margin.left, w - margin.right]);

        const yPadding = (maxValue - minValue) * 0.1;
        const y = d3
            .scaleLinear()
            .domain([minValue - yPadding, maxValue + yPadding])
            .nice()
            .range([h - margin.bottom, margin.top]);

        const line = d3
            .line()
            .x((d, i) => x(i))
            .y(d => y(d));

        const tickInterval = Math.round(allQTables.length / 100) * 10;
        const xTicks = [];
        const totalEpisodes = allQTables.length;
        
        for (let i = 0; i <= totalEpisodes; i += tickInterval) {
            xTicks.push(i);
        }

        if (totalEpisodes > 0 && xTicks[xTicks.length - 1] < totalEpisodes - 1) {
            xTicks.push(totalEpisodes - 1);
        }

        // Eixos e Títulos de Eixos
        svg.append("g")
            .attr("class", "x-axis-group")
            .attr("transform", `translate(0,${h - margin.bottom})`)
            .call(d3.axisBottom(x).tickValues(xTicks));

        svg.append("g")
            .attr("class", "y-axis-group")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("class", "x axis-label")
            .attr("text-anchor", "middle")
            .attr("x", w / 2 + 35)
            .attr("y", h - 12)
            .style("fill", "#ffffff")
            .text("Episodes");

        svg.append("text")
            .attr("class", "y axis-label")
            .attr("text-anchor", "middle")
            .attr("x", - (h / 2) + 15)
            .attr("y", margin.left - 45)
            .attr("transform", "rotate(-90)")
            .style("fill", "#ffffff")
            .text("Q-Value");

        // Lógica para ajuste de rótulos
        const lastPoints = [];
        actions.forEach(action => {
            if (data[action].length > 0) {
                const lastDataPoint = data[action][data[action].length - 1];
                const lastEpisodeIndex = data[action].length - 1;
                lastPoints.push({
                    action: action,
                    value: lastDataPoint,
                    x: x(lastEpisodeIndex),
                    y: y(lastDataPoint),
                    adjustedY: y(lastDataPoint)
                });
            }
        });

        // Ordenar os pontos pela sua posição Y original
        lastPoints.sort((a, b) => b.y - a.y);

        const labelHeight = 7;
        const paddingBetweenLabels = 5;
        
        const floorY = h - margin.bottom - 2;

        // Ajusta as posições Y dos rótulos, iterando de baixo para cima
        for (let i = 0; i < lastPoints.length; i++) {
            const currentPoint = lastPoints[i];
            currentPoint.adjustedY = Math.min(currentPoint.adjustedY, floorY - labelHeight);

            if (i > 0) {
                const prevPoint = lastPoints[i - 1];
                const maxAllowedY = prevPoint.adjustedY - paddingBetweenLabels - labelHeight;

                if (currentPoint.adjustedY > maxAllowedY) {
                    currentPoint.adjustedY = maxAllowedY;
                }
            }
        }

        // Desenha as linhas do gráfico e os círculos do último ponto
        actions.forEach(action => {
            // Linha
            svg.append("path")
                .datum(data[action])
                .attr("class", `chart-line ${action}-line`)
                .attr("fill", "none")
                .attr("stroke", colors[action])
                .attr("stroke-width", 2)
                .attr("d", line)
                .attr("opacity", hoveredAction ? (hoveredAction.toLowerCase() === action ? 1 : 0.2) : 1);

            // Círculo no último ponto
            const lastPointData = lastPoints.find(p => p.action === action);
            if (lastPointData) {
                svg.append("circle")
                    .attr("class", `last-point-circle ${action}-last-point-circle`)
                    .attr("cx", lastPointData.x)
                    .attr("cy", y(lastPointData.value))
                    .attr("r", 5)
                    .attr("fill", colors[action])
                    .attr("stroke", "white")
                    .attr("stroke-width", 1.5)
                    .attr("opacity", hoveredAction ? (hoveredAction.toLowerCase() === action ? 1 : 0.2) : 1);
                
                // Texto do Q-Value do último ponto
                svg.append("text")
                    .attr("class", `q-value-label ${action}-q-value-label`)
                    .attr("x", lastPointData.x + 10)
                    .attr("y", lastPointData.adjustedY + 4)
                    .attr("text-anchor", "start")
                    .style("fill", colors[action])
                    .style("font-size", "0.9em")
                    .text(`${action.charAt(0).toUpperCase() + action.slice(1)}: ${lastPointData.value.toFixed(1)}`)
                    .attr("opacity", hoveredAction ? (hoveredAction.toLowerCase() === action ? 1 : 0.2) : 1);
            }
        });

        // Linha vertical transparente no episódio atual
        if (allQTables.length > 0) {
            const currentEpisodeX = x(currentEpisode);
            svg.append("line")
                .attr("class", "current-episode-line")
                .attr("x1", currentEpisodeX)
                .attr("y1", margin.top)
                .attr("x2", currentEpisodeX)
                .attr("y2", h - margin.bottom)
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .attr("opacity", 0.2);
        }

        // Legenda
        // const legend = svg.append("g")
        //     .attr("class", "legend")
        //     .attr("transform", `translate(${w - margin.right + 10}, ${margin.top})`);

        // actions.forEach((action, i) => {
        //     const legendRow = legend.append("g")
        //         .attr("transform", `translate(0, ${i * 20})`);

        //     legendRow.append("rect")
        //         .attr("width", 10)
        //         .attr("height", 10)
        //         .attr("fill", colors[action]);

        //     legendRow.append("text")
        //         .attr("x", 15)
        //         .attr("y", 7)
        //         .attr("dy", "0.35em")
        //         .style("fill", "white")
        //         .style("font-size", "10px")
        //         .style("font-family", "Press Start 2P")
        //         .text(action.charAt(0).toUpperCase() + action.slice(1));
        // });
    }

    function mousemove(event) {
        const margin = { top: 30, right: 60, bottom: 50, left: 70 };
        const actions = ['up', 'down', 'left', 'right'];

        const colors = {
            up: "#007bff",
            down: "#28a745",
            left: "#ffc107",
            right: "#dc3545"
        };

        const x = d3.scaleLinear()
            .domain([0, allQTables.length > 0 ? allQTables.length - 1 : 0])
            .range([margin.left, width - margin.right]);

        const yPadding = (maxValue - minValue) * 0.1;
        const y = d3
            .scaleLinear()
            .domain([minValue - yPadding, maxValue + yPadding])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const x0 = x.invert(d3.pointer(event)[0]);
        const i = Math.round(x0);

        if (!focusLine || !tooltip || !overlayRect) return;

        // Esconde os elementos se o mouse estiver fora da área relevante
        if (i < 0 || i >= allQTables.length || i > currentEpisode) {
            focusLine.transition().duration(50).attr("opacity", 0);
            for (const action in focusCircles) {
                focusCircles[action].transition().duration(50).attr("opacity", 0);
            }
            tooltip.transition().duration(50).attr("opacity", 0);
            return;
        }

        // Atualiza a posição da linha de foco
        focusLine.attr("x1", x(i)).attr("x2", x(i));

        const currentQValues = [];
        actions.forEach(action => {
            const qValue = qValuesOverEpisodes[action][i];
            // Adiciona apenas se for um número válido, para evitar NaNs
            if (typeof qValue === 'number' && !isNaN(qValue)) {
                currentQValues.push({ action: action, value: qValue });
            } else {
                focusCircles[action].attr("opacity", 0);
            }
        });

        currentQValues.sort((a, b) => b.value - a.value);

        actions.forEach(action => {
            const qValue = qValuesOverEpisodes[action][i];
            if (typeof qValue === 'number' && !isNaN(qValue)) {
                focusCircles[action].attr("cx", x(i)).attr("cy", y(qValue)).attr("opacity", 0.5);
            } else {
                focusCircles[action].attr("opacity", 0);
            }
        });

        tooltipTextEpisode.text(`Episode: ${i}`);

        currentQValues.forEach((item, index) => {
            tooltipTextQValues[item.action]
                .attr("x", 10)
                .attr("y", 31 + (index * 12))
                .style("fill", colors[item.action])
                .text(`${item.action.charAt(0).toUpperCase() + item.action.slice(1)}: ${item.value.toFixed(2)}`);
        });

        actions.forEach(action => {
            if (!currentQValues.some(item => item.action === action)) {
                tooltipTextQValues[action].text('');
            }
        });

        // Calcula a posição do tooltip
        const tooltipX = x(i) + 15;
        // Pega a média dos Q-values para posicionar o tooltip de forma mais centralizada
        const avgQValue = d3.mean(actions.map(action => qValuesOverEpisodes[action][i]));
        const tooltipY = (avgQValue !== undefined && !isNaN(avgQValue)) ? y(avgQValue) - 50 : y(0) - 50;

        const tooltipWidth = 130;
        const adjustedTooltipX = (tooltipX + tooltipWidth > width - margin.right) ? (x(i) - tooltipWidth + 15) : tooltipX;

        tooltip.attr("transform", `translate(${adjustedTooltipX},${tooltipY})`);
        tooltipTextEpisode.text(`Episode: ${i}`);
        
        // Exibe os elementos
        focusLine.raise().attr("opacity", 0.15);
        for (const action in focusCircles) {
            focusCircles[action].raise().attr("opacity", 0.5);
        }
        tooltip.raise().attr("opacity", 1);
        overlayRect.raise();
    }

    // Função para atualizar o episódio atual ao clicar no gráfico
    function clickHandler(event) {
        // Se estiver muito rápido, desativa o clique
        if (playing && speedIndex >= 2) return;

        const margin = { top: 30, right: 60, bottom: 50, left: 70 };
        const x = d3.scaleLinear()
            .domain([0, allQTables.length > 0 ? allQTables.length - 1 : 0])
            .range([margin.left, width - margin.right]);

        const x0 = x.invert(d3.pointer(event)[0]);
        const clickedEpisode = Math.round(x0);

        if (clickedEpisode < 0 || clickedEpisode >= allQTables.length) {
            return;
        }
        
        currentEpisode = clickedEpisode;

        // Oculta os elementos de foco após o clique
        if (focusLine && tooltip) {
            focusLine.attr("opacity", 0);
            for (const action in focusCircles) {
                focusCircles[action].attr("opacity", 0);
            }
            tooltip.attr("opacity", 0);
        }
        if (overlayRect) {
            overlayRect.raise();
        }
    }
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Tiny5&family=VT323&display=swap" rel="stylesheet">

<div class="chart-wrapper">
    <h3>Q-Values Over Episodes for Cell ({inspectedRow},{inspectedCol})
        <InfoTooltip>
            <div slot="tooltipContent">
                This chart displays the Q-values for each action<br>
                (Up, Down, Left, Right) in the selected cell<br>
                across all training episodes.
            </div>
        </InfoTooltip>
    </h3>
    <svg bind:this={svgContainer}></svg>
</div>

<style>
    .chart-wrapper {
        margin-top: -30px;
        text-align: center;
    }

    .chart-wrapper h3 {
        margin-bottom: -5px;
        color: #ffffff;
        font-weight: normal;
        font-size: 14px;
        font-family: "Press Start 2P";
    }

    svg {
        margin-top: 20px;
        /* border: 1px solid #3318e9;
        background-color: #0d0d0d; */
        /* border-radius: 8px; */
        width: 675px;
        height: 250px;
    }

    /* :global(.axis-label) {
        font-size: 0.6em;
        font-weight: normal;
        font-family: Arial, sans-serif;
    } */

    :global(.tick text) {
        font-family: "Press Start 2P";
        font-weight: normal;
        font-size: 0.7em;
    }

    :global(.tooltip) {
        pointer-events: none;
    }

    /* :global(.tooltip text) {
        font-family: "VT323";
        font-weight: normal;
        font-size: 0.9em;
    } */

    :global(.q-value-label) {
        font-family: "VT323";
        font-weight: normal;
        font-size: 1.0em;
    }

    :global(.focus-line) {
        stroke-dasharray: 4 2;
    }
</style>