// import * as d3 from 'd3';
// import React, { useRef, useEffect } from 'react';

// const louvain = require('louvain-algorithm');

// function WordNetwork3({ width, height, graphdata, thresh}){
//     const ref = useRef();
    

//     // var data = graphdata;
//     useEffect(() => {
//         const svg = d3.select(ref.current)
//             .attr("width", width)
//             .attr("height", height)
            
//     }, []);

//     useEffect(() => {
//         draw();
//     }, [graphdata, thresh]);

    

//     const draw = () => {
        
//         var graph = graphdata

//         const svg = d3.select(ref.current);
//         svg.selectAll("*").remove()

//         var margin = {top: 5, right: 5, bottom: 5, left: 5}, 
//         width_plot = width - margin.left - margin.right,
//         height_plot = height - margin.top - margin.bottom;

//         // append the svg object to the body of the page
        
//         svg.append("svg")
//             .attr("width", width_plot + margin.left + margin.right)
//             .attr("height", height_plot + margin.top + margin.bottom)
//             .attr("viewBox", [-width_plot / 2, -height_plot / 2, width_plot, height_plot])
            
//             // .attr("viewBox", [10, 50, 50, 50])
//         var g = svg.append("g")
//             .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            
//         console.log("Links before filter:");
//         console.log(data.links)
//         console.log(thresh)

//         // var class_data = data.nodes.map(d => d.)
//         var fltrd_links = data.links.filter( d=>(+d.similarity)>=thresh);

        
//         var force = d3.layout.force()
//             .charge(-120)
//             .linkDistance(30)
//             .size([width, height]);

//         //Creates the graph data structure out of the json data
//         force.nodes(graph.nodes)
//         .links(graph.links)
//         .start();

//         //Create all the line svgs but without locations yet
//         var link = svg.selectAll(".link")
//         .data(graph.links)
//         .enter().append("line")
//         .attr("class", "link")
//         .style("stroke-width", function (d) {
//         return Math.sqrt(d.value);
//         });

//         //Do the same with the circles for the nodes - no 
//         var node = svg.selectAll(".node")
//         .data(graph.nodes)
//         .enter().append("circle")
//         .attr("class", "node")
//         .attr("r", 8)
//         .style("fill", function (d) {
//         return color(d.group);
//         })
//         .call(force.drag);


//         //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
//         force.on("tick", function () {
//         link.attr("x1", function (d) {
//             return d.source.x;
//         })
//             .attr("y1", function (d) {
//             return d.source.y;
//         })
//             .attr("x2", function (d) {
//             return d.target.x;
//         })
//             .attr("y2", function (d) {
//             return d.target.y;
//         });

//         node.attr("cx", function (d) {
//             return d.x;
//         })
//             .attr("cy", function (d) {
//             return d.y;
//         });
//         });


//         //---Insert-------

//         //adjust threshold

//         function threshold(thresh) {
//         graph.links.splice(0, graph.links.length);

//             for (var i = 0; i < graphRec.links.length; i++) {
//                 if (graphRec.links[i].value > thresh) {graph.links.push(graphRec.links[i]);}
//             }
//         restart();
//         }


//         //Restart the visualisation after any node and link changes

//         function restart() {

//         link = link.data(graph.links);
//         link.exit().remove();
//         link.enter().insert("line", ".node").attr("class", "link");
//         node = node.data(graph.nodes);
//         node.enter().insert("circle", ".cursor").attr("class", "node").attr("r", 5).call(force.drag);
//         force.start();
//         }

//     }

//     // draw();


//     return (
//         <div className="chart">
//             <svg ref={ref}>
//             </svg>
//         </div>
        
//     )

// }

// export default WordNetwork3;