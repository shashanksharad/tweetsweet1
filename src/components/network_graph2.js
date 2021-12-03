// import * as d3 from 'd3';
// import React, { useRef, useEffect } from 'react';

// function NetworkGraphChart2({ width, height, graphdata}){
//     const ref = useRef();
//     console.log("inside NetworkGraphChart");
//     // console.log(graphdata);


//     useEffect(() => {
//         const svg = d3.select(ref.current)
//             .attr("width", width)
//             .attr("height", height)
            
//     }, []);

//     useEffect(() => {
//         draw();
//     }, [graphdata]);

//     const draw = () => {
        

//         const svg = d3.select(ref.current);
//         svg.selectAll("*").remove()

//         var margin = {top: 10, right: 30, bottom: 33, left: 40}, 
//         width_plot = width - margin.left - margin.right,
//         height_plot = height - margin.top - margin.bottom;

//         // append the svg object to the body of the page
        
//         svg.append("svg")
//         .attr("width", width_plot + margin.left + margin.right)
//             .attr("height", height_plot + margin.top + margin.bottom)
//         var g = svg.append("g")
//             .attr("transform",
//                 "translate(" + margin.left + "," + margin.top + ")");
        
//         var links = graphdata
//         var data = ({nodes: Array.from(new Set(links.flatMap(l => [l.source, l.target])), id => ({id})), links})
        
//         // var toxic_rt = Array.from(new Set(links.map(d => d.type)))
//         // var color = d3.scaleOrdinal(toxic_rt, d3.schemeCategory10)

//         const links = data.links.map(d => Object.create(d));
//         const nodes = data.nodes.map(d => Object.create(d));
    
//         const simulation = d3.forceSimulation(nodes)
//             .force("link", d3.forceLink(links).id(d => d.id))
//             .force("charge", d3.forceManyBody().strength(-300))
//             .force("x", d3.forceX())
//             .force("y", d3.forceY())
//             .force('collide', d3.forceCollide(d => 65))
    
        
//         // Per-type markers, as they don't inherit styles.
//         g.append("defs").selectAll("marker")
//             .data(types)
//             .join("marker")
//             .attr("id", d => `arrow-${d}`)
//             .attr("viewBox", "0 -5 10 10")
//             .attr("refX", 38)
//             .attr("refY", 0)
//             .attr("markerWidth", 6)
//             .attr("markerHeight", 6)
//             .attr("orient", "auto")
//             .append("path")
//             .attr("fill", color)
//             .attr("d", 'M0,-5L10,0L0,5');
    
//         const link = g.append("g")
//             .attr("fill", "none")
//             .attr("stroke-width", 1.5)
//             .selectAll("path")
//             .data(links)
//             .join("path")
//             .attr("stroke", d => color(d.type))
//             .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);
    
//         const node = g.append("g")
//             .attr("fill", "currentColor")
//             .attr("stroke-linecap", "round")
//             .attr("stroke-linejoin", "round")
//             .selectAll("g")
//             .data(nodes)
//             .join("g")
//             .call(drag(simulation));
    
//         node.append("circle")
//             .attr("stroke", "white")
//             .attr("stroke-width", 1.5)
//             .attr("r", 25)
//             .attr('fill', d => '#6baed6');
        
//         node.append("text")
//             .attr("x", 30 + 4)
//             .attr("y", "0.31em")
//             .text(d => d.id)
//             .clone(true).lower()
//             .attr("fill", "none")
//             .attr("stroke", "white")
//             .attr("stroke-width", 3);
        
//         node.on('dblclick', (e, d) => console.log(nodes[d.index]))
    
    
//         simulation.on("tick", () => {
//             link.attr("d", linkArc);
//             node.attr("transform", d => `translate(${d.x},${d.y})`);
//         });
    
//         invalidation.then(() => simulation.stop());
        
//     }

//     return (
//         <div className="chart">
//             <svg ref={ref}>
//             </svg>
//         </div>
        
//     )

// }

// export default NetworkGraphChart2;