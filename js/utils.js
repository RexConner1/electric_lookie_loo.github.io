class Graphics {
    constructor(svg, width, height, margin) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.margin = margin;

        this.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px");
    }

    addAxisLabel(axis, label) {
        const pos = (axis === 'x') ? { x: this.width / 2, y: this.height + this.margin.top + 20 } : { x: -this.height / 2, y: -this.margin.left + 20 };
        const transform = (axis === 'x') ? '' : 'rotate(-90)';
        this.svg.append('text')
            .attr('transform', transform)
            .attr('x', pos.x)
            .attr('y', pos.y)
            .attr('text-anchor', 'middle')
            .text(label);
    }

    showTooltip(content, x, y) {
        this.tooltip.html(content)
            .style("top", (y + 10) + "px")
            .style("left", (x + 10) + "px")
            .style("visibility", "visible");
    }

    hideTooltip() {
        this.tooltip.style("visibility", "hidden");
    }
}

function createGraphics(containerId, width, height, margin) {
    const svg = d3.select(containerId).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    return new Graphics(svg, width, height, margin);
}
