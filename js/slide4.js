const graphics4 = new Graphics(600, 400);
graphics4.createSVG('#slide4');
graphics4.createTooltip();

Promise.all([
    d3.csv("data/gas_prices.csv"),
    d3.csv("data/electricity_costs_kwh.csv")
]).then(([gasData, electricityData]) => {
    const parseDate = d3.timeParse("%b-%Y");
    gasData.forEach(d => d.Date = parseDate(d.Date));

    const x = d3.scaleTime().domain(d3.extent(gasData, d => d.Date)).range([0, graphics4.width]);
    const y = d3.scaleLinear().domain([0, d3.max(gasData, d => +d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"])]).range([graphics4.height, 0]);

    graphics4.svg.append("g").attr("transform", `translate(0, ${graphics4.height})`).call(d3.axisBottom(x));
    graphics4.svg.append("g").call(d3.axisLeft(y));

    graphics4.svg.append("path")
        .datum(gasData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.Date))
            .y(d => y(+d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]))
        );

    const electricityYears = electricityData.map(d => +d.Year);
    const electricityPrices = electricityData.map(d => {
        return { year: +d.Year, price: +d.AvgPrice };
    });

    const x2 = d3.scaleLinear().domain(d3.extent(electricityYears)).range([0, graphics4.width]);
    const y2 = d3.scaleLinear().domain([0, d3.max(electricityPrices, d => d.price)]).range([graphics4.height, 0]);

    graphics4.svg.append("path")
        .datum(electricityPrices)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x2(d.year))
            .y(d => y2(d.price))
        );

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
            x: x2(2015), y: y2(0.1),
            dy: -30, dx: -50
        }
    ];

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    graphics4.svg.append("g")
        .call(makeAnnotations);
});
