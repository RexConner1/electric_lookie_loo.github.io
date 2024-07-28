document.addEventListener('DOMContentLoaded', function () {
    const width = 800;
    const height = 600;
    const radius = Math.min(width, height) / 2;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const graphics2 = createGraphics('#pie-chart', width, height, margin);

    const g = graphics2.svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    d3.csv('data/ev_car_data.csv').then(data => {
        const modelCount = d3.rollup(
            data,
            v => v.length,
            d => d.Make
        );

        const pieData = Array.from(modelCount, ([make, count]) => ({ make, count }));

        const color = d3.scaleOrdinal()
            .domain(pieData.map(d => d.make))
            .range(d3.schemeCategory10);

        // Draw the pie chart
        const slices = g.selectAll('path')
            .data(pie(pieData))
            .enter().append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.make))
            .on('mouseover', function (event, d) {
                const [x, y] = d3.pointer(event);
                graphics2.showTooltip(`Make: ${d.data.make}<br>Count: ${d.data.count}`, x, y);

                // Text on hover
                g.append('text')
                    .attr('id', 'hover-text')
                    .attr('transform', `translate(${arc.centroid(d)})`)
                    .attr('dy', '0.35em')
                    .style('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .text(`${d.data.make}: ${d.data.count}`);
            })
            .on('mousemove', function (event) {
                const [x, y] = d3.pointer(event);
                graphics2.showTooltip('', x, y);
            })
            .on('mouseout', function () {
                graphics2.hideTooltip();
                // Remove text when not hovering
                g.select('#hover-text').remove();
            });

        const legend = d3.select('#pie-legend').append('svg')
            .attr('width', 150)
            .attr('height', pieData.length * 20);

        pieData.forEach((d, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 20})`);

            legendRow.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', color(d.make));

            legendRow.append('text')
                .attr('x', 20)
                .attr('y', 10)
                .style('text-anchor', 'start')
                .style('font-size', '12px')
                .text(d.make);
        });
    });
});
