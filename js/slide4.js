document.addEventListener('DOMContentLoaded', function () {
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const graphics4 = createGraphics('#slide4', width, height, margin);

    Promise.all([
        d3.csv("data/gas_prices.csv"),
        d3.csv("data/electricity_costs_kwh.csv")
    ]).then(([gasData, electricityData]) => {
        const parseDate = d3.timeParse("%b-%Y");
        gasData.forEach(d => d.Date = parseDate(d.Date));

        const x = d3.scaleTime().domain(d3.extent(gasData, d => d.Date)).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(gasData, d => +d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"])]).range([height, 0]);

        graphics4.svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
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

        const x2 = d3.scaleLinear().domain(d3.extent(electricityYears)).range([0, width]);
        const y2 = d3.scaleLinear().domain([0, d3.max(electricityPrices, d => d.price)]).range([height, 0]);

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
        graphics4.addAxisLabel('y', 'Price (Dollars per Gallon / Dollars per kWh)');

        graphics4.svg.selectAll("circle")
            .data(gasData)
            .enter().append("circle")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(+d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]))
            .attr("r", 3)
            .attr("fill", "red")
            .on("mouseover", (event, d) => {
                graphics4.showTooltip(`Date: ${d3.timeFormat("%b-%Y")(d.Date)}<br>Gas Price: $${d["Washington Regular All Formulations Retail Gasoline Prices (Dollars per Gallon)"]}`, event.pageX, event.pageY);
            })
            .on("mouseout", () => {
                graphics4.hideTooltip();
            });

        graphics4.svg.selectAll("circle")
            .data(electricityPrices)
            .enter().append("circle")
            .attr("cx", d => x2(d.year))
            .attr("cy", d => y2(d.price))
            .attr("r", 3)
            .attr("fill", "blue")
            .on("mouseover", (event, d) => {
                graphics4.showTooltip(`Year: ${d.year}<br>Electricity Price: $${d.price} per kWh`, event.pageX, event.pageY);
            })
            .on("mouseout", () => {
                graphics4.hideTooltip();
            });
    });
});
