Promise.all([
    d3.csv("data/gas_prices.csv"),
    d3.csv("data/electricity_costs_kwh.csv")
]).then(([gasData, electricityData]) => {
    const width = 600, height = 400;
    const svg = d3.select("#slide4").append("svg").attr("width", width).attr("height", height);

    const parseDate = d3.timeParse("%b-%Y");
    gasData.forEach(d => d.Date = parseDate(d.Date));

    const x = d3.scaleTime().domain(d3.extent(gasData, d => d.Date)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(gasData, d => +d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"])]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    svg.append("path")
        .datum(gasData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.Date))
            .y(d => y(d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]))
        );

    const electricityYears = electricityData.map(d => +d.Year);
    const electricityPrices = electricityYears.map(year => ({
        year: year,
        price: d3.mean(Object.values(electricityData.find(d => +d.Year === year)).slice(1).map(d => +d))
    }));

    const x2 = d3.scaleLinear().domain(d3.extent(electricityYears)).range([0, width]);
    const y2 = d3.scaleLinear().domain([0, d3.max(electricityPrices, d => d.price)]).range([height, 0]);

    svg.append("path")
        .datum(electricityPrices)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x2(d.year))
            .y(d => y2(d.price))
        );
});
