function drawD3Chart(){
    	console.log('trying');
}
    
function renderD3Chart(data) {
    var myuserid = 25609564;
    
    		
    
    try {
        var mytitle = "Total water consumption (past 30 days)";
        var data=[{x:0,y:56},{x:1,y:102},{x:2,y:59},{x:3,y:128},{x:4,y:59},{x:5,y:124},{x:6,y:28}];   
   		var adata=[{x:0,y:63},{x:1,y:84},{x:2,y:73},{x:3,y:102},{x:4,y:91},{x:5,y:45},{x:6,y:82}]; 
    
        
        renderD3ChartInner(data,adata,mytitle);
    }
    catch (e) {
        var mytitle = "Water consumption by category";
        var data=[{x:'Drinking',y:35, ay:25},{x:'Toilet',y:41, ay:53},{x:'Shower',y:54, ay:51},{x:'Laundry',y:121, ay:56}];
		
        
        renderD3BarChart(data);
        
        console.log(e);
    } 
}
function renderD3BarChart(data, adata,mytitle){
    
}

function renderD3ChartInner(data, adata,mytitle){

    var data2 = $.merge([],data);

    
var mx = d3.max(data, function(d) {
	return d.x;
});
    
data.splice(0,0,{x:0,y:0});
data.push({x:mx,y:0});
    
    console.log(data);
    
var color = d3.scale.category10();
    
var m = [5, 5, 5, 5],
    w = 275 - m[1] - m[3],
    h = 200 - m[0] - m[2];

var x,
    y,
    duration = 1500,
    delay = 500, myclass="test";
	
	var color = d3.scale.category10();
	
    
    
    var chart = d3.select(".d3chart").append("div").attr("id", myclass).attr("class", "container");
    
    chart.append("div")
    .attr("id",myclass)
    .attr("class","charttitle")
    .text(mytitle);
    
    
        
        var vis = chart.append("svg:svg")
        .attr("width", w)
        .attr("height", h);
    
    			var	margin = 5, my = d3.max(data, function(d) {
					return d.y;
				}),
				y = d3.scale.linear().domain([0, my]).range([0 + margin, h * .75]),
				x = d3.scale.linear().domain([0, mx]).range([0 + margin, w - margin]),
				myclass = "My class";
				
			var g = vis.append("svg:g")
			    .attr("transform", "translate(0, "+h+")");
			
			var line = d3.svg.line()
                .x(function(d,i) { 
                    return x(d.x); 
                })
			    .y(function(d,i) { 
                    return -1 * y(d.y); 
                });
			
			g.append("svg:path").attr("d", line(data)).attr("class", "fill")
                .style("fill","rgba(0,130,180,.5)")
                .style("stroke","none");
    		g.append("svg:path").attr("d", line(data2)).attr("class", "building").style("fill","none");
    		
    		var ag = vis.append("svg:g")
			    .attr("transform", "translate(0, "+h+")");
    
			ag.append("svg:path").attr("d", line(adata)).attr("class", "average");
			
    
        var layers = vis.selectAll("g.layer")
            .data(data2)
            .enter().append("g")
            .style("fill", function(d, i) { return "rgba(0,180,255,.8)" })
            .attr("transform", function(d, i) { return "translate(" + x(i) + "," + (h - y(d.y)) + ")"; })
            .attr("class", "layer")
            .style('opacity',0)
            .each(function(d, i) { this._current = d; this._i = i; this._caption = d ? d.y + ' gallons ' + (mx - d.x) + ' days ago' : ""})
            .on("click", function(e) {
                vis.selectAll("g.layer").style("opacity", "0");
                var mynode = d3.select(this);
                mynode.style('opacity',1);
                /*tooltip
                    .html(this._caption)
                    .style("color","white")
                    .style("opacity", "0")
                    .style("visibility", "visible")
                    .transition()
                    .duration(750)
                    .style("opacity", "1");*/
                
                	bottominfo.text(this._caption);
                
                if (typeof d3infotimeout == 'number') {
                    clearTimeout(d3infotimeout);
                }
                
                d3infotimeout = setTimeout(function(){
                    mynode.transition().duration(750).style('opacity',0);
                    //tooltip.transition().duration(750).style('opacity',0);
                    bottominfo.text('');
                },3000);
            })
            
    
        layers.append("circle")
            .attr("r", 8)
            .attr("x", 0)
            .attr("y", 0)
            
        
        layers.append("circle")
            .attr("r", 12)
            .attr("x", 0)
            .attr("y", 0)
            .style("opacity",0);
                
        /*vis.on("click", function() {
        	tooltip.style("visibility", "hidden");
            vis.selectAll("g.layer").style("visibility", "hidden");
    	});*/
    
    /*
			vis.append("svg:line")
			    .attr("x1", x(0))
			    .attr("y1", -1 * y(0))
			    .attr("x2", x(w))
			    .attr("y2", -1 * y(0))
			
			vis.append("svg:line")
			    .attr("x1", x(0))
			    .attr("y1", -1 * y(0))
			    .attr("x2", x(0))
			    .attr("y2", -1 * y(my))
				*/
		bottominfo = chart.append("div")
            .attr("id",'bottominfo')
            .attr("class","bottominfo")
            .text("Info appears here");
}
