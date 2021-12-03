import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function NetworkGraphChart({ width, height, graphdata}){
    const ref = useRef();
    console.log("inside NetworkGraphChart");
    // console.log(graphdata);


    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            
    }, []);

    useEffect(() => {
        draw();
    }, [graphdata]);

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
        
        var graphdata_dummy = []
        for (var i=1; i<9; i++) {
            graphdata_dummy.push({
                source: 'user0',
                target: 'user'+i.toString(),
                toxic_retweets: Math.round(50*Math.random())
            })
        }
        var links = graphdata;
        var nodes = {};
    
        // compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
        });

        
        var force = d3.forceSimulation()
            .nodes(Object.values(nodes))
            .force("link", d3.forceLink(links).distance(100))
            .force('center', d3.forceCenter(width_plot / 2, height_plot/ 2))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force("charge", d3.forceManyBody().strength(-250))
            .alphaTarget(1)
            .on("tick", tick);

        // add the links
        var path = g.append("g")
            .selectAll("path")
            .data(links)
            .enter()
            .append("path")
            .attr("class", function(d) { return "link " + d.type; })
            .attr("class", function(d) {if (d.toxic_retweets>10) {return "link solid"} else {return "link dashed"}})
    

        // define the nodes
        var node = g.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("dblclick", unpin);

        // // function nodeDegree(d) {
        // //     d.weight = links.filter(
        // //         function(l) { return l.source.index == d.index || l.target.index == d.index});
        // //     return d.weight.length;
        // // }
    
        
    
        // add the nodes
        node.append("circle")
            .attr("id", function(d){
                return (d.name);
                
            })
            .attr("r", function(d) {
                var minRadius = 5;
                console.log(d)
                return minRadius+ Math.random()*20;
            })
            .style("fill", function (d) {return "white";});
            
    
        node.append("text")
            .text(function(d) {
                return d.name;
            })
            .attr("text-anchor", "start")
            .attr("dx", "0.65em")       // set offset x position
            .attr("dy", "0em")
            .style("font-weight", 20)
            .style("font-size", '20px')
            .style("fill", "white")

        function tick() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    // dr = Math.sqrt(dx * dx + dy * dy);
                    dr=0;
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });
    
            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; 
            });
        };
        
        function dragstarted(event, d) {
            if (!event.active) force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            
        };
    
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
            d.fixed = true;
            
            // d3.select(d3.event.index).style("fill", "#333333");
        };
    
        function dragended(event, d) {
            if (!event.active) force.alphaTarget(0);
            if (d.fixed == true) {
                d.fx = d.x;
                d.fy = d.y;
                
                d3.select(this)
                    .select("circle")
                    .style("fill", "red");
            }
            else {
                d.fx = null;
                d.fy = null;
                // console.log("")
                
            }
    
            
        };
        
        function unpin(d) {
            d.fixed = null;
            d.fx = null;
            d.fy = null;
    
            d3.select(this)
                .select("circle")
                .style("fill", function (d) {return "white";});
    
        }
        

        
    }

    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default NetworkGraphChart;