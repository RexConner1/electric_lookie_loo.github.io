class Graphics {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.svg = null;
        this.margin = { top: 20, right: 20, bottom: 50, left: 50 };
    }

    createSVG(selector) {
        this.svg = d3.select(selector).append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    }

    createTooltip() {
        d3.select('body').append('div')
            .attr('id', 'tooltip')
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', '1px solid black')
            .style('padding', '5px')
            .style('font-size', '12px')
            .style('font-family', 'Arial')
            .style('display', 'none');
    }

    showTooltip(html, x, y) {
        d3.select('#tooltip')
            .html(html)
            .style('left', `${x + 5}px`)
            .style('top', `${y + 5}px`)
            .style('display', 'block');
    }

    hideTooltip() {
        d3.select('#tooltip').style('display', 'none');
    }

    addAxisLabel(axis, label) {
        if (axis === 'x') {
            this.svg.append('text')
                .attr('class', 'x-axis-label')
                .attr('x', this.width / 2)
                .attr('y', this.height + this.margin.bottom - 10)
                .style('text-anchor', 'middle')
                .text(label);
        } else if (axis === 'y') {
            this.svg.append('text')
                .attr('class', 'y-axis-label')
                .attr('transform', 'rotate(-90)')
                .attr('x', -this.height / 2)
                .attr('y', -this.margin.left + 20)
                .style('text-anchor', 'middle')
                .text(label);
        }
    }

    addLegend(colorScale, labels) {
        const legend = this.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.width - 100},${20})`);

        labels.forEach((label, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0,${i * 20})`);

            legendRow.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', colorScale(label));

            legendRow.append('text')
                .attr('x', 20)
                .attr('y', 10)
                .attr('text-anchor', 'start')
                .style('font-size', '12px')
                .text(label);
        });
    }
}
