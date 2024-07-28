d3.csv("data/ev_car_data.csv").then(data => {
    const width = 600, height = 400;
    const svg = d3.select("#slide2").append("svg").attr("width", width).attr("height", height);

    const modelCount = d3.rollups(data, v => v.length, d => d.Model);
    const sortedData = modelCount.sort((a, b) => b[1] - a[1]).slice(0, 10); // Top 10 models

    const x = d3.scaleBand().domain(sortedData.map(d => d[0])).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(sortedData, d => d[1])]).range([height, 0]);

    svg.append("g").selectAll("rect")
        .data(sortedData)
        .enter().append("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[1]))
        .attr("fill", "steelblue");

    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));
});

