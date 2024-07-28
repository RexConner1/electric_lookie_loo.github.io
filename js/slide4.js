document.addEventListener('DOMContentLoaded', function () {
    const width = 650;
    const height = 450;
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

        // Add annotations for gas prices
        const gasAnnotations = gasData.map(d => ({
            note: { label: `Price: $${d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]}`, title: d3.timeFormat("%b-%Y")(d.Date) },
            x: x(d.Date), y: y(+d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]),
            dy: -10, dx: 10
        }));

        // Add annotations for electricity prices
        const electricityAnnotations = electricityData.map(d => {
            const months = Object.keys(d).slice(1);
            return months.map((m, i) => ({
                note: { label: `Price: $${d[m]}`, title: `${m}-${d.Year}` },
                x: x(new Date(`${m}-01`)), y: yElectricity(+d[m]),
                dy: -10, dx: 10
            }));
        }).flat();

        const annotations = [...gasAnnotations, ...electricityAnnotations];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations);

        graphics4.svg.append("g")
            .call(makeAnnotations);
    }).catch(error => {
        console.error('Error loading or processing CSV data:', error);
    });
});
