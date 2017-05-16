var w = 900;
var h = 600;
var p = 68;

 
svg();       

d3.csv("arch/clean-zero.csv", mid, function(dataSet){
   bind(dataSet);
   btnList(dataSet);
   render(dataSet);

});

function mid(d){
    d.ExitValue = +d.ExitValue;
    d.Funding = +d.Funding;
    return d;
}



function svg(){
   d3.select("body").append("svg").attr({
        width: w,
        height: h,
   });
    d3.select("svg").append("g").append("rect").attr({
        width: "100%",
        height: "100%",
        fill: "white"
    });
    d3.select("svg").append("g").attr("id","axisX");
    d3.select("svg").append("g").attr("id","axisY");
};


function bind(dataSet){
    var selection = d3.select("svg")
                    .selectAll("circle")
                    .data(dataSet);
    selection.enter().append("circle");
    selection.exit().remove();

}         

function round(num, pos)
            {
              return (Math.round( num * Math.pow(10,pos) ) 
                      / 
                      Math.pow(10,pos)).toFixed(pos);
            }



function render(dataSet){

   var xScale = d3.time.scale()
            .domain([
                new Date("2005-06-01"),
                new Date("2017-01-01")
            ])

            .range([p,w-p]);
    var maxDomain = d3.max(dataSet,function(d){return d.Funding});
    var minDomain = d3.min(dataSet,function(d){return d.Funding});
    var yScale = d3.scale.linear()
            .domain([1, 
//                     100000,
//                     10000000,
//                     10000000*9,
                     maxDomain
                    ])
            .range([h-p,
//                    (h-p)*0.95,
//                    (h-p)*0.7,
//                    (h-p)*0.1,
                    p
                   ]);
   var rScale = d3.scale.linear()
            .domain([d3.min(dataSet, function(d){
                return d.Funding;
            }),d3.max(dataSet, function(d){

                return d.Funding;
            })]
                   )
            .range([5,10]);

   var fScale = d3.scale.category20b();

    d3.selectAll("circle")
      .attr({
        cx: function(d){
            return xScale(new Date(d.CohortDate));
        },
        cy: function(d){
            return yScale(d.Funding);
        },
        r: function(d){
            return 4;
        },
        fill: function(d){
            if(d.State === "Dead"){
                return "#d90000";
            }
            else if(d.State === "Exited"){
               return "#00b415";
               }
            else if(d.State === "Alive"){
                return "#00b3e8";
            }
            else{
            }
//                     

        }
      })
        .on("mouseover",function(d){
           var posX = d3.select(this).attr("cx") 
           var posY = d3.select(this).attr("cy")
           var tooltip = d3.select("#tooltip")
                           .style({
                               "left":(+posX+20)+"px", 
                               "top":(+posY+20)+"px", 
                           });
            d3.select(this).attr({"r":"5","stroke":"#00b415","stroke-width":"0"})
                            .transition().duration(200).ease("elastic")
                            .attr({"r":"13","stroke":"#053134","stroke-width":"1.5"})
           tooltip.select("#city").text(d.Name); 
           tooltip.select("#industry")
               .text("$"+round(d.Funding/1000000,2)+" million");
           tooltip.select("#categorie").text((d.Categorie));
           tooltip.select("#link")
               .text(d.link
                     .replace("http://", "")
                     .replace("www.", "")
                     .replace("/", "")
                     .replace("https://", "")
                     .replace("https:/", "")
                    );
           tooltip.classed("hidden",false); 


   })
    .on("mouseout",function(d){
            d3.select("#tooltip").classed("hidden",true);
            d3.select(this).attr({"r":"15","stroke":"#053134","stroke-width":"1"})
                                 .transition().duration(100)
                            .attr({"r":"5","stroke":"#053134","stroke-width":"0"})

   })
    .on("click",function(d){
         window.open(d.link);
        });

    var xAxis = d3.svg.axis().scale(xScale)
                .orient("bottom")
                .ticks(20);
    var yAxisScale = d3.scale.linear()
//              .domain([1, 
//                     100000,
//                     10000000,
//                     10000000*9,
//                     maxDomain
//                    ])
//               .range([h-p,
//                    (h-p)*0.95,
//                    (h-p)*0.7,
//                    (h-p)*0.1,
//                    p
//                   ]);
            .domain([1, 
                     maxDomain
                    ])
            .range([h-p,
                    p
                   ]);
    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10)
                .tickFormat(function(d){
                    return d/1000000+"M"; 
                });
    d3.select("svg")
        .select("g#axisY")
        .attr("class","axis")
        .attr("transform", "translate("+(p-10)+",0)")
        .call(yAxis);
    d3.select("svg")
        .select("g#axisX")
        .attr("class","axis")
        .attr("transform", "translate(0,"+(h-p+10)+")")
        .call(xAxis);

}




