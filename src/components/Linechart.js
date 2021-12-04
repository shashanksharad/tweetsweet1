import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function LineChart({ width, height, data, weight, trshld}){
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
        svg.selectAll("*").remove();

        var margin = {top: 0, right: 0, bottom: 20, left: 40};
        var width_plot = width - margin.left - margin.right;
        var height_plot = height - margin.top - margin.bottom;
        
        

        // set the ranges
        var x = d3.scaleTime().range([0, width_plot]);
        // var y = d3.scaleLinear().range([height_plot, 0]);
        var y = d3.scaleLog().range([height_plot, 0]);

        var y_offset = 1;
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        // y.domain([0, d3.max(data, function(d) { return +d[weight]; })]);
        y.domain([y_offset , d3.max(data, function(d) { return (+d.score)*(+d[weight])+y_offset  })+20]);

        function padded_weight (v) {
            return v+1;
        }
        // define the line
        var valueline = d3.line()
            .curve(d3.curveStep)
            .x(function(d) { return x(d.date); })
            .y(function(d) { 
                
                return y((+d.score)*(+d[weight])+y_offset ); 
            });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        svg.attr("width", width_plot + margin.left + margin.right)
            .attr("height", height_plot + margin.top + margin.bottom)
        var g = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        g.append("text")
            .attr("x", width_plot*0.88)
            .attr("y", 10)
            .style("fill", "white")
            .text(weight.toString()+" Engagement")
            .style("text-anchor", "middle")
            .attr("alignment-baseline","middle")
            .style("font-size", "30%");

        // gridlines in x axis function
        function make_x_gridlines() {		
            return d3.axisBottom(x)
                .ticks(10)
        }

        // gridlines in y axis function
        function make_y_gridlines() {		
            return d3.axisLeft(y)
                .ticks(10)
        }


        // format the data
        

        

        // add the X gridlines
        g.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height_plot + ")")
            .call(make_x_gridlines()
                .tickSize(-height_plot)
                .tickFormat("")
            )

        // add the Y gridlines
        g.append("g")			
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width_plot)
                .tickFormat("")
            )

        // add the valueline path.
        g.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .style("fill", "None")

        g.append("path")
            .datum(data)
            .attr("fill", "#69b3a2")
            .attr("fill-opacity", .3)
            .attr("stroke", "none")
            .attr("d", d3.area().curve(d3.curveStep)
            .x(function(d) { return x(d.date) })
            .y0( height_plot)
            .y1(function(d) { return y((+d.score)*(+d[weight])+y_offset ) })
            )

        g.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
                .attr("fill", "red")
                .attr("stroke", "none")
                .attr("cx", function(d) { return x(d.date) })
                .attr("cy", function(d) { return y((+d.score)*(+d[weight])+y_offset )})
                .attr("r", function(d){if (d.score>trshld) {return 4 } else { return 0}})
                .on("mouseover", function(e, d) { 
                    d3.select(e.currentTarget).attr("r", 7);
                    d3.select(e.currentTarget).attr("fill", "yellow");
                    console.log("%%%%%%");
                    console.log(d);
                    updateTweetText(d);
                    updateToxicLevel(d);
                    updateScoreText(d);
                    updateEngagementLevel(d);
                    updateEngScoreText(d);
                })
                .on("mouseout", function(e, d) {
                    d3.select(e.currentTarget).attr("r", 4);
                    d3.select(e.currentTarget).attr("fill", "red");
                    updateTweetText();
                    updateToxicLevel();
                    updateScoreText();
                    updateEngagementLevel();
                    updateEngScoreText();
                
                });
                    
        
        function truncate(str, n){
            return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
            };
        
        function updateTweetText(d) {
            var info = "";
            if (d) {
                info = truncate(d.text, 200);
                // info="Hi";
            }
            d3.select("#textdiv").html(info);
        }

        function updateScoreText(d) {
            var info = "";
            var text_col = "None";
            if (d) {
                var sc = Math.round(+d.score*100);
                info = sc.toString()+"%";
                text_col = levels_colors(Math.round(sc*0.01*n_rects))
            }
            d3.select("#scorediv").html(info);
            if (text_col!=="None") {
                d3.select("#scorediv").style("color", text_col);
            }
            
        }

        function intToString (value) {
            var suffixes = ["", "k", "m", "b","t"];
            var suffixNum = Math.floor((""+value).length/3);
            var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
            if (shortValue % 1 != 0) {
                shortValue = shortValue.toFixed(1);
            }
            return shortValue+suffixes[suffixNum];
        }

        function updateEngScoreText(d) {
            var info = "";
            var text_col = "None";

            if (d) {
                var sc = +d[weight];
                info = "#"+weight.toString().substr(3)+": "+intToString(sc);
                text_col = eng_levels_colors(tx_eng_lvl(+d[weight]));
            }
            d3.select("#engscorediv").html(info);
            if (text_col!=="None") {
                d3.select("#engscorediv").style("color", text_col);
            }
            
        }

        var n_rects = 15;
        var levels_colors = d3.scaleLinear()
            .domain([1, n_rects])
            .range(["#7CFC00", "red"]);

        var eng_levels_colors = d3.scaleLinear()
            .domain([1, 5])
            .range(["#7CFC00", "red"]);


        function updateToxicLevel(d) {
            
            if (d) {
                var level = Math.round(n_rects*(+d.score))
                for (let i = 1; i <= level; i++) {
                    var rect_id = "#r"+i.toString().padStart(2, '0');
                    d3.select(rect_id).style("fill", levels_colors(i)); 
                  }
                
            }
            else {
                for (let i = 1; i <=n_rects; i++) {
                    var rect_id = "#r"+i.toString().padStart(2, '0');
                    d3.select(rect_id).style("fill", "black");
                  }
            }
            

        }

        var n_eng_rects = 5;

        function tx_eng_lvl (wt) {
            if (wt>=1 && wt<10) {
                return 1;
            } else if (wt>=10 && wt <100) {
                return 2;
            } else if (wt>=100 && wt <1000) {
                return 3;
            } else if (wt>=1000 && wt <10000) {
                return 4;
            } else if (wt>=10000) {
                return 5;
            } else {
                return 0;
            }
        }
        function updateEngagementLevel(d) {
            
            if (d) {
                var eng_level = tx_eng_lvl(+d[weight])
                // console.log("@@@@@@@");
                // console.log(eng_level);
                // // console.log(+d.weight)
                for (let i = 1; i <= eng_level; i++) {
                    var rect_id = "#e"+i.toString().padStart(2, '0');
                    d3.select(rect_id).style("fill", eng_levels_colors(i));
                  }
                
            }
            else {
                for (let i = 1; i <=5; i++) {
                    var rect_id = "#e"+i.toString().padStart(2, '0');
                    d3.select(rect_id).style("fill", "black");
                  }
            }
            

        }
            

        g.append("g")
            .attr("transform", "translate(0," + height_plot + ")")
            .call(d3.axisBottom(x));

        // add the Y Axis
        g.append("g")
            .call(d3.axisLeft(y));

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height_plot / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Engagement")
            .style('fill', 'white')
            .style("font-size", "8px");

    }


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default LineChart;