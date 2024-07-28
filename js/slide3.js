const graphics3 = new Graphics(600, 400);
graphics3.createSVG('#slide3');
graphics3.createTooltip();

Promise.all([
    d3.csv("data/ev_car_data.csv"),
    d3.csv("data/non_ev_car_data.csv")
]).then(([evData, nonEvData]) => {
    const x = d3.scaleLinear().domain([0, d3.max(nonEvData, d => +d.price)]).range([0, graphics3.width]);
    const y = d3.scaleLinear().domain([0, d3.max(nonEvData, d => +d.horsepower)]).range([graphics3.height, 0]);

    graphics3.svg.append("g")
        .attr("transform", `translate(0, ${graphics3.height})`)
        .call(d3.axisBottom(x));

    graphics3.svg.append("g")
        .call(d3.axisLeft(y));

    graphics3.svg.selectAll("circle.non-ev")
        .data(nonEvData)
        .enter().append("circle")
        .attr("class", "non-ev")
        .attr("cx", d => x(+d.price))
        .attr("cy", d => y(+d.horsepower))
        .attr("r", 3)
        .attr("fill", "red")
        .on("mouseover", (event, d) => {
            graphics3.showTooltip(`Price: $${d.price}<br>Horsepower: ${d.horsepower}`, event.pageX, event.pageY);
        })
        .on("mouseout", () => {
            graphics3.hideTooltip();
        });

    graphics3.svg.selectAll("circle.ev")
        .data(evData)
        .enter().append("circle")
        .attr("class", "ev")
        .attr("cx", d => x(+d["Base MSRP"]))
        .attr("cy", d => y(+d["Electric Range"]))
        .attr("r", 3)
        .attr("fill", "blue")
        .on("mouseover", (event, d) => {
            graphics3.showTooltip(`Price: $${d["Base MSRP"]}<br>Range: ${d["Electric Range"]} miles`, event.pageX, event.pageY);
        })
        .on("mouseout", () => {
            graphics3.hideTooltip();
        });

    graphics3.addAxisLabel('x', 'Price ($)');
    graphics3.addAxisLabel('y', 'Horsepower (Non-EV) / Range (EV)');
});
