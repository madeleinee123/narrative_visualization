let data2021 = [];
let data2019 = [];
let y = new d3.scaleLinear();
let x_time_2019 = d3.scaleTime()
    .domain([new Date("2019-01-01"), new Date("2019-12-31")])
    .range([65, 910])
let x_time_2020 = d3.scaleTime()
    .domain([new Date("2020-01-01"), new Date("2020-12-31")])
    .range([65, 910])
let x_time_2021 = d3.scaleTime()
    .domain([new Date("2021-01-01"), new Date("2021-12-31")])
    .range([65, 910])
let parseTime = d3.timeParse("%m/%d/%Y");
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// the person!
const person = `<svg width=100 height=300 style='overflow: visible; margin: 5px;'>
<path d='M 25,50
    a 25,25 0 1,1 50,0 25,25 0 1,1 -50,0
    M 50,85
    L 72,85
    Q 82,85 82,95
    L 82,160
    a 5,5 0 1,1 -10,0
    L 72,115
    L 72,220
    a 10,10 0 1,1 -20,0
    L 52,160
    a 2,2 0 1,0 -4,0
    L 48,220
    a 10,10 0 1,1 -20,0
    L 28,115
    L 28,160
    a 5,5 0 1,1 -10,0
    L 18,95
    Q 18,85 28,85
    z'
    fill='none' stroke='#574B60' stroke-width=2 transform='translate(50,0)' />
</svg>`

async function init() {
    data2021 = await d3.csv("mentalHealthData.csv");
    data2021 = data2021.filter(data => (data.Group == "By Age" || data.Group == "By Sex" || data.Group == "By Race/Hispanic ethnicity" || data.Group == "National Estimate") && data.Phase != "-1");
    data2021.forEach(function(d) {
        d.Value = +d.Value;
        d["Time Period End Date"] = parseTime(d["Time Period End Date"]);
    })

    data2019 = await d3.csv("2019data.csv");
    data2019.forEach(function(d) {
        d.Month = parseTime(d.Month);
        d.Anxiety = +d.Anxiety;
        d.Depression = +d.Depression;
        d.Both = +d.Both;
       });

    y = d3.scaleLinear()
       .domain([0, d3.max(data2021, function(d) { 
           return d.Value; })])
       .range([ 400, 0 ]);

    displayScene1();
}

$('#scenes').on('slide.bs.carousel', function(e) {
    if(e.relatedTarget.id == 'scene1'){
        displayScene1();
    } else if(e.relatedTarget.id == 'scene2'){
        displayScene2();
    } else if(e.relatedTarget.id == 'scene3'){
        displayScene3();
    }
})

