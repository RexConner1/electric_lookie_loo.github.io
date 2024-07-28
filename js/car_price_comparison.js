d3.csv('data/ev_data.csv').then(evData => {
    class CarPriceComparison extends Graphics {
        constructor(width, height) {
            super(width, height);
        }

        renderScatterPlot(priceData) {
            const x = d3.scaleLinear().domain([0, d3.max(priceData, d => d.price)]).range([0, this.width]);
            const y = d3.scaleLinear().domain([0, d3.max(priceData, d => d.efficiency)]).range([this.height, 0]);

            this.svg.selectAll('.dot')
                .data(priceData)
                .enter().append('circle')
                .attr('class', 'dot')
                .attr('cx', d => x(d.price))
                .attr('cy', d => y(d.efficiency))
                .attr('r', 5)
                .attr('fill', d => d.type === 'Electric' ? 'green' : 'gray')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget).attr('r', 8);
                    this.showTooltip(`${d.model}: $${d.price}`, event.pageX, event.pageY);
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget).attr('r', 5);
                    this.hideTooltip();
                });

            this.svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${this.height})`)
                .call(d3.axisBottom(x));

            this.svg.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y));
        }
    }

    const carPriceComparison = new CarPriceComparison(800, 600);
    carPriceComparison.createSVG('#car-price-comparison-chart');
    carPriceComparison.createTooltip();

    const priceData = evData.map(d => ({
        model: d.Model,
        price: +d.Price,
        efficiency: +d.Efficiency,
        type: d.Type
    }));

    carPriceComparison.renderScatterPlot(priceData);
});
