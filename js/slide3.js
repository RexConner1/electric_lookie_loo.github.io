Promise.all([
    d3.csv("data/ev_car_data.csv"),
    d3.csv("data/non_ev_car_data.csv")
]).then(([evData, nonEvData]) => {
    const width = 600, height = 400;
    const svg = d3.select("#slide3").append("svg").attr("width", width).attr("height", height);

    const x = d3.scaleLinear().domain([0, d3.max(nonEvData, d => +d.price)]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(nonEvData, d => +d.horsepower)]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll("circle.non-ev")
        .data(nonEvData)
        .enter().append("circle")
        .attr("class", "non-ev")
        .attr("cx", d => x(+d.price))
        .attr("cy", d => y(+d.horsepower))
        .attr("r", 3)
        .attr("fill", "red");

    svg.selectAll("circle.ev")
        .data(evData)
        .enter().append("circle")
        .attr("class", "ev")
        .attr("cx", d => x(+d["Base MSRP"]))
        .attr("cy", d => y(+d["Electric Range"]))
        .attr("r", 3)
        .attr("fill", "blue");
});
