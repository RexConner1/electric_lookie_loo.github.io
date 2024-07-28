function createGraphics(containerId, width, height, margin) {
    const svg = d3.select(containerId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    function addAxisLabel(axis, text) {
        if (axis === 'x') {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 5)
                .attr("text-anchor", "middle")
                .text(text);
        } else if (axis === 'y') {
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 15)
                .attr("text-anchor", "middle")
                .text(text);
        }
    }

    function showTooltip(content, x, y) {
        d3.select(".tooltip")
            .style("left", `${x}px`)
            .style("top", `${y}px`)
            .style("display", "block")
            .html(content);
    }

    function hideTooltip() {
        d3.select(".tooltip").style("display", "none");
    }

    return {
        svg,
        addAxisLabel,
        showTooltip,
        hideTooltip
    };
}

document.addEventListener('DOMContentLoaded', function () {
    if (!d3.select(".tooltip").empty()) {
        d3.select(".tooltip").remove();
    }
    d3.select("body").append("div").attr("class", "tooltip");
});
