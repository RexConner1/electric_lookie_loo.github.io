d3.csv('data/cleaned_ev_data.csv').then(evData => {
    // Slide 2: EV Distribution Map
    const width = 800, height = 600;

    const svg = d3.select('#ev-distribution-map').append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoMercator().scale(5000).center([-122.5, 47.5]);
    const path = d3.geoPath().projection(projection);

    d3.json('wa_counties_topojson.json').then(wa => {
        const counties = topojson.feature(wa, wa.objects.counties).features;

        svg.selectAll('path')
            .data(counties)
            .enter().append('path')
            .attr('d', path)
            .attr('fill', 'lightgray')
            .attr('stroke', 'white');

        svg.selectAll('circle')
            .data(evData)
            .enter().append('circle')
            .attr('cx', d => projection([+d.Longitude, +d.Latitude])[0])
            .attr('cy', d => projection([+d.Longitude, +d.Latitude])[1])
            .attr('r', 3)
            .attr('fill', 'red')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('r', 6);
                const [x, y] = projection([+d.Longitude, +d.Latitude]);
                svg.append('text')
                    .attr('x', x + 5)
                    .attr('y', y - 5)
                    .attr('id', 'tooltip')
                    .attr('font-size', '12px')
                    .attr('font-family', 'Arial')
                    .attr('fill', 'black')
                    .text(`${d.City}: ${d.Make} ${d.Model}`);
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 3);
                d3.select('#tooltip').remove();
            });
    });

    // Slide 3: EV Models Chart
    const svg2 = d3.select('#ev-models-chart').append('svg')
        .attr('width', width)
        .attr('height', height);

    const models = Array.from(new Set(evData.map(d => d.Model)));
    const modelCounts = models.map(model => ({
        model: model,
        count: evData.filter(d => d.Model === model).length
    }));

    const x = d3.scaleBand().domain(models).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(modelCounts, d => d.count)]).range([height, 0]);

    svg2.selectAll('.bar')
        .data(modelCounts)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.model))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.count))
        .attr('fill', 'blue')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('fill', 'orange');
            const [x, y] = [event.pageX, event.pageY];
            d3.select('body').append('div')
                .attr('id', 'tooltip')
                .style('position', 'absolute')
                .style('left', `${x + 5}px`)
                .style('top', `${y + 5}px`)
                .style('background-color', 'white')
                .style('border', '1px solid black')
                .style('padding', '5px')
                .style('font-size', '12px')
                .style('font-family', 'Arial')
                .html(`Model: ${d.model}<br>Count: ${d.count}`);
        })
        .on('mouseout', function() {
            d3.select(this).attr('fill', 'blue');
            d3.select('#tooltip').remove();
        });

    svg2.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
    svg2.append('g').call(d3.axisLeft(y));

    // Slide 4: Car Price Comparison Chart
    d3.csv('data/cleaned_car_data.csv').then(carData => {
        const svg3 = d3.select('#car-price-comparison-chart').append('svg')
            .attr('width', width)
            .attr('height', height);

        const carTypes = Array.from(new Set(carData.map(d => d.CarType)));
        const carTypePrices = carTypes.map(type => ({
            type: type,
            price: d3.mean(carData.filter(d => d.CarType === type), d => +d.Price)
        }));

        const x = d3.scaleBand().domain(carTypes).range([0, width]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(carTypePrices, d => d.price)]).range([height, 0]);

        svg3.selectAll('.bar')
            .data(carTypePrices)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.type))
            .attr('y', d => y(d.price))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.price))
            .attr('fill', d => d.type.includes('Electric') ? 'green' : 'gray')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', 'orange');
                const [x, y] = [event.pageX, event.pageY];
                d3.select('body').append('div')
                    .attr('id', 'tooltip')
                    .style('position', 'absolute')
                    .style('left', `${x + 5}px`)
                    .style('top', `${y + 5}px`)
                    .style('background-color', 'white')
                    .style('border', '1px solid black')
                    .style('padding', '5px')
                    .style('font-size', '12px')
                    .style('font-family', 'Arial')
                    .html(`Type: ${d.type}<br>Price: $${d.price.toFixed(2)}`);
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', d => d.type.includes('Electric') ? 'green' : 'gray');
                d3.select('#tooltip').remove();
            });

        svg3.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
        svg3.append('g').call(d3.axisLeft(y));
    });

    // Slide 5: Fuel and Electricity Prices Chart
    d3.csv('data/fuel_prices.csv').then(fuelData => {
        const svg4 = d3.select('#fuel-electricity-prices-chart').append('svg')
            .attr('width', width)
            .attr('height', height);

        const years = Array.from(new Set(fuelData.map(d => d.Year)));
        const x = d3.scaleBand().domain(years).range([0, width]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(fuelData, d => Math.max(d.GasPrice, d.ElectricityPrice))]).range([height, 0]);

        svg4.selectAll('.bar-gas')
            .data(fuelData)
            .enter().append('rect')
            .attr('class', 'bar-gas')
            .attr('x', d => x(d.Year))
            .attr('y', d => y(d.GasPrice))
            .attr('width', x.bandwidth() / 2)
            .attr('height', d => height - y(d.GasPrice))
            .attr('fill', 'red')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', 'orange');
                const [x, y] = [event.pageX, event.pageY];
                d3.select('body').append('div')
                    .attr('id', 'tooltip')
                    .style('position', 'absolute')
                    .style('left', `${x + 5}px`)
                    .style('top', `${y + 5}px`)
                    .style('background-color', 'white')
                    .style('border', '1px solid black')
                    .style('padding', '5px')
                    .style('font-size', '12px')
                    .style('font-family', 'Arial')
                    .html(`Year: ${d.Year}<br>Gas Price: $${d.GasPrice.toFixed(2)}`);
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', 'red');
                d3.select('#tooltip').remove();
            });

        svg4.selectAll('.bar-electricity')
            .data(fuelData)
            .enter().append('rect')
            .attr('class', 'bar-electricity')
            .attr('x', d => x(d.Year) + x.bandwidth() / 2)
            .attr('y', d => y(d.ElectricityPrice))
            .attr('width', x.bandwidth() / 2)
            .attr('height', d => height - y(d.ElectricityPrice))
            .attr('fill', 'blue')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', 'orange');
                const [x, y] = [event.pageX, event.pageY];
                d3.select('body').append('div')
                    .attr('id', 'tooltip')
                    .style('position', 'absolute')
                    .style('left', `${x + 5}px`)
                    .style('top', `${y + 5}px`)
                    .style('background-color', 'white')
                    .style('border', '1px solid black')
                    .style('padding', '5px')
                    .style('font-size', '12px')
                    .style('font-family', 'Arial')
                    .html(`Year: ${d.Year}<br>Electricity Price: $${d.ElectricityPrice.toFixed(2)}`);
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', 'blue');
                d3.select('#tooltip').remove();
            });

        svg4.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
        svg4.append('g').call(d3.axisLeft(y));
    });
});
