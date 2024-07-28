d3.csv("data/gas_prices.csv").then(gasData => {
    d3.csv("data/electricity_costs_kwh.csv").then(electricityData => {

        const parseDate = d3.timeParse("%b-%Y");
        gasData.forEach(d => {
            d.Date = parseDate(d.Date);
            d.GasPrice = +d["Washington All Grades All Formulations Retail Gasoline Prices (Dollars per Gallon)"];
        });

        electricityData.forEach(d => {
            d.Year = +d.Year;
            d.AvgElectricityCost = (d3.mean(Object.values(d).slice(1)) * 100); // Convert to cents per kWh
        });

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 60 };

        const svg = d3.select("#line-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(gasData, d => d.Date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(gasData, d => d.GasPrice)])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        // Gas price line
        const line = d3.line()
            .x(d => x(d.Date))
            .y(d => y(d.GasPrice))
            .curve(d3.curveMonotoneX);
        svg.append("path")
            .datum(gasData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Adding hover points for gas price line
        svg.selectAll(".dot")
            .data(gasData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.GasPrice))
            .attr("r", 5)
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                const [x, y] = d3.pointer(event);
                const html = `<strong>Date:</strong> ${d3.timeFormat("%b-%Y")(d.Date)}<br><strong>Gas Price:</strong> $${d.GasPrice.toFixed(2)}`;
                graphics.showTooltip(html, x, y);
            })
            .on("mouseout", () => graphics.hideTooltip());

        // Electricity cost line
        const electricityLine = d3.line()
            .x(d => x(new Date(d.Year, 0, 1)))
            .y(d => y(d.AvgElectricityCost / 100)) // Convert back to dollars per kWh
            .curve(d3.curveMonotoneX);
        svg.append("path")
            .datum(electricityData)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 2)
            .attr("d", electricityLine);

        // Adding hover points for electricity costs
        svg.selectAll(".dot-electricity")
            .data(electricityData)
            .enter().append("circle")
            .attr("class", "dot-electricity")
            .attr("cx", d => x(new Date(d.Year, 0, 1)))
            .attr("cy", d => y(d.AvgElectricityCost / 100))
            .attr("r", 5)
            .attr("fill", "orange")
            .on("mouseover", function(event, d) {
                const [x, y] = d3.pointer(event);
                const html = `<strong>Year:</strong> ${d.Year}<br><strong>Electricity Cost:</strong> $${(d.AvgElectricityCost / 100).toFixed(2)} per kWh`;
                graphics.showTooltip(html, x, y);
            })
            .on("mouseout", () => graphics.hideTooltip());

        // Adding axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .attr("text-anchor", "middle")
            .text("Date");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .text("Price ($)");
    });
});
