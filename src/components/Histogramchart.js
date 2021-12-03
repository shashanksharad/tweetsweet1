import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function HistChart({ width, height, data, trshld}){
    const ref = useRef();
    
    // console.log(data);


    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            
    }, []);

    useEffect(() => {
        draw();
    }, [data]);

    const draw = () => {
        
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d.score; }))
            .rangeRound([0, width]);


        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .range([height, 0]);

        var histogram = d3.bin()
            .value(function(d) { 
                return +d.score; })
            .domain(x.domain())
            .thresholds(x.ticks(20))

        var bins = histogram(data);

        // Scale the range of the data in the y domain
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);

        svg.append("g")
            .call(d3.axisLeft(y));

        var selection = svg.selectAll("rect").data(bins);

                
        
        // selection
        //     .transition().duration(300)
        //         .attr("height", (d) => 50)
        //         .attr("y", (d) => height)
                

        selection
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) {
                return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", function(d){ if(d.x0<trshld){return "orange"} else {return "#69b3a2"}})

    
        
        // selection
        //     .exit()
        //     .transition().duration(300)
        //         .attr("height", 0)
        //         .attr("y", height)
        //     .remove()

        // selection
        // .transition().duration(300)
        //     .attr("height", (d) => 0)
        //     .attr("y", (d) => height)
                

        // selection
        //     .enter()
        //     .append("rect")
        //     .attr("x", 1)
        //     .attr("transform", function(d) {
        //         return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        //     .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        //     .attr("height", function(d) { return height - y(d.length); })
        //     .style("fill", function(d){ if(d.x0<0.5){return "orange"} else {return "#69b3a2"}})

    
        
        // selection
        //     .exit()
        //     .transition().duration(300)
        //         .attr("height", 0)
        //         .attr("y", height)
        //     .remove()
    }


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default HistChart;