function displayScene1() {
    // Hides previous button and shows next button
    document.querySelector(".carousel-control-prev").classList.add("disabled-link");
    document.querySelector(".carousel-control-prev-icon").classList.add("disabled-link");
    if (document.querySelector(".carousel-control-next").classList.contains("disabled-link")){
        document.querySelector(".carousel-control-next").classList.remove("disabled-link");
        document.querySelector(".carousel-control-next-icon").classList.remove("disabled-link");
    }
    let svg = d3.select("#scene1Chart");
    // adds x_axis
    svg.append("g")
        .attr("transform", "translate(0, 400)")
        .call(d3.axisBottom(x_time_2019));

    // adds y_axis
    svg.append("g")
        .attr("transform", "translate(65, 0)")
        .call(d3.axisLeft(y));
    // label for y_axis
    svg.append("text") 
        .attr("transform", "rotate(-90)")            
        .attr("y", 0)
        .attr("x", -200)
        .style("text-anchor", "middle")
        .text("Estimated Percentage (%)");

    // important dates in the timeline
    // first confirmed covid case in us
    svg.append("line")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-01-21")))
        .attr("y1", 0)
        .attr("x2", x_time_2020(new Date("2020-01-21")))
        .attr("y2", 400);			
    
    // trump declares covid a national emergency 
    svg.append("line")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-03-13")))
        .attr("y1", 0)
        .attr("x2", x_time_2020(new Date("2020-03-13")))
        .attr("y2", 400);

    // all states are under a stay at home order
    svg.append("line")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-04-26")))
        .attr("y1", 0)
        .attr("x2", x_time_2020(new Date("2020-04-26")))
        .attr("y2", 400);

    // survey begins
    svg.append("line")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-05-05")))
        .attr("y1", 0)
        .attr("x2", x_time_2020(new Date("2020-05-05")))
        .attr("y2", 400);

    const annotations = [
        {
            note: {
                label: "First confirmed COVID-19 case in US",
                title: "Jan. 21st 2020",
                wrap: 100,
            },
            color: "#3F334D",
            x: x_time_2020(new Date("2020-01-21")),
            y: 400,
            dy: 50,
            dx: -20
        },
        {
            note: {
                label: "Trump declares COVID-19 a national emergency",
                title: "Mar. 13th 2020",
                wrap: 100
            },
            color: "#3F334D",
            x: x_time_2020(new Date("2020-03-13")),
            y: 400,
            dy: 50,
            dx: -20
        },
        {
            note: {
                label: "All states have issued a stay at home order",
                title: "Apr. 26th 2020",
                wrap: 100
            },
            color: "#3F334D",
            x: x_time_2020(new Date("2020-04-26")),
            y: 400,
            dy: 50,
            dx: -20
        },
        {
            note: {
                label: "CDC Household Pulse Survey begins",
                title: "May 5th 2020",
                wrap: 100
            },
            color: "#3F334D",
            x: x_time_2020(new Date("2020-05-05")),
            y: 400,
            dy: 50,
            dx: 20
        }
    ]

    svg.append("g")
        .style("font-size", "9pt")
        .call(d3.annotation()
            .annotations(annotations));

    // line for anxiety percentages in 2019
    line(svg, data2019, "Month", "Anxiety", "#7D8491", ("0, 0"), x_time_2019, y);
    // line for depression percentages in 2019
    line(svg, data2019, "Month", "Depression", "#EAF0CE", ("0, 0"), x_time_2019, y);
    // line for anxiety & depression percentages in 2019
    line(svg, data2019, "Month", "Both", "#574B60", ("0, 0"), x_time_2019, y);

    // legend
    let legend = ["Symptoms of Anxiety in 2019", "Symptoms of Depression in 2019", "Symptoms of Depression and Anxiety in 2019"]


    // only want the value for the group National Estimate
    let data = data2021.filter(d => d.Group == "National Estimate");
    let depression2020 = data.filter(d => d.Indicator == "Symptoms of Depressive Disorder" && d["Time Period End Date"] < new Date("2021-01-01"));
    let depression2021 = data.filter(d => d.Indicator == "Symptoms of Depressive Disorder" && d["Time Period End Date"] >= new Date("2021-01-01"));
    let anxiety2020 = data.filter(d => d.Indicator == "Symptoms of Anxiety Disorder" && d["Time Period End Date"] < new Date("2021-01-01"));
    let both2020 = data.filter(d => d.Indicator == "Symptoms of Anxiety Disorder or Depressive Disorder" && d["Time Period End Date"] < new Date("2021-01-01"));
    line(svg, depression2020, "Time Period End Date", "Value", "#EAF0CE", ("3, 3"), x_time_2020, y)
    line(svg, anxiety2020, "Time Period End Date", "Value", "#7D8491", ("3, 3"), x_time_2020, y)
    line(svg, both2020, "Time Period End Date", "Value", "#574B60", ("3, 3"), x_time_2020, y)

}

function displayScene2() {
    console.log("scene2")
    if (document.querySelector(".carousel-control-prev").classList.contains("disabled-link")){
        document.querySelector(".carousel-control-prev").classList.remove("disabled-link");
        document.querySelector(".carousel-control-prev-icon").classList.remove("disabled-link");
    }
    if (document.querySelector(".carousel-control-next").classList.contains("disabled-link")){
        document.querySelector(".carousel-control-next").classList.remove("disabled-link");
        document.querySelector(".carousel-control-next-icon").classList.remove("disabled-link");
    }
}

function displayScene3() {
    console.log("scene3")
    document.querySelector(".carousel-control-next").classList.add("disabled-link");
    document.querySelector(".carousel-control-next-icon").classList.add("disabled-link");
    if (document.querySelector(".carousel-control-prev").classList.contains("disabled-link")){
        document.querySelector(".carousel-control-prev").classList.remove("disabled-link");
        document.querySelector(".carousel-control-prev-icon").classList.remove("disabled-link");
    }
}

function line(svg, data, x_key, y_key, color, style, scale_x, scale_y){
    // div for the tool-tip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // this is the line connecting the data points
    svg.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke", color)
        .style("stroke-dasharray", style)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return scale_x(d[`${x_key}`]); })
            .y(function(d) { return scale_y(d[`${y_key}`]); }));

    // these are the data points with a tool tip 
    svg.selectAll("dot")	
        .data(data)			
        .enter().append("circle")								
            .attr("r", 5)		
            .attr("cx", function(d) { 
                return scale_x(d[`${x_key}`]); })		 
            .attr("cy", function(d) { return scale_y(d[`${y_key}`]); })
            .attr("fill", color)		
            .on("mouseover", function(d) {		
                div.transition()		
                    .duration(200)	
                    .style("opacity", .9);			
                div	.html(months[(d[`${x_key}`].getUTCMonth())] + ". " + d[`${x_key}`].getUTCDate() + "<br/>"  + "Percent: "+ d[`${y_key}`])	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("background", color);	
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)
                    .style("opacity", 0);			
            });
}

