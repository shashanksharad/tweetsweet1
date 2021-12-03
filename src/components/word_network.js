import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function WordNetwork({ width, height, graphdata}){
    const ref = useRef();
    console.log("Data received inside WordNetwork function: ")
    console.log(graphdata);

    var data = graphdata;
    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            
    }, []);

    useEffect(() => {
        draw();
    }, [graphdata]);

    

    const draw = () => {
        
        console.log("Graph links: ");
        console.log(graphdata.links)
        const svg = d3.select(ref.current);
        // svg.selectAll("*").remove()

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

        // var links = graphdata.links.map(d => Object.create(d));
        // var nodes = graphdata.nodes.map(d => Object.create(d));

        var nodes = []
        var links = []
        
        data.links.forEach((d) => {
            links.push(Object.create(d));
            console.log(d);
          });

        data.nodes.forEach((d) => {
            nodes.push(Object.create(d));
            console.log(d);
        });

        console.log("object nodes:")
        console.log(nodes)

        // const links = graphdata.links;
        // const nodes = graphdata.nodes;
        
    
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force('collide', d3.forceCollide(d => 10))
    
       
    
        // Per-type markers, as they don't inherit styles.
        g.append("defs").selectAll("marker")
            .append("path")
            .attr("fill", "white")
            .attr("d", 'M0,-5L10,0L0,5');

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
            .attr("stroke-width", 2)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("stroke", "white")
            
    
        const node = g.append("g")
            .attr("fill", "currentColor")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(drag(simulation));
    
        node.append("circle")
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .attr("r", 5)
            .attr('fill', d => '#6baed6');
        
        node.append("text")
            .attr("x", 30 + 4)
            .attr("y", "0.31em")
            .text(d => d.id)
            .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
           
        
        node.on('dblclick', (e, d) => console.log(nodes[d.index]))
    
    
        simulation.on("tick", () => {
            // link.attr("d", linkArc);
            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });
    

        

        // invalidation.then(() => simulation.stop());
            
            

        // var link, node;
        // // the data - an object with nodes and links
        // var graph;

        // // values for all forces
        // var forceProperties = {
        //     center: {
        //         x: 0.5,
        //         y: 0.5,
        //     },
        //     charge: {
        //         enabled: true,
        //         strength: -30,
        //         distanceMin: 1,
        //         distanceMax: 2000
        //     },
        //     collide: {
        //         enabled: true,
        //         strength: .7,
        //         iterations: 1,
        //         radius: 5
        //     },
        //     forceX: {
        //         enabled: false,
        //         strength: .1,
        //         x: .5
        //     },
        //     forceY: {
        //         enabled: false,
        //         strength: .1,
        //         y: .5
        //     },
        //     link: {
        //         enabled: true,
        //         distance: 30,
        //         iterations: 1
        //     }
        // }
        
        // // load the data
        
        // var graph = graphdata;
        
        // initializeDisplay();
        // initializeSimulation();
        

        // console.log("Graph Data:")
        // console.log(graph);
        
        // // force simulator
        // var simulation = d3.forceSimulation();

        // // set up the simulation and event to update locations after each tick
        
        // function initializeSimulation() {
        //     simulation.nodes()
        //     initializeForces();
        //     simulation.on("tick", ticked);
        // }

        

        // function initializeForces() {
        //     // add forces and associate each with a name
        //     simulation
        //         .force("link", d3.forceLink())
        //         .force("charge", d3.forceManyBody())
        //         .force("collide", d3.forceCollide())
        //         .force("center", d3.forceCenter())
        //         .force("forceX", d3.forceX())
        //         .force("forceY", d3.forceY());
        //     // apply properties to each of the forces
        //     updateForces();
        // }

        // // apply new force properties
        // function updateForces() {
        //     // get each force by name and update the properties
        //     simulation.force("center")
        //         .x(width * forceProperties.center.x)
        //         .y(height * forceProperties.center.y);
        //     simulation.force("charge")
        //         .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        //         .distanceMin(forceProperties.charge.distanceMin)
        //         .distanceMax(forceProperties.charge.distanceMax);
        //     simulation.force("collide")
        //         .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
        //         .radius(forceProperties.collide.radius)
        //         .iterations(forceProperties.collide.iterations);
        //     simulation.force("forceX")
        //         .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
        //         .x(width * forceProperties.forceX.x);
        //     simulation.force("forceY")
        //         .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
        //         .y(height * forceProperties.forceY.y);
        //     simulation.force("link")
        //         .id(function(d) {return d.id;})
        //         .distance(forceProperties.link.distance)
        //         .iterations(forceProperties.link.iterations)
        //         .links(forceProperties.link.enabled ? graph.links : []);

        //     // updates ignored until this is run
        //     // restarts the simulation (important if simulation has already slowed down)
        //     simulation.alpha(1).restart();
        // }


        // // generate the svg objects and force simulation
        // function initializeDisplay() {
            
        //     // set the data and properties of link lines
        //     link = g.append("g")
        //         .attr("class", "links")
        //     .selectAll("line")
        //     .data(graph.links)
        //     .enter().append("line");
        
        //     // set the data and properties of node circles
        //     node = g.append("g")
        //         .attr("class", "nodes")
        //     .selectAll("circle")
        //     .data(graph.nodes)
        //     .enter().append("circle")
        //         .call(d3.drag()
        //             .on("start", dragstarted)
        //             .on("drag", dragged)
        //             .on("end", dragended));
        
        //     // node tooltip
        //     node.append("title")
        //         .text(function(d) { return "text"; });
        //     // visualize the graph
        //     updateDisplay();
        // }
        
        // // update the display based on the forces (but not positions)
        // function updateDisplay() {
        //     node.attr("r", forceProperties.collide.radius)
        //         .attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
        //         .attr("stroke-width", forceProperties.charge.enabled==false ? 0 : Math.abs(forceProperties.charge.strength)/15);

        //     link.attr("stroke-width", forceProperties.link.enabled ? 1 : .5)
        //         .attr("opacity", forceProperties.link.enabled ? 1 : 0);
        // }

        // // update the display positions after each simulation tick
        // function ticked() {
        //     link
        //         .attr("x1", function(d) { return d.source.x; })
        //         .attr("y1", function(d) { return d.source.y; })
        //         .attr("x2", function(d) { return d.target.x; })
        //         .attr("y2", function(d) { return d.target.y; });

        //     node
        //         .attr("cx", function(d) { return d.x; })
        //         .attr("cy", function(d) { return d.y; });
        //     d3.select('#alpha_value').style('flex-basis', (simulation.alpha()*100) + '%');
        // }

        // function updateAll() {
        //     updateForces();
        //     updateDisplay();
        // }

        // function dragstarted(event, d) {
        //     if (!event.active) simulation.alphaTarget(0.3).restart();
        //     d.fx = d.x;
        //     d.fy = d.y;
        //   }
          
        //   function dragged(event, d) {
        //     d.fx = event.x;
        //     d.fy = event.y;
        //   }
          
        //   function dragended(event, d) {
        //     if (!event.active) simulation.alphaTarget(0.0001);
        //     d.fx = null;
        //     d.fy = null;
        //   }

    }

    // draw();


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default WordNetwork;