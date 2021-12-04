import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function Bubblechart({ width, height, words, clearflag}){
    const ref = useRef();
    
    // console.log(data);


    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            
    }, []);

    useEffect(() => {
        draw();
    }, [words, clearflag]);

    const draw = () => {
        var svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        
        var margin = {top: 5, right: 5, bottom: 5, left: 5};
        var width_plot = width - margin.left - margin.right;
        var height_plot = height - margin.top - margin.bottom;

        

        var frequencies = words.map(function(word) { return +word.frequency; });
        var freq_extent = d3.extent(frequencies)
        var classes = words.map(function(word){ return +word.class;});
        var class_colorscale = d3.scaleOrdinal([  "#7CFC00", "red"]).domain([0, 1]);
        var circles, labels;
        var circleSize = {min:width_plot*0.04, max:width_plot*0.08};

        var circleRadiusScale = d3.scaleSqrt()
            .domain(freq_extent)
            .range([circleSize.min, circleSize.max]);
        
        var forces,
            forceSimulation;


        // createSVG();

        svg.append("svg")
                .attr("width", width_plot + margin.left + margin.right)
                .attr("height", height_plot + margin.top + margin.bottom)
        
        
        createCircles();
        createForces();
        createForceSimulation();
        addGroupingListeners();

        

        function createCircles() {
            
            var formatWord = d3.format(",");

           

            const elements = svg.selectAll(".circle")
                .data(words)
                .enter()


              

            function highlight() {
              d3.select(this).select("circle").transition()
                .duration(50)
                .attr("fill", "black");
              }
              
            circles = elements.append("circle")
                .attr("r", function(d) { return circleRadiusScale(d.frequency); })
                .on("mouseover", function(e, d) {
                    updateWordInfo(d);
                    d3.select(e.currentTarget).transition()
                      .duration(50)
                      .attr("r", function(d) { return 1.2*circleRadiusScale(d.frequency); })
                    

                })
                .on("mouseout", function(e, d) {
                    updateWordInfo();
                    d3.select(e.currentTarget).transition()
                      .duration(50)
                      .attr("r", function(d) { return circleRadiusScale(d.frequency); })
                });

            labels = elements.append('text')
                .attr('dy', '.3em')
                .style('text-anchor', 'middle')
                .style('font-size', function(d) { 
                    var rad = circleRadiusScale(d.frequency);
                    if (rad>10) {return rad*0.4} else return 0;
                })
                .text(d => d.word)



            var g_legend_b = svg.append('g')
              .attr("id", "legend-b")
              .attr('transform', "translate("+ (width_plot-margin.right+80) +","+ (height_plot-margin.bottom-20)+ ")")
    
            g_legend_b.append("circle")
              .attr("cx", -width_plot*0.4)
              .attr("cy", -10)
              .attr("r", "0.4em")
              .attr("fill", "red");

            g_legend_b.append("circle")
              .attr("cx", -width_plot*0.8)
              .attr("cy", -10)
              .attr("r", "0.4em")
              .attr("fill", "#7CFC00");
    
            g_legend_b.append("text")
              .attr("x", -width_plot*0.4)
              .attr("y", 25)
              .style("fill", "white")
              .text("Toxic")
              .style("text-anchor", "middle")
              .attr("alignment-baseline","middle")
              .style("font-size", "30%");
    
            g_legend_b.append("text")
            .attr("x", -width_plot*0.8)
            .attr("y", 25)
            .style("fill", "white")
            .text("Not Toxic")
            .style("text-anchor", "middle")
            .attr("alignment-baseline","middle")
            .style("font-size", "30%");


            updateCircles();
        
            function updateWordInfo(word) {
                var info = "";
                if (word) {
                    info = [word.word, formatWord(word.frequency)].join(": ");
                    // info="Hi";
                }
                d3.select("#word-info").html(info);
            }
        }

        function updateCircles(mode) {

            if (mode=="split") {
                circles.attr("fill", function(d) {
                    return class_colorscale(d.class);
              });
            }

            else {
                circles.attr("fill", function(d) {
                    return "yellow";
              });
            }
            
          }


        function createForces() {
            var forceStrength = 0.05;
        
            forces = {
              combine: createCombineForces(),
              class: createClassForces(),
              
            };
        
            function createCombineForces() {
              return {
                x: d3.forceX(combForceX).strength(forceStrength),
                y: d3.forceY(height_plot*0.5).strength(forceStrength)
              };

              function combForceX(d) {
                  if (d.class===0) {
                    return width_plot*0.65
                  } else {
                    return width_plot*0.35
                  }
              }
            }
        
            
        
            function createClassForces() {
              return {
                x: d3.forceX(classForceX).strength(forceStrength),
                y: d3.forceY(classForceY).strength(forceStrength)
              };
        
              function classForceX(d) {
                if (d.class === 0) {
                  return left(width_plot);
                } else  {
                  return right(width_plot);
                } 
              }
        
              function classForceY(d) {
                if (d.class === 0) {
                  return top(height_plot);
                } else  {
                  return top(height_plot);
                } 
              }
        
              function left(dimension) { return dimension / 4; }
              function center(dimension) { return dimension / 2; }
              function right(dimension) { return dimension / 4 * 3; }
              function top(dimension) { return dimension / 2; }
              function bottom(dimension) { return dimension / 4 * 3; }
            }
        
            
        
          }

          function createForceSimulation() {
            forceSimulation = d3.forceSimulation()
              .force("x", forces.combine.x)
              .force("y", forces.combine.y)
              .force("collide", d3.forceCollide(forceCollide));

            forceSimulation.nodes(words)
              .on("tick", function() {
                circles
                  .attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });

                labels
                    .attr("x", function(d) { return d.x; })
                    .attr("y", function(d) { return d.y; });
              });
          }
          
          function forceCollide(d) {
            return circleRadiusScale(d.frequency) + 1;
          }


          function addGroupingListeners() {
            addListener("#combine", forces.combine);
            addListener("#split", forces.class);
    
        
            function addListener(selector, forces) {
              d3.select(selector).on("click", function() {
                  if (selector=="#split") {updateCircles("split")}
                  else {updateCircles()}
                
                updateForces(forces);
                
              });
            }
        
            function updateForces(forces) {
              forceSimulation
                .force("x", forces.x)
                .force("y", forces.y)
                .force("collide", d3.forceCollide(forceCollide))
                .alphaTarget(0.5)
                .restart();
            }
        }
        
    }


    return (
        <div className="chart" style={{width: width}}>
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default Bubblechart;