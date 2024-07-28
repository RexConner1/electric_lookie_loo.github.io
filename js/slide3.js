d3.csv("data/ev_car_data.csv").then(data => {
    const filteredData = data.filter(d => d["Base MSRP"] > 0);
    const carModels = filteredData.map(d => d.Model);
    const evTypes = filteredData.map(d => d["Electric Vehicle Type"]);
    const counts = {};
    
    carModels.forEach((model, i) => {
        const type = evTypes[i];
        if (!counts[model]) {
            counts[model] = { count: 0, type: type };
        }
        counts[model].count += 1;
    });

    const processedData = Object.keys(counts).map(model => ({
        model: model,
        count: counts[model].count,
        type: counts[model].type
    }));

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(processedData.map(d => d.model));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.count)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(processedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.model))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", "#69b3a2")
        .on("mouseover", function (event, d) {
            const [x, y] = d3.pointer(event);
            const html = `<strong>Model:</strong> ${d.model}<br><strong>Count:</strong> ${d.count}<br><strong>Type:</strong> ${d.type}`;
            graphics.showTooltip(html, x, y);
        })
        .on("mouseout", () => graphics.hideTooltip());
});
