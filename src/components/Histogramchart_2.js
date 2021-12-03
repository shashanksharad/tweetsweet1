import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function HistChart2({ width, height, data, trshld}){
    const ref = useRef();
    


    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            
    }, []);

    useEffect(() => {
        draw();
    }, [data, trshld]);

    const draw = () => {
        

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove()

        var margin = {top: 10, right: 30, bottom: 33, left: 40}, 
        width_plot = width - margin.left - margin.right,
        height_plot = height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        
        svg.append("svg")
        .attr("width", width_plot + margin.left + margin.right)
            .attr("height", height_plot + margin.top + margin.bottom)
        var g = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d.score; })) 
            .range([0, width_plot]);
        
        g.append("g")
            .attr("transform", "translate(0," + height_plot + ")")
            .call(d3.axisBottom(x));
        
        // Y axis: initialization
        var y = d3.scaleLinear()
            .range([height_plot, 0]);

        var yAxis = g.append("g")

        // g.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left)
        //     .attr("x",0 - (height_plot / 2))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .text("Toxicity Score (DistilBERT)")
        //     .style('fill', 'white')
        //     .style("font-size", "8px");

        g.append("text")             
            .attr("transform",
                    "translate(" + (width_plot/2) + " ," + 
                                    (height_plot+ margin.top +20) + ")")
            .style("text-anchor", "middle")
            .text("Toxicity Score (DistilBERT)")
            .style('fill', 'white')
            .style("font-size", "10px");


        // set the parameters for the histogram
        var histogram = d3.bin()
            .value(function(d) { return d.score; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(10)); // then the numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(data);

        // Y axis: update now that we know the domain
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        yAxis.transition()
            .duration(0)
            .call(d3.axisLeft(y));

        // Join the rect with the bins data
        var u = g.selectAll("rect")
            .data(bins)

        var mycolor = d3.scaleLinear()
            .domain([0, trshld, 1])
            .range(["green", "yellow", "red"]);


        


        g.append("line")
        .attr("x1", x(trshld) )
        .attr("x2", x(trshld) )
        .attr("y1", y(0))
        .attr("y2",  0)
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "4")
        .attr("stroke-width", "3")
        // g.append("text")
        //     .attr("x", x())
        //     .attr("y", y(1400))
        //     .text("threshold: 140")
        //     .style("font-size", "15px")

        // Manage the existing bars and eventually the new ones:
        u.enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(0)
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height_plot - y(d.length); })
            // .style("fill", function(d){ if(d.x0<trshld){return "#007FFF"} else {return "#FF2121"}})
            .style("fill", function(d) {return mycolor(d.x0)})
            .style("opacity", 1);
            
            // .style("fill", function(d, i) {return color(x(d.x0)+0.5)})


        // If less bar in the new histogram, I delete the ones not in use anymore
        u.exit()
        .transition().duration(0)
            .attr("y", (d) => height_plot)
            .attr("height", 0)
        .remove()
    }





    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default HistChart2;