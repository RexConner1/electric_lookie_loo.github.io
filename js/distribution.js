d3.csv('data/ev_data.csv').then(evData => {
    class EVDistribution extends Graphics {
        constructor(width, height) {
            super(width, height);
        }

        renderMap(countyData) {
            const projection = d3.geoMercator().scale(5000).center([-122.5, 47.5]);
            const path = d3.geoPath().projection(projection);

            this.svg.selectAll('path')
                .data(countyData)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', 'lightgray')
                .attr('stroke', 'white');

            this.svg.selectAll('circle')
                .data(evData)
                .enter().append('circle')
                .attr('cx', d => projection([+d.Longitude, +d.Latitude])[0])
                .attr('cy', d => projection([+d.Longitude, +d.Latitude])[1])
                .attr('r', 3)
                .attr('fill', 'red')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget).attr('r', 6);
                    this.showTooltip(`${d.City}: ${d.Make} ${d.Model}`, event.pageX, event.pageY);
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget).attr('r', 3);
                    this.hideTooltip();
                });
        }
    }

    const evDistribution = new EVDistribution(800, 600);
    evDistribution.createSVG('#ev-distribution-map');
    evDistribution.createTooltip();

    d3.json('wa_counties_topojson.json').then(wa => {
        const counties = topojson.feature(wa, wa.objects.counties).features;
        evDistribution.renderMap(counties);
    });
});
