d3.csv('data/fuel_prices.csv').then(priceData => {
    class FuelElectricityPrices extends Graphics {
        constructor(width, height) {
            super(width, height);
        }

        renderLineChart(priceData) {
            const x = d3.scaleTime().domain(d3.extent(priceData, d => new Date(d.date))).range([0, this.width]);
            const y = d3.scaleLinear().domain([0, d3.max(priceData, d => d.price)]).range([this.height, 0]);

            const lineGasoline = d3.line()
                .x(d => x(new Date(d.date)))
                .y(d => y(d.gasoline));

            const lineElectricity = d3.line()
                .x(d => x(new Date(d.date)))
                .y(d => y(d.electricity));

            this.svg.append('path')
                .datum(priceData)
                .attr('class', 'line')
                .attr('d', lineGasoline)
                .attr('stroke', 'blue')
                .attr('fill', 'none');

            this.svg.append('path')
                .datum(priceData)
                .attr('class', 'line')
                .attr('d', lineElectricity)
                .attr('stroke', 'red')
                .attr('fill', 'none');

            this.svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${this.height})`)
                .call(d3.axisBottom(x));

            this.svg.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y));
        }
    }

    const fuelElectricityPrices = new FuelElectricityPrices(800, 600);
    fuelElectricityPrices.createSVG('#fuel-electricity-prices-chart');
    fuelElectricityPrices.createTooltip();

    const formattedPriceData = priceData.map(d => ({
        date: d.Date,
        gasoline: +d.Gasoline,
        electricity: +d.Electricity
    }));

    fuelElectricityPrices.renderLineChart(formattedPriceData);
});
