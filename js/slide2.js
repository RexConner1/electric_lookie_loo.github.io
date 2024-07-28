const graphics2 = new Graphics(600, 400);
graphics2.createSVG('#slide2');
graphics2.createTooltip();

d3.csv("data/ev_car_data.csv").then(data => {
    const modelCount = d3.rollups(data, v => v.length, d => d.Model);
    const sortedData = modelCount.sort((a, b) => b[1] - a[1]).slice(0, 10); // Top 10 models

    const x = d3.scaleBand().domain(sortedData.map(d => d[0])).range([0, graphics2.width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(sortedData, d => d[1])]).range([graphics2.height, 0]);

    graphics2.svg.append("g").selectAll("rect")
        .data(sortedData)
        .enter().append("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => graphics2.height - y(d[1]))
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
            graphics2.showTooltip(`Model: ${d[0]}<br>Count: ${d[1]}`, event.pageX, event.pageY);
        })
        .on("mouseout", () => {
            graphics2.hideTooltip();
        });

    graphics2.svg.append("g").attr("transform", `translate(0, ${graphics2.height})`).call(d3.axisBottom(x));
    graphics2.svg.append("g").call(d3.axisLeft(y));

    graphics2.addAxisLabel('x', 'Electric Vehicle Models');
    graphics2.addAxisLabel('y', 'Number of Vehicles');
});
