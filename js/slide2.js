document.addEventListener('DOMContentLoaded', function () {
    const width = 800;
    const height = 600;
    const radius = Math.min(width, height) / 2;

    const graphics2 = new Graphics(width, height);
    graphics2.createSVG('#slide2');
    graphics2.createTooltip();

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

        const slices = g.selectAll('path')
            .data(pie(pieData))
            .enter().append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.make))
            .on('mouseover', function (event, d) {
                const [x, y] = d3.pointer(event);
                graphics2.showTooltip(`Make: ${d.data.make}<br>Count: ${d.data.count}`, x, y);

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
                g.select('#hover-text').remove();
            });

        const legend = graphics2.svg.append('g')
            .attr('transform', `translate(${width - 150}, ${height / 2 - pieData.length * 10})`);

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
