d3.csv('data/ev_data.csv').then(evData => {
    class EVModels extends Graphics {
        constructor(width, height) {
            super(width, height);
        }

        renderBarChart(modelCounts) {
            const x = d3.scaleBand().domain(modelCounts.map(d => d.model)).range([0, this.width]).padding(0.1);
            const y = d3.scaleLinear().domain([0, d3.max(modelCounts, d => d.count)]).range([this.height, 0]);

            this.svg.selectAll('.bar')
                .data(modelCounts)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.model))
                .attr('y', d => y(d.count))
                .attr('width', x.bandwidth())
                .attr('height', d => this.height - y(d.count))
                .attr('fill', 'steelblue')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget).attr('fill', 'darkblue');
                    this.showTooltip(`${d.model}: ${d.count}`, event.pageX, event.pageY);
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget).attr('fill', 'steelblue');
                    this.hideTooltip();
                });

            this.svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${this.height})`)
                .call(d3.axisBottom(x).tickFormat(d => d.length > 10 ? d.slice(0, 10) + '...' : d));

            this.svg.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y));
        }
    }

    const evModels = new EVModels(800, 600);
    evModels.createSVG('#ev-models-chart');
    evModels.createTooltip();

    const modelCounts = d3.rollups(evData, v => v.length, d => d.Model)
        .map(([model, count]) => ({ model, count }))
        .sort((a, b) => d3.descending(a.count, b.count))
        .slice(0, 10);

    evModels.renderBarChart(modelCounts);
});
