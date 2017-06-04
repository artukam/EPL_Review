//Base SVG values
let width = 1000
let height = 600


//Max values

let maxValues = {
	Games_Played: 38,
	Goals_Scored: 30,
	Assists: 20,
	Total_Shots: 200,
	Shots_Target: 90
}

let padding = {
	left:50,
	top:50,
	right:50,
	bottom:50
}

let tickValuesAll = {
	goalScored: [0, 5, 10, 15, 20, 25,30],
	assists: [0,5,10,15,20],
	gamesPlayed: [0, 5, 10, 15, 20, 25, 30, 35],
	totalShots: [0, 25, 50, 75, 100, 125, 150, 175,200],
	shotsTarget: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
}

d3.tsv("./data/epl_data_final_2017.tsv", function(data){

	//Scale and Max values
	let yMax = maxValues["Goals_Scored"];

	let yScale = d3.scaleLinear()
					.domain([0,yMax])
					.range([height-padding["bottom"],padding["bottom"]])
	let xMax = maxValues["Games_Played"];
	let xScale = d3.scaleLinear()
					.domain([0,xMax])
					.range([padding["left"],width-padding["left"]])
		//Tool tip
	var tooltip = d3.select("body")
						.append("div")
						.classed("tool-tip", true)
						.style("opacity",0)

	//Create transitions
	var transitionSlide = d3.transition()
    		  .duration(2000)
    		  .ease(d3.easeLinear);

	//Create all data for the graph and hide data
	d3.select("svg")
		.attr("width", width)
		.attr("height", height)
	  .selectAll("circle")
	  .data(data)
	  .enter()
	  .append("circle")
	  	.attr("cx", (d,i) => xScale(parseInt(d["Game Started"]) + parseInt(d["Sub Ins"])))
	  	.attr("cy",(d,i) => yScale(parseInt(d["Goals"])))
	  	.attr("r", 13)
	  	.attr("class", (d,i)=>`${d["Position"]} ${d["Year"]} ${d["Team"]} hide-label-year`)
	  	.on("mouseenter", function(d) {
	  		tooltip.html(`<p class="tool-tip-text"><strong>#${d["Number"]} ${d["Name"]}</strong></p>
	  					  <p class="tool-tip-text">Goals: ${d["Goals"]}</p>
	  					  <p class="tool-tip-text">Assists: ${d["Assists"]}</p>
	  					  <p class="tool-tip-text">Games played: ` + (parseInt(d["Game Started"]) + parseInt(d["Sub Ins"])) + `</p>`)
	  			   .style("opacity",1)
	  			   .style("left", d3.event.pageX + "px")
           		   .style("top", (d3.event.pageY-40) + "px");
  		})
  		.on("mouseout", () => tooltip.style("opacity", 0));

	//Range function
	d3.select("#year-range")
		.on("input",function(){
			console.log("Slider Works!")
		});

	//Axis
	var axisR = d3.axisLeft(yScale)
        .tickValues(tickValuesAll["goalsScored"])
    var axisT = d3.axisBottom(xScale)
    	.tickValues(tickValuesAll["gamesPlayed"])

	d3.select("svg")
	  .append("g")
	  	.attr("class","axis")
	  	.attr("class","axisLineLeft")
	  	.attr("transform",`translate(${padding.left},0)`)
	  .call(axisR)

	d3.select("svg")
	  .append("g")
	  	.attr("class","axis")
	  	.attr("class","axisLineBottom")
	  	.attr("transform",`translate(0,`+ (height-padding.bottom) + ")")
	  .call(axisT)
	
	//Axis labels

	d3.select("svg")
		.append("text")
			.attr("transform","rotate(-90)")
			.attr("y",62)
			.attr("x",-92)
			.attr("class","axis")
			.attr("class","axisTextLeft")
			.style("text-anchor", "middle")
			.style("fill", "#FF5531")
			.text("Goals scored")

	d3.select("svg")
		.append("text")
			.attr("y",height*0.915)
			.attr("x",width - 92)
			.attr("class","axis")
			.attr("class","axisTextBottom")
			.style("text-anchor", "middle")
			.style("fill", "#FF5531")
			.text("Games Played")

	//Toggle for statistics
	d3.select("#offense-toggle").on("input",function(){
		//Goals v Games Played
		if (d3.event.target["value"] === "goals-scored-metric") {
			//Reset scale
			yMax = maxValues["Goals_Scored"];
			yScale = d3.scaleLinear()
					.domain([0,yMax])
					.range([height-padding["bottom"],padding["bottom"]])
			xMax = maxValues["Games_Played"];
			xScale = d3.scaleLinear()
					.domain([0,xMax])
					.range([padding["left"],width-padding["left"]])
			//Set circles
			d3.selectAll("circle")
				.data(data)
				.transition(transitionSlide)
				.attr("cy",(d,i) => yScale(parseInt(d["Goals"])))
				.attr("cx",(d,i) => xScale(parseInt(d["Game Started"]) + parseInt(d["Sub Ins"])))
			//Reset Axis Labels
			d3.select(".axisTextLeft")
			  .transition(transitionSlide)
			  .text("Goals scored");
			d3.select(".axisTextBottom")
			  .transition(transitionSlide)
			  .text("Games Played");
			//Reset Axis Ticks
			axisR = d3.axisLeft(yScale)
        			  .tickValues(tickValuesAll["goalsScored"]);
        	axisT = d3.axisBottom(xScale)
    				  .tickValues(tickValuesAll["gamesPlayed"]);
			//Reset Axis
			d3.select(".axisLineLeft")
			  .transition(transitionSlide)
			  .call(axisR);
			d3.select(".axisLineBottom")
			  .transition(transitionSlide)
			  .call(axisT);
		//Assists v Games Played
		} else if (d3.event.target["value"] === "assists-metric"){
			//Reset Scale
			yMax = maxValues["Assists"];
			yScale = d3.scaleLinear()
					.domain([0,yMax])
					.range([height-padding["bottom"],padding["bottom"]])
			xMax = maxValues["Games_Played"];
			xScale = d3.scaleLinear()
					.domain([0,xMax])
					.range([padding["left"],width-padding["left"]])
			//Set circles
			d3.selectAll("circle")
				.data(data)
				.transition(transitionSlide)
				.attr("cy",(d,i) => yScale(parseInt(d["Assists"])))
				.attr("cx",(d,i) => xScale(parseInt(d["Game Started"]) + parseInt(d["Sub Ins"])))
			//Reset Axis labels
			d3.select(".axisTextLeft")
			  .transition(transitionSlide)
			  .text("Assists")
			d3.select(".axisTextBottom")
			  .transition(transitionSlide)
			  .text("Games Played")
			//Reset Axis Ticks
			axisR = d3.axisLeft(yScale)
        			  .tickValues(tickValuesAll["assists"]);
        	axisT = d3.axisBottom(xScale)
    				  .tickValues(tickValuesAll["gamesPlayed"]);
			//Reset Axis
			d3.select(".axisLineLeft")
			  .transition(transitionSlide)
			  .call(axisR);
			d3.select(".axisLineBottom")
			  .transition(transitionSlide)
			  .call(axisT);
		//Goals v Total Shots
		} else if (d3.event.target["value"] === "goals-shots-metric") {
			//Reset scale
			yMax = maxValues["Goals_Scored"];
			yScale = d3.scaleLinear()
					.domain([0,yMax])
					.range([height-padding["bottom"],padding["bottom"]])
			xMax = maxValues["Total_Shots"];
			xScale = d3.scaleLinear()
					.domain([0,xMax])
					.range([padding["left"],width-padding["left"]])
			//Set circles
			d3.selectAll("circle")
				.data(data)
				.transition(transitionSlide)
				.attr("cy",(d,i) => yScale(parseInt(d["Goals"])))
				.attr("cx",(d,i) => xScale(parseInt(d["Total Shots"])))
			//Reset Axis labels
			d3.select(".axisTextLeft")
			  .transition(transitionSlide)
			  .text("Goals scored")
			d3.select(".axisTextBottom")
			  .transition(transitionSlide)
			  .text("Total shots")
			//Reset Axis Ticks
			axisR = d3.axisLeft(yScale)
        			  .tickValues(tickValuesAll["goalsScored"]);
        	axisT = d3.axisBottom(xScale)
    				  .tickValues(tickValuesAll["totalShots"]);
			//Reset Axis
			d3.select(".axisLineLeft")
			  .transition(transitionSlide)
			  .call(axisR);
			d3.select(".axisLineBottom")
			  .transition(transitionSlide)
			  .call(axisT);
		//Goals v Shots on Target
		} else if (d3.event.target["value"] === "goals-target-metric"){
			yMax = maxValues["Goals_Scored"];
			yScale = d3.scaleLinear()
					.domain([0,yMax])
					.range([height-padding["bottom"],padding["bottom"]])
			xMax = maxValues["Shots_Target"];
			xScale = d3.scaleLinear()
					.domain([0,xMax])
					.range([padding["left"],width-padding["left"]])
			//Set circles
			d3.selectAll("circle")
				.data(data)
				.transition(transitionSlide)
				.attr("cy",(d,i) => yScale(parseInt(d["Goals"])))
				.attr("cx",(d,i) => xScale(parseInt(d["Shots on Target"])))
			//Reset Axis labels
			d3.select(".axisTextLeft")
			  .transition(transitionSlide)
			  .text("Goals scored")
			d3.select(".axisTextBottom")
			  .transition(transitionSlide)
			  .text("Shots on target")
			//Reset Axis Ticks
			axisR = d3.axisLeft(yScale)
        			  .tickValues(tickValuesAll["goalsScored"]);
        	axisT = d3.axisBottom(xScale)
    				  .tickValues(tickValuesAll["shotsTarget"]);
			//Reset Axis
			d3.select(".axisLineLeft")
			  .transition(transitionSlide)
			  .call(axisR);
			d3.select(".axisLineBottom")
			  .transition(transitionSlide)
			  .call(axisT);
		}
	});
	//Toggle players
	d3.selectAll(".btn-players").on("click",function(){
		if (d3.event.target.className === "btn btn-players btn-players-active") {
			d3.event.target.classList.add("btn-players-inactive");
			d3.event.target.classList.remove("btn-players-active");
			d3.selectAll("." + d3.event.target.innerText)
				.classed("hide-label",true)
		} else if (d3.event.target.className === "btn btn-players btn-players-inactive"){
			d3.event.target.classList.remove("btn-players-inactive");
			d3.event.target.classList.add("btn-players-active");
			d3.selectAll("." + d3.event.target.innerText)
				.classed("hide-label",false)

		}
	})

	//Toggle year
	d3.select("#metric-year").on("input",function(){
		d3.selectAll("circle")
			.classed("hide-label-year", true);
		d3.selectAll(".s" + d3.event.target.value)
			.classed("hide-label-year",false);
	})

	//Toggle by team
	//Toggle Chelsea
	d3.select(".btn-chelsea").on("click",function(){
		if (d3.event.target.className === "btn btn-block btn-chelsea btn-chelsea-active"){
			d3.event.target.classList.add("btn-chelsea-inactive");
			d3.event.target.classList.remove("btn-chelsea-active");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",true)
		} else if (d3.event.target.className === "btn btn-block btn-chelsea btn-chelsea-inactive"){
			d3.event.target.classList.add("btn-chelsea-active");
			d3.event.target.classList.remove("btn-chelsea-inactive");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",false)
		}
	});
	//Toggle Manchester United
	d3.select(".btn-man-u").on("click",function(){
		if (d3.event.target.className === "btn btn-block btn-man-u btn-man-u-active"){
			d3.event.target.classList.add("btn-man-u-inactive");
			d3.event.target.classList.remove("btn-man-u-active");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",true)
		} else if (d3.event.target.className === "btn btn-block btn-man-u btn-man-u-inactive"){
			d3.event.target.classList.add("btn-man-u-active");
			d3.event.target.classList.remove("btn-man-u-inactive");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",false)
		}
	});
	//Toggle Arsenal
	d3.select(".btn-arsenal").on("click",function(){
		if (d3.event.target.className === "btn btn-block btn-arsenal btn-arsenal-active"){
			d3.event.target.classList.add("btn-arsenal-inactive");
			d3.event.target.classList.remove("btn-arsenal-active");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",true)
		} else if (d3.event.target.className === "btn btn-block btn-arsenal btn-arsenal-inactive"){
			d3.event.target.classList.add("btn-arsenal-active");
			d3.event.target.classList.remove("btn-arsenal-inactive");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",false)
		}
	});
	//Toggle Liverpool
	d3.select(".btn-liverpool").on("click",function(){
		if (d3.event.target.className === "btn btn-block btn-liverpool btn-liverpool-active"){
			d3.event.target.classList.add("btn-liverpool-inactive");
			d3.event.target.classList.remove("btn-liverpool-active");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",true)
		} else if (d3.event.target.className === "btn btn-block btn-liverpool btn-liverpool-inactive"){
			d3.event.target.classList.add("btn-liverpool-active");
			d3.event.target.classList.remove("btn-liverpool-inactive");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",false)
		}
	});
	//Toggle Manchester City
	d3.select(".btn-man-city").on("click",function(){
		if (d3.event.target.className === "btn btn-block btn-man-city btn-man-city-active"){
			d3.event.target.classList.add("btn-man-city-inactive");
			d3.event.target.classList.remove("btn-man-city-active");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",true)
		} else if (d3.event.target.className === "btn btn-block btn-man-city btn-man-city-inactive"){
			d3.event.target.classList.add("btn-man-city-active");
			d3.event.target.classList.remove("btn-man-city-inactive");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",false)
		}
	});
		//Toggle Manchester City
	d3.select(".btn-tottenham").on("click",function(){
		if (d3.event.target.className === "btn btn-block btn-tottenham btn-tottenham-active"){
			d3.event.target.classList.add("btn-tottenham-inactive");
			d3.event.target.classList.remove("btn-tottenham-active");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",true)
		} else if (d3.event.target.className === "btn btn-block btn-tottenham btn-tottenham-inactive"){
			d3.event.target.classList.add("btn-tottenham-active");
			d3.event.target.classList.remove("btn-tottenham-inactive");
			d3.selectAll("." + d3.event.target.id)
				.classed("hide-label-team",false)
		}
	});


	//Set default view
	d3.selectAll(".s2016")
		.classed("hide-label",false)
		.classed("hide-label-year",false);
});