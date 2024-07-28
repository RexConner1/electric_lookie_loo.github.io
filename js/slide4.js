document.addEventListener('DOMContentLoaded', function () {
    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };

    const graphics4 = createGraphics('#line-chart', width, height, margin);

    Promise.all([
        d3.csv("data/gas_prices.csv"),
        d3.csv("data/electricity_costs_kwh.csv")
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

        // Annotations
        const annotations = [
            {
                note: { label: "Gas price spike", title: "Gas Price" },
                x: x(new Date("Jul-2008")), y: y(4.5),
                dy: -50, dx: 50
            },
            {
                note: { label: "Electricity cost remains stable", title: "Electricity Cost" },
                x: x(new Date("2015")), y: yElectricity(0.1),
                dy: -30, dx: -50
            }
        ];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations);

        graphics4.svg.append("g")
            .call(makeAnnotations);
    }).catch(error => {
        console.error('Error loading or processing CSV data:', error);
    });
});
