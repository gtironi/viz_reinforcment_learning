<script>
  export let name;
  export let width_icon = 24;
  export let height_icon = 24;
  export let color = "black";
</script>

<!-- Hidden sprite with all icons -->
<svg style="display: none;">
<symbol id="reset-button" viewBox="0 0 1920 1920">
  <path
    d="M960 0v112.941c467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059-467.125 0-847.059-379.934-847.059-847.059 0-267.106 126.607-515.915 338.824-675.727v393.374h112.94V112.941H0v112.941h342.89C127.058 407.38 0 674.711 0 960c0 529.355 430.645 960 960 960s960-430.645 960-960S1489.355 0 960 0"
    fill={color}
    fill-rule="evenodd"
  />
</symbol>




  <symbol id="previous-button" viewBox="0 0 24 24">
    <polygon fill={color} points="19 20 9 12 19 4 19 20" />
    <line stroke={color} x1="5" y1="19" x2="5" y2="5" />
  </symbol>

  <symbol id="play-button" viewBox="0 0 24 24">
    <polygon fill={color} points="5 3 19 12 5 21 5 3" />
  </symbol>

  <symbol id="pause-button" viewBox="0 0 24 24">
    <rect fill={color} x="6" y="4" width="4" height="16" />
    <rect fill={color} x="14" y="4" width="4" height="16" />
  </symbol>

  <symbol id="next-button" viewBox="0 0 24 24">
    <polygon fill={color} points="5 4 15 12 5 20 5 4" />
    <line stroke={color} x1="19" y1="5" x2="19" y2="19" />
  </symbol>
</svg>

<!-- Render the selected icon -->
<svg width={width_icon} height={height_icon} aria-hidden="true">
  <use href={`#${name}-button`} />
</svg>
