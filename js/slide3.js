document.addEventListener('DOMContentLoaded', function () {
    const width = 650;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    const graphics3 = createGraphics('#scatter-plot', width, height, margin);

    Promise.all([
        d3.csv('data/ev_car_data.csv'),
        d3.csv('data/non_ev_car_data.csv')
    ]).then(([evData, nonEvData]) => {
        const x = d3.scaleLinear()
            .domain([0, d3.max([...evData, ...nonEvData], d => +d.price)])
            .range([0, width]);

        const yHorsepower = d3.scaleLinear()
            .domain([0, d3.max(nonEvData, d => +d.horsepower)])
            .range([height, 0]);

        const yRange = d3.scaleLinear()
            .domain([0, d3.max(evData, d => +d['Electric Range'])])
            .range([height, 0]);

        graphics3.svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        graphics3.svg.append('g')
            .call(d3.axisLeft(yHorsepower).ticks(10));

        const evPoints = graphics3.svg.selectAll('.ev')
            .data(evData)
            .enter().append('circle')
            .attr('class', 'ev')
            .attr('cx', d => x(+d['Base MSRP']))
            .attr('cy', d => yRange(+d['Electric Range']))
            .attr('r', 5)
            .attr('fill', 'blue')
            .on('mouseover', function (event, d) {
                graphics3.showTooltip(`Price: $${d['Base MSRP']}<br>Range: ${d['Electric Range']} miles`, event.pageX, event.pageY);
            })
            .on('mouseout', function () {
                graphics3.hideTooltip();
            });

        const nonEvPoints = graphics3.svg.selectAll('.non-ev')
            .data(nonEvData)
            .enter().append('circle')
            .attr('class', 'non-ev')
            .attr('cx', d => x(+d.price))
            .attr('cy', d => yHorsepower(+d.horsepower))
            .attr('r', 5)
            .attr('fill', 'red')
            .on('mouseover', function (event, d) {
                graphics3.showTooltip(`Price: $${d.price}<br>Horsepower: ${d.horsepower}`, event.pageX, event.pageY);
            })
            .on('mouseout', function () {
                graphics3.hideTooltip();
            });

        graphics3.addAxisLabel('x', 'Price ($)');
        graphics3.addAxisLabel('y', 'Horsepower (Non-EV) / Range (EV)');
    }).catch(error => {
        console.error('Error loading or processing CSV data:', error);
    });
});
