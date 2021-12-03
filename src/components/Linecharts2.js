import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function LineChart2({ width, height, data }){
    const ref = useRef();
    
    console.log(data);


    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black")
    }, []);

    useEffect(() => {
        draw();
    }, [data]);

    const draw = () => {
        
        const svg = d3.select(ref.current);

        var margin = {top: 0, right: 0, bottom: 0, left: 0};
            // width = 960 - margin.left - margin.right,
            // height = 500 - margin.top - margin.bottom;
        
        var parseTime = d3.timeParse("%Y-%m-%d");

        // data.forEach(function(d) {
        //     d.date = parseTime(d.date);
        //     d.score = +d.score;
        //     console.log(d.date, d.score)
        // });

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        var valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(+d.score); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // gridlines in x axis function
        function make_x_gridlines() {		
            return d3.axisBottom(x)
                .ticks(1)
        }

        // gridlines in y axis function
        function make_y_gridlines() {		
            return d3.axisLeft(y)
                .ticks(1)
        }


        // format the data
        

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return +d.score; })]);

        // add the X gridlines
        svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )

        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )

        // add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .style('stroke', 'white')
            .style("fill", "None")

        // add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));





    }


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default LineChart2;