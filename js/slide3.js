document.addEventListener('DOMContentLoaded', function () {
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const graphics3 = createGraphics('#bar-chart', width, height, margin);

    console.log('Graphics created', graphics3);

    d3.csv('data/ev_car_data.csv').then(data => {
        console.log('CSV data loaded', data);

        const modelCount = d3.rollup(
            data,
            v => v.length,
            d => d.Model
        );

        console.log('Model count', modelCount);

        const sortedModels = Array.from(modelCount, ([model, count]) => ({ model, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        console.log('Sorted models', sortedModels);

        const x = d3.scaleBand()
            .domain(sortedModels.map(d => d.model))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(sortedModels, d => d.count)])
            .nice()
            .range([height, 0]);

        console.log('Scales created', { x, y });

        graphics3.svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        graphics3.svg.append('g')
            .call(d3.axisLeft(y));

        graphics3.svg.selectAll('.bar')
            .data(sortedModels)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.model))
            .attr('y', d => y(d.count))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.count))
            .attr('fill', 'steelblue')
            .on('mouseover', function (event, d) {
                graphics3.showTooltip(`Model: ${d.model}<br>Count: ${d.count}`, event.pageX, event.pageY);
            })
            .on('mousemove', function (event) {
                graphics3.showTooltip('', event.pageX, event.pageY);
            })
            .on('mouseout', function () {
                graphics3.hideTooltip();
            });

        console.log('Bars created');

        graphics3.addAxisLabel('x', 'Model');
        graphics3.addAxisLabel('y', 'Count');
    }).catch(error => {
        console.error('Error loading or processing CSV data:', error);
    });
});
