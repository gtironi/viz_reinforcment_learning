<script>
    let showTooltip = false;
    export let colorbackground = "#00bcd4";
    export let size = 20;
    export let align = "center";
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Tiny5&family=VT323&display=swap" rel="stylesheet">

<div
    class="tooltip-container"
    on:mouseenter={() => (showTooltip = true)}
    on:mouseleave={() => (showTooltip = false)}
>
    <slot>
        <div class="info-circle" style="background-color: {colorbackground}; height: {size}px; width: {size}px">
            <span class="info-question-mark">?</span>
        </div>
    </slot>

    {#if showTooltip}
        <div class="tooltip-box {align === 'left' ? 'align-left' : ''}">
            <slot name="tooltipContent">
                Nenhuma informação disponível.
            </slot>
        </div>
    {/if}
</div>

<style>
    .tooltip-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        /* cursor: help; */
    }

    .info-circle {
        border-radius: 50%;
        color: #000000;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        line-height: 1;
        user-select: none;
        transition: background-color 0.2s ease;
        transform: translateY(1px);
        font-family: "Press Start 2P";
        position: relative;
    }

    .info-question-mark {
        position: absolute;
        top: 50%;
        left: 55%;
        transform: translate(-50%, -50%);
    }

    .info-circle:hover {
        background-color: #008c9e;
    }

    .tooltip-box {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: #fff;
        padding: 10px 15px;
        border-radius: 5px;
        white-space: nowrap;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        z-index: 100;
        opacity: 0;
        animation: fadeIn 0.2s forwards;
        font-size: 14px;
        font-family: Arial, sans-serif;
        font-weight: normal;
        text-align: center;
    }

    .tooltip-box.align-left {
    left: auto;
    right: 0;
    transform: translateX(0);
    }

    .tooltip-box::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }
    .tooltip-box.align-left::after {
    left: 100%;
    transform: translateX(-150%);
}

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
</style>