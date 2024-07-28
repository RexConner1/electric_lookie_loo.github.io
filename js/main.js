class Graphics {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.svg = null;
    }

    createSVG(selector) {
        this.svg = d3.select(selector).append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
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
}
