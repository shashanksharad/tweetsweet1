import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

const louvain = require('louvain-algorithm');

function WordNetwork2({ width, height, graphdata, thresh}){
    const ref = useRef();
    

    // var data = graphdata;
    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            
    }, []);

    useEffect(() => {
        draw();
    }, [graphdata, thresh]);

    

    const draw = () => {
        
        var data = graphdata

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove()

        var margin = {top: 5, right: 5, bottom: 5, left: 5}, 
        width_plot = width - margin.left - margin.right,
        height_plot = height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        
        svg.append("svg")
            .attr("width", width_plot + margin.left + margin.right)
            .attr("height", height_plot + margin.top + margin.bottom)
            .attr("viewBox", [-width_plot / 2, -height_plot / 2, width_plot, height_plot])
            
            // .attr("viewBox", [10, 50, 50, 50])
        var g = svg.append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            
        console.log("Links before filter:");
        console.log(data.links)
        console.log(thresh)

        // var class_data = data.nodes.map(d => d.)
        var fltrd_links = data.links.filter( d=>(+d.weight)>=thresh);

        if (data.nodes.length>1) {
            let node2com = louvain.jLouvain(data.nodes, fltrd_links , 2);
            console.log("louvain clusters:")
            console.log(node2com);
        }

        

        const links = fltrd_links.map(d => Object.create(d));
        const nodes = data.nodes.map(d => Object.create(d));

    
        var force_strength = 0.1
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("x", d3.forceX(width_plot*0.5).strength(force_strength))
            .force("y", d3.forceY(height_plot*0.5).strength(force_strength))
            .force('collide', d3.forceCollide(d => 30))


        const drag = simulation => {
  
            function dragstarted(event, d) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            }
            
            function dragged(event, d) {
              d.fx = event.x;
              d.fy = event.y;
            }
            
            function dragended(event, d) {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            }
            
            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
          }
    
        const link = g.append("g")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(links)
            .join("path")
            // .attr("stroke", d => color(d.type))
            .attr("stroke", d => "#949494")
            // .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);
    
        function mouseover() {
            d3.select(this).select("circle").transition()
                .duration(50)
                .attr("fill", "yellow");

            d3.select(this).select("text").transition()
                .duration(50)
                .style("font-size", "25px")
                .attr("x", 24);
            }
            
        function mouseout() {
            d3.select(this).select("circle").transition()
                .duration(50)
                .attr('fill', "#007FFF");

            link.style('stroke-width', function(l) {
                if (d3.select(this) === l.source || d3.select(this) === l.target)
                    return 3;
                else
                    return 1.5;
                });

            d3.select(this).select("text").transition()
                .duration(50)
                .style("font-size", "15px")
                .attr("x", 17);
            
            }
        
        const node = g.append("g")
            .attr("fill", "currentColor")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .selectAll("g")
            .data(nodes)
            .join("g")


        node.on("mouseover", function (event, d) {
            d3.select(event.currentTarget).select("circle").transition()
                .duration(50)
                .attr("fill", "yellow")

            d3.select(event.currentTarget).select("text").transition()
                .duration(50)
                .attr("fill", "yellow")
                .attr("stroke", "yellow")
                .style("font-size", "25px")
                .attr("x", 22);


            console.log("original node")
            console.log(d)
            // console.log("selected event: ")
            // console.log(d3.select(event.currentTarget))
            node.each(function(n) {
                
                for (let index = 0; index < links.length; index++) {
                    const element = links[index];
                    
                    if ( (element.source === d && element.target=== n) || (element.target === d && element.source === n)) {
                        console.log("connecting node found")
                        console.log(n)
                        d3.select(this).select("circle").style("stroke", "white").style("stroke-width", 3)
                        d3.select(this).select("circle")
                        
                        
                    }

                    else {
                        d3.select(this).select("circle");
                    }
                }
                });

            link.style('stroke-width', function(l) {
                if (d === l.source || d === l.target)
                    return 3;
                else
                    return 1.5;
                });

            link.attr('stroke', function(l) {
                if (d === l.source || d === l.target)
                    return "white";
                else
                    return "#949494";
                });
        })
            .on("mouseout", function (event, d) {

                d3.select(event.currentTarget).select("circle").transition()
                    .duration(50)
                    .attr('fill', "#007FFF")
                 

                d3.select(event.currentTarget).select("text").transition()
                    .duration(50)
                    .attr("fill", "white")
                    .attr("stroke", "#FFFFFF")
                    .style("font-size", "15px")
                    .attr("x", 17);

                node.each(function(n) { d3.select(this).select("circle").style("stroke", "none");});

                link.style('stroke-width', 1.5);
                link.attr('stroke', "#949494");
            })
            .call(drag(simulation));



        var color = d3.scaleOrdinal([0, 1], ["green", "red"]);
    
        node.append("circle")
            .attr("stroke", "white")
            .attr("stroke-width", 3)
            .attr("r", function (d) {
                d.weight_ = link.filter(function(l) {return l.source.index == d.index || l.target.index == d.index}).size();      
                  var minRadius = 5;
                  return minRadius + (d.weight_*0.8);
            })
            .attr('fill', "#007FFF")
            
    
        node.append("text")
            .attr("x", 17)
            .attr("y", "0.31em")
            .text(d => d.id)
            .attr("fill", "white")
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", 1)
            .style("font-size", "15px")
           
    
        node.on('dblclick', (e, d) => console.log(nodes[d.index]))
    
    
        const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`

        

        simulation.on("tick", () => {
            
            node.attr("transform", d => `translate(${d.x},${d.y})`);
            link.attr("d", linkArc);
        });

        // node.exit().remove();
        // link.exit().remove();
   

    }

    // draw();


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default WordNetwork2;