function renderExited(dataSet){

   var xScale = d3.time.scale()
            .domain([
                new Date("2005-06-01"),
                new Date("2017-01-01")
            ])
//                
            .range([p,w-p]);
   var yScale = d3.scale.linear()
            .domain([0, d3.max(dataSet, function(d){
                return d.Funding;
            })])
            .range([h-p,p]);

   var rScale = d3.scale.linear()
            .domain([d3.min(dataSet, function(d){

                return d.ExitValue;

            }),d3.max(dataSet, function(d){

                return d.ExitValue;

            })]
                   )
            .range([5,10]);
    var fScale = d3.scale.category20b();
    d3.selectAll("circle")
      .attr({
        cx: function(d){
            return xScale(new Date(d.CohortDate));
        },
        cy: function(d){
            return yScale(d.Funding);
        },
        r: function(d){
            return 4;
        },
        fill: function(d){
            return "#00b415";
        }
      })
        .on("mouseover",function(d){
           var posX = d3.select(this).attr("cx") 
           var posY = d3.select(this).attr("cy")
           var tooltip = d3.select("#tooltip")
                           .style({
                               "left":(+posX+20)+"px", 
                               "top":(+posY+20)+"px", 
                           });

            d3.selectAll("circle")
                .attr({
                cx: function(d){
                        return xScale(new Date(d.CohortDate));
                        },
                cy: function(d){
                            return yScale(d.Funding);

                        },
                r: function(d){
                        return rScale(d.ExitValue*5);
                        },
                fill: function(d){
                    return "#00b129";
                        }
            })

           tooltip.select("#city").text(d.Name); 
           tooltip.select("#industry")
               .text("Exit: "+round(d.ExitValue/1000000, 0) + 
                      " / " + 
                      round(d.Funding/1000000, 1)
                      + " million"
                     );
           tooltip.select("#categorie").text((d.Categorie));
           tooltip.classed("hidden",false);    
   })
    .on("mouseout",function(d){
            d3.select("#tooltip").classed("hidden",true);
            d3.select(this).attr({"r":"5","stroke":"#053134","stroke-width":"0"})       


            // renderExit
    var xAxis = d3.svg.axis().scale(xScale)
                .orient("bottom")
                .ticks(20);
    var yAxis = d3.svg.axis().scale(yScale)
                .orient("left")
                .ticks(5)

                .tickFormat(function(d){
                    return d/1000000+"M";
                });
    d3.select("svg")
        .select("g#axisY")
        .attr("class","axis")
        .attr("transform", "translate("+(p-10)+",0)")
        .call(yAxis);
    d3.select("svg")
        .select("g#axisX")
        .attr("class","axis")
        .attr("transform", "translate(0,"+(h-p+10)+")")
        .call(xAxis);



    d3.selectAll("circle")
      .attr({
        cx: function(d){
            return xScale(new Date(d.CohortDate));
        },
        cy: function(d){
            return yScale(d.Funding);
//                    return yScale(d.CateNum);
//                    console.log(d.Categorie);
        },
        r: function(d){
//                    return rScale(d.Funding);
            return 4;
        },
        fill: function(d){
//                    return fScale(d.CateNum);
            return "#0cc304";
        }
      })


        })


}


