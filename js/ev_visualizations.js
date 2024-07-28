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
            .attr('r', 2)
            .attr('fill', 'red')
            .append('title')
            .text(d => `${d.City}: ${d['Make']} ${d['Model']}`);
    });

    // Slide 3: EV Models Chart
    const svg2 = d3.select('#ev-models-chart').append('svg')
        .attr('width', width)
        .attr('height', height);

    const types = Array.from(new Set(evData.map(d => d['Electric Vehicle Type'])));
    const typeCounts = types.map(type => ({
        type: type,
        count: evData.filter(d => d['Electric Vehicle Type'] === type).length
    }));

    const x = d3.scaleBand().domain(types).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(typeCounts, d => d.count)]).range([height, 0]);

    svg2.selectAll('.bar')
        .data(typeCounts)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.type))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.count))
        .attr('fill', 'blue');

    svg2.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
    svg2.append('g').call(d3.axisLeft(y));
});

d3.csv('data/cleaned_car_data.csv').then(carData => {
    // Slide 4: Car Price Comparison Chart
    const svg3 = d3.select('#car-price-comparison-chart').append('svg')
        .attr('width', 800)
        .attr('height', 600);

    const carTypes = carData.map(d => d.CarName);
    const carPrices = carData.map(d => +d.price);

    const x = d3.scaleBand().domain(carTypes).range([0, 800]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(carPrices)]).range([600, 0]);

    svg3.selectAll('.bar')
        .data(carData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.CarName))
        .attr('y', d => y(+d.price))
        .attr('width', x.bandwidth())
        .attr('height', d => 600 - y(+d.price))
        .attr('fill', d => d.fueltype === 'electric' ? 'green' : 'red');

    svg3.append('g').attr('transform', 'translate(0, 600)').call(d3.axisBottom(x)).selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end');
    svg3.append('g').call(d3.axisLeft(y));
});

// Slide 5: Fuel and Electricity Prices
const fuelData = [
    { year: 2020, gasPrice: 2.5, electricityPrice: 0.12 },
    { year: 2021, gasPrice: 3.0, electricityPrice: 0.13 },
    { year: 2022, gasPrice: 3.5, electricityPrice: 0.14 },
    { year: 2023, gasPrice: 4.0, electricityPrice: 0.15 }
];

const svg4 = d3.select('#fuel-electricity-prices-chart').append('svg')
    .attr('width', 800)
    .attr('height', 600);

const x = d3.scaleBand().domain(fuelData.map(d => d.year)).range([0, 800]).padding(0.1);
const y = d3.scaleLinear().domain([0, d3.max(fuelData, d => Math.max(d.gasPrice, d.electricityPrice))]).range([600, 0]);

svg4.selectAll('.bar-gas')
    .data(fuelData)
    .enter().append('rect')
    .attr('class', 'bar-gas')
    .attr('x', d => x(d.year))
    .attr('y', d => y(d.gasPrice))
    .attr('width', x.bandwidth() / 2)
    .attr('height', d => 600 - y(d.gasPrice))
    .attr('fill', 'red');

svg4.selectAll('.bar-electricity')
    .data(fuelData)
    .enter().append('rect')
    .attr('class', 'bar-electricity')
    .attr('x', d => x(d.year) + x.bandwidth() / 2)
    .attr('y', d => y(d.electricityPrice))
    .attr('width', x.bandwidth() / 2)
    .attr('height', d => 600 - y(d.electricityPrice))
    .attr('fill', 'blue');

svg4.append('g').attr('transform', 'translate(0, 600)').call(d3.axisBottom(x));
svg4.append('g').call(d3.axisLeft(y));
