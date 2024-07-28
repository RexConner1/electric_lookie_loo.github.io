document.addEventListener('DOMContentLoaded', function () {
    const width = document.documentElement.clientWidth * 0.6;
    const height = document.documentElement.clientHeight * 0.5;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };

    const graphics4 = createGraphics('#line-chart', width, height, margin);

    Promise.all([
        d3.csv('data/gas_prices.csv'),
        d3.csv('data/electricity_costs_kwh.csv')
    ]).then(([gasData, electricityData]) => {
        const parseDate = d3.timeParse("%b-%Y");
        gasData.forEach(d => d.Date = parseDate(d.Date));

        const x = d3.scaleTime().domain(d3.extent(gasData, d => d.Date)).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(gasData, d => +d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"])]).range([height, 0]);

        const yElectricity = d3.scaleLinear().domain([0, d3.max(electricityData, d => d3.max(Object.values(d).slice(1).map(Number)))]).range([height, 0]);

        graphics4.svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(5));

        graphics4.svg.append('g')
            .call(d3.axisLeft(y).ticks(5));

        // Gas prices line
        graphics4.svg.append('path')
            .datum(gasData)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
            .x(d => x(d.Date))
            .y(d => y(+d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]))
        );

        // Electricity prices line
        electricityData.forEach(d => {
            const months = Object.keys(d).slice(1);
            const prices = months.map(m => +d[m]);
            const years = months.map(m => new Date(`${m}-01`));

            graphics4.svg.append('path')
                .datum(prices.map((price, i) => ({ date: years[i], price })))
                .attr('fill', 'none')
                .attr('stroke', 'blue')
                .attr('stroke-width', 1.5)
                .attr('d', d3.line()
                    .x(d => x(d.date))
                    .y(d => yElectricity(d.price))
                );
        });

        graphics4.addAxisLabel('x', 'Year');
        graphics4.addAxisLabel('y', 'Price (USD)');

        // Add tooltips for gas prices
        graphics4.svg.selectAll('.gas-dot')
            .data(gasData)
            .enter().append('circle')
            .attr('class', 'gas-dot')
            .attr('cx', d => x(d.Date))
            .attr('cy', d => y(+d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]))
            .attr('r', 5)
            .attr('fill', 'red')
            .on('mouseover', function (event, d) {
                graphics4.showTooltip(`Date: ${d3.timeFormat("%b-%Y")(d.Date)}<br>Price: $${d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]}`, event.pageX, event.pageY);
            })
            .on('mouseout', function () {
                graphics4.hideTooltip();
            });

        // Add tooltips for electricity prices
        electricityData.forEach(d => {
            const months = Object.keys(d).slice(1);
            months.forEach(month => {
                graphics4.svg.append('circle')
                    .attr('class', 'electricity-dot')
                    .attr('cx', x(new Date(`${month}-${d.Year}`)))
                    .attr('cy', yElectricity(+d[month]))
                    .attr('r', 5)
                    .attr('fill', 'blue')
                    .on('mouseover', function (event) {
                        graphics4.showTooltip(`Year: ${d.Year}<br>Month: ${month}<br>Price: $${d[month]}`, event.pageX, event.pageY);
                    })
                    .on('mouseout', function () {
                        graphics4.hideTooltip();
                    });
            });
        });

    }).catch(error => {
        console.error('Error loading or processing CSV data:', error);
    });
});