function btnList(dataSet){

    d3.select("body").append("div").append("input").attr({
            "type": "button",
            "value": "All",
            "class":"btn btn-default",
            "style":" position:absolute;left:630px;top:10px;"
        })
            .on("click",function(d){ updateAll(d);});

      function updateAll(){
        bind(dataSet);
        render(dataSet);
    }


     d3.select("body").append("div").append("input").attr({
            "type": "button",
            "value": "Dead",
            "class":"btn btn-danger",
            "style":" position:absolute;left:669px;top:10px;"
        })
            .on("click",function(d){ updateD(d);});

      function updateD(){

        var newDataSet = dataSet.filter(function(d){
            return d.State === "Dead";
        });
        bind(newDataSet);
        render(newDataSet);
    }


    d3.select("body").append("span").append("input").attr({
            "type": "button","value": "Exited",
        "class":"btn btn-success",
        "style":" position:absolute;left:724px;top:10px;"
        })
            .on("click",function(d){updateE(d);});

    function updateE(){

        var newDataSet = dataSet.filter(function(d){
            return d.State === "Exited"; 
        });

        bind(newDataSet);
        renderExited(newDataSet);
    }

    d3.select("body").append("span").append("input").attr({
            "type": "button","value": "Alive",
        "class":"btn btn-info",
        "style":" position:absolute;left:782px;top:10px;"
        })
            .on("click",function(d){updateA(d);});

    function updateA(){

        var newDataSet = dataSet.filter(function(d){
            return d.State === "Alive"; 
        });

        bind(newDataSet);
        render(newDataSet);
    }


          
    var industryArr = dataSet.map(function(d){
       return d.Categorie;
    });  

    var uniqueIndustryArr = unique(industryArr);

 
    var selection = d3.select("body")
        .append("div")
        .selectAll("input")
        .data(uniqueIndustryArr);

    selection.enter()
        .append("input")
        .attr({
            "type" : "button",
            "value": function(d){
                return d; 
            },
        "class":"btn btn-default"
        })
        .on("click",function(d){
          
        update(d); 

        });


    function update(industryName){
       
        var newDataSet = dataSet.filter(function(d){
            return d.Categorie === industryName; 
        });

        bind(newDataSet);
        render(newDataSet);
    }


    function unique(array){
      var n = []; 
      for(var i = 0; i < array.length; i++){
        if (n.indexOf(array[i]) == -1){
            n.push(array[i]);
        }
      }
      return n;
    };


    
// NASDAQ
// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse;
//var parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
var xTime = d3.time.scale().range([p,w-p]);
var yLinear = d3.scale.linear().range([h-p, p]);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return xTime(d.date); })
    .y(function(d) { return yLinear(d.close); });

// Get the data
d3.csv("arch/nasData.csv", function(error, nasData) {
    nasData.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    xTime.domain(d3.extent(nasData, function(d) { return d.date; }));
    yLinear.domain([0, d3.max(nasData, function(d) { return d.close; })]);

    // Add the valueline path.
    d3.select("body")
        .select("svg")
        .append("path")
        .attr("class", "line")
        .attr("d", valueline(nasData))
////        .on("mouseover",function(d){
////           var posX = d3.select(this).attr("cx") 
////           var posY = d3.select(this).attr("cy")
////           var tooltip = d3.select("#tooltip")
////                           .style({
////                               "left":(+posX+20)+"px", 
////                               "top":(+posY+20)+"px", 
////                           });
//        
////           d3.select(this).attr({"r":"13","stroke":"#053134","stroke-width":"1.5"})
//           d3.select("#tooltip2")
//               .select("#close")
//               .text(d.close); 
//           d3.select("#tooltip2").classed("hidden",false); 
    });
}
// END OF NASDAQ
    
    
    
    
    
    
    
