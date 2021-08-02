let data2021 = [];
let data2019 = [];

let curAttrData = [];

let y = new d3.scaleLinear();
let y_attr = new d3.scaleLinear();

let x_attr = new d3.scaleTime();
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
let isDisplayed2020 = false;
let isDisplayed2021 = false;


// the person!
const person ='M 25,50 a 25,25 0 1,1 50,0 25,25 0 1,1 -50,0 M 50,85 L 72,85 Q 82,85 82,95 L 82,160 a 5,5 0 1,1 -10,0 L 72,115 L 72,220 a 10,10 0 1,1 -20,0 L 52,160 a 2,2 0 1,0 -4,0 L 48,220 a 10,10 0 1,1 -20,0 L 28,115 L 28,160 a 5,5 0 1,1 -10,0 L 18,95 Q 18,85 28,85 z'


async function init() {
    data2021 = await d3.csv("mentalHealthData.csv");
    data2021 = data2021.filter(data => (data.Group == "By Age" || data.Group == "By Sex" || data.Group == "By Race/Hispanic ethnicity" || data.Group == "National Estimate") && data.Phase != "-1");
    data2021.forEach(function(d) {
        d.Value = +d.Value;
        d["Time Period End Date"] = parseTime(d["Time Period End Date"]);
        if(d.Group == "By Race/Hispanic ethnicity" && d.Subgroup != "Hispanic or Latino"){
            d.Subgroup = d.Subgroup.substr(13);
        }
        if (d.Subgroup == "other races and multiple races"){
            d.Subgroup = "other or multiple races"
        }
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

    y_attr = d3.scaleLinear()
       .domain([0, d3.max(data2021, function(d) { 
           return d.Value; })])
       .range([ 530,  300]);
    
    x_attr = d3.scaleTime()
        .domain(d3.extent(data2021, function(d) { return d["Time Period End Date"]; }))
        .range([ 70, 770 ])
}

$('#scenes').on('slide.bs.carousel', function(e) {
    if(e.relatedTarget.id == 'intro'){
        document.querySelector(".carousel-control-prev").classList.add("disabled-link");
        document.querySelector(".carousel-control-prev-icon").classList.add("disabled-link");
        if (document.querySelector(".carousel-control-next").classList.contains("disabled-link")){
            document.querySelector(".carousel-control-next").classList.remove("disabled-link");
            document.querySelector(".carousel-control-next-icon").classList.remove("disabled-link");
        }
    }
    if(e.relatedTarget.id == 'scene1'){
        displayScene1();
    } else if(e.relatedTarget.id == 'intermission'){
        if (document.querySelector(".carousel-control-prev").classList.contains("disabled-link")){
            document.querySelector(".carousel-control-prev").classList.remove("disabled-link");
            document.querySelector(".carousel-control-prev-icon").classList.remove("disabled-link");
        }
        if (document.querySelector(".carousel-control-next").classList.contains("disabled-link")){
            document.querySelector(".carousel-control-next").classList.remove("disabled-link");
            document.querySelector(".carousel-control-next-icon").classList.remove("disabled-link");
        }
    } else if(e.relatedTarget.id == 'scene2'){
        displayScene2();
    }
})

function displayScene1() {
    // Hides previous button and shows next button
    if (document.querySelector(".carousel-control-prev").classList.contains("disabled-link")){
        document.querySelector(".carousel-control-prev").classList.remove("disabled-link");
        document.querySelector(".carousel-control-prev-icon").classList.remove("disabled-link");
    }
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

    // line for anxiety percentages in 2019
    line(svg, data2019, "Month", "Anxiety", "#7D8491", ("0, 0"), x_time_2019, y, "_2019");
    // line for depression percentages in 2019
    line(svg, data2019, "Month", "Depression", "#EAF0CE", ("0, 0"), x_time_2019, y, "_2019");
    // line for anxiety & depression percentages in 2019
    line(svg, data2019, "Month", "Both", "#574B60", ("0, 0"), x_time_2019, y, "_2019");

    // legend
    legendAddition(svg, 400, 6, "#7D8491", ("0,0"), "_2019", "Symptoms of Anxiety in 2019")
    legendAddition(svg, 400, 26, "#EAF0CE", ("0,0"), "_2019", "Symptoms of Depression in 2019")
    legendAddition(svg, 400, 46, "#574B60", ("0,0"), "_2019", "Symptoms of Depression and Anxiety in 2019")

    // only want the value for the group National Estimate
    let data = data2021.filter(d => d.Group == "National Estimate");
    let depression2021 = data.filter(d => d.Indicator == "Symptoms of Depressive Disorder" && d["Time Period End Date"] >= new Date("2021-01-01"));

}

function displayScene2() {
    document.querySelector(".carousel-control-next").classList.add("disabled-link");
    document.querySelector(".carousel-control-next-icon").classList.add("disabled-link");
    if (document.querySelector(".carousel-control-prev").classList.contains("disabled-link")){
        document.querySelector(".carousel-control-prev").classList.remove("disabled-link");
        document.querySelector(".carousel-control-prev-icon").classList.remove("disabled-link");
    }
    let svg = d3.select("#scene2Chart")
    // adds x_axis
    svg.append("g")
        .attr("transform", "translate(0, 530)")
        .call(d3.axisBottom(x_attr));

    // adds y_axis
    svg.append("g")
        .attr("transform", "translate(70,0)")
        .call(d3.axisLeft(y_attr));
    // label for y_axis
    svg.append("text") 
        .attr("transform", "rotate(-90)")            
        .attr("y",40)
        .attr("x", -425)
        .style("font-size", "10pt")
        .style("text-anchor", "middle")
        .text("Estimated Percentage (%)");

    legendAddition(svg, 800, 490, "#7D8491", ("0,0"), "_2021", "Symptoms of Anxiety")
    legendAddition(svg, 800, 510, "#EAF0CE", ("0,0"), "_2021", "Symptoms of Depression")
    legendAddition(svg, 800, 530, "#574B60", ("0,0"), "_2021", "Symptoms of Depression and Anxiety")
}

function line(svg, data, x_key, y_key, color, style, scale_x, scale_y, year){
    // div for the tool-tip
    var div = d3.select("body").append("div")	
        .attr("class", `tooltip ${year}`)			
        .style("opacity", 0);

    // this is the line connecting the data points
    svg.append("path")
        .attr("class", year)
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
            .attr("class", year)								
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

function display2020Data(){
    let svg = d3.select("#scene1Chart");
    if (!isDisplayed2020){
        svg.selectAll("._2021").remove()
        isDisplayed2021= false

        let data = data2021.filter(d => d.Group == "National Estimate");
        let depression2020 = data.filter(d => d.Indicator == "Symptoms of Depressive Disorder" && d["Time Period End Date"] < new Date("2021-01-01"));
        let anxiety2020 = data.filter(d => d.Indicator == "Symptoms of Anxiety Disorder" && d["Time Period End Date"] < new Date("2021-01-01"));
        let both2020 = data.filter(d => d.Indicator == "Symptoms of Anxiety Disorder or Depressive Disorder" && d["Time Period End Date"] < new Date("2021-01-01"));

        line(svg, depression2020, "Time Period End Date", "Value", "#EAF0CE", ("3, 3"), x_time_2020, y, "_2020")
        line(svg, anxiety2020, "Time Period End Date", "Value", "#7D8491", ("3, 3"), x_time_2020, y, "_2020")
        line(svg, both2020, "Time Period End Date", "Value", "#574B60", ("3, 3"), x_time_2020, y, "_2020")

        legendAddition(svg, 750, 6, "#7D8491", ("3,3"), "_2020", "Symptoms of Anxiety in 2020")
        legendAddition(svg, 750, 26, "#EAF0CE", ("3,3"), "_2020", "Symptoms of Depression in 2020")
        legendAddition(svg, 750, 46, "#574B60", ("3,3"), "_2020", "Symptoms of Depression and Anxiety in 2020")

        add2020TimeStamps();
    }else{
        svg.selectAll("._2020").remove()
    }
    isDisplayed2020= !isDisplayed2020
}

function display2021Data(){
    let svg = d3.select("#scene1Chart");
    if (!isDisplayed2021){
        svg.selectAll("._2020").remove()
        isDisplayed2020= false
        
        let data = data2021.filter(d => d.Group == "National Estimate");
        let depression2021 = data.filter(d => d.Indicator == "Symptoms of Depressive Disorder" && d["Time Period End Date"] >= new Date("2021-01-01"));
        let anxiety2021 = data.filter(d => d.Indicator == "Symptoms of Anxiety Disorder" && d["Time Period End Date"] >= new Date("2021-01-01"));
        let both2021 = data.filter(d => d.Indicator == "Symptoms of Anxiety Disorder or Depressive Disorder" && d["Time Period End Date"] >= new Date("2021-01-01"));
        
        line(svg, depression2021, "Time Period End Date", "Value", "#EAF0CE", ("3, 3"), x_time_2021, y, "_2021")
        line(svg, anxiety2021, "Time Period End Date", "Value", "#7D8491", ("3, 3"), x_time_2021, y, "_2021")
        line(svg, both2021, "Time Period End Date", "Value", "#574B60", ("3, 3"), x_time_2021, y, "_2021")

        legendAddition(svg, 750, 6, "#7D8491", ("3,3"), "_2021", "Symptoms of Anxiety in 2021")
        legendAddition(svg, 750, 26, "#EAF0CE", ("3,3"), "_2021", "Symptoms of Depression in 2021")
        legendAddition(svg, 750, 46, "#574B60", ("3,3"), "_2021", "Symptoms of Depression and Anxiety in 2021")
    }else{
        svg.selectAll("._2021").remove()
    }
    isDisplayed2021= !isDisplayed2021
}

function add2020TimeStamps(){
    let svg = d3.select("#scene1Chart");
    // important dates in the timeline
    // first confirmed covid case in us
    svg.append("line")
        .attr("class", "_2020")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-01-21")))
        .attr("y1", 0)
        .attr("x2", x_time_2020(new Date("2020-01-21")))
        .attr("y2", 400);

    svg.append("line")
        .attr("class", "_2020")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-01-21")))
        .attr("y1", 400)
        .attr("x2", x_time_2020(new Date("2020-01-21")) -75)
        .attr("y2", 445);
    
    svg.append("text")            
        .attr("y",450)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-01-21"))-75)
        .style("font-size", "9pt")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Jan. 21st 2020");	
        
        
    svg.append("text")            
        .attr("y",462)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-01-21"))-75)
        .style("font-size", "9pt")
        .style("font-weight", "normal")
        .style("text-anchor", "middle")
        .text("First confirmed");

    svg.append("text")            
        .attr("y",474)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-01-21"))-75)
        .style("font-size", "9pt")
        .style("font-weight", "normal")
        .style("text-anchor", "middle")
        .text("COVID case in US");
    
    // trump declares covid a national emergency 
    svg.append("line")
        .attr("class", "_2020")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-03-13")))
        .attr("y1", 0)
        .attr("x2", x_time_2020(new Date("2020-03-13")))
        .attr("y2", 400);

    svg.append("line")
        .attr("class", "_2020")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-03-13")))
        .attr("y1", 400)
        .attr("x2", x_time_2020(new Date("2020-03-13")) -20)
        .attr("y2", 445);

    svg.append("text")            
        .attr("y",450)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-03-13"))-20)
        .style("font-size", "9pt")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Mar. 13th 2020");	
        
        
    svg.append("text")            
        .attr("y",462)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-03-13"))-20)
        .style("font-size", "9pt")
        .style("font-weight", "normal")
        .style("text-anchor", "middle")
        .text("Trump declares COVID");

    svg.append("text")            
        .attr("y",474)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-03-13"))-20)
        .style("font-size", "9pt")
        .style("font-weight", "normal")
        .style("text-anchor", "middle")
        .text("a national emergency");

    // all states are under a stay at home order
    svg.append("line")
        .attr("class", "_2020")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-04-26")))
        .attr("y1", 0)
        .attr("x2", x_time_2020(new Date("2020-04-26")))
        .attr("y2", 400);

    svg.append("line")
        .attr("class", "_2020")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-04-26")))
        .attr("y1", 400)
        .attr("x2", x_time_2020(new Date("2020-04-26")) + 5)
        .attr("y2", 445);

    svg.append("text")            
        .attr("y",450)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-04-26"))+ 5)
        .style("font-size", "9pt")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Apr. 26th 2020");	
        
        
    svg.append("text")            
        .attr("y",462)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-04-26"))+5)
        .style("font-size", "9pt")
        .style("font-weight", "normal")
        .style("text-anchor", "middle")
        .text("All states are under");

    svg.append("text")            
        .attr("y",474)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-04-26"))+5)
        .style("font-size", "9pt")
        .style("font-weight", "normal")
        .style("text-anchor", "middle")
        .text("a stay at home order");
    // survey begins
    svg.append("line")
        .attr("class", "_2020")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-05-05")))
        .attr("y1", 0)
        .attr("x2", x_time_2020(new Date("2020-05-05")))
        .attr("y2", 400);

    svg.append("line")
        .attr("class", "_2020")
        .style("stroke-dasharray", ("3,3"))
        .style("stroke", "#3F334D")
        .style("stroke-width", 1.5)
        .attr("x1", x_time_2020(new Date("2020-05-05")))
        .attr("y1", 400)
        .attr("x2", x_time_2020(new Date("2020-05-05")) + 110)
        .attr("y2", 445);

    svg.append("text")            
        .attr("y",450)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-05-05"))+ 110)
        .style("font-size", "9pt")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("May 5th 2020");	
        
        
    svg.append("text")            
        .attr("y",462)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-05-05"))+110)
        .style("font-size", "9pt")
        .style("font-weight", "normal")
        .style("text-anchor", "middle")
        .text("NCHS Household Pulse");

    svg.append("text")            
        .attr("y",474)
        .attr("class", "_2020")
        .attr("x", x_time_2020(new Date("2020-05-05"))+100)
        .style("font-size", "9pt")
        .style("font-weight", "normal")
        .style("text-anchor", "middle")
        .text("Survey begins");
}

function legendAddition(svg, x_val, y_val, color, style, year, text){
    svg.append("circle")
        .attr("class", year)
        .attr("cx",x_val)
        .attr("cy",y_val)
        .attr("r", 6)
        .style("fill", color)

    svg.append("path")
        .attr("class", year)
        .attr("fill","none")
        .attr("stroke", color)
        .style("stroke-dasharray", style)
        .attr("stroke-width", 1.5)
        .attr("d", `M ${x_val-20},${y_val} L ${x_val+20},${y_val}`);

    svg.append("text")
        .attr("class", year)
        .attr("x", x_val+30)
        .attr("y", y_val)
        .text(text)
        .style("font-size", "15px")
        .attr("alignment-baseline","middle")
}

function displayByAttribute(attribute){
    let svg = d3.select("#scene2Chart");
    $('.attribute').remove();
    $('.subGroup').remove();

    let data = data2021.filter(d => d.Group == attribute);
    let subGroups = Array.from(new Set(data.map(data => data.Subgroup)));
    
    let tag = document.createElement("p");
    let text = document.createTextNode("Choose a Subgroup to View");
    tag.classList.add("attribute")
    tag.style.cssText += 'margin-top:200px;';
    tag.appendChild(text);
    let element = document.getElementById("selection");
    let dataSets = {}
    element.appendChild(tag);
    subGroups.forEach( (group, i) => {
        let temp = data.filter(d => d.Subgroup == group);
        let depression = temp.filter(d => d.Indicator == "Symptoms of Depressive Disorder");
        let anxiety = temp.filter(d => d.Indicator == "Symptoms of Anxiety Disorder");
        let both = temp.filter(d => d.Indicator == "Symptoms of Anxiety Disorder or Depressive Disorder");
        dataSets[group] = {
            d: depression,
            a: anxiety,
            b: both
        };
        tag = document.createElement("div");
        tag.classList.add(`custom-control`);
        tag.classList.add(`custom-switch`);
        tag.classList.add(`attribute`);
        let input = document.createElement("input");
        input.classList.add(`custom-control-input`);
        input.classList.add("attribute");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "customAttributeRadio");
        input.setAttribute("id", `${i}`);
        input.setAttribute("onchange", `displayBySubgroup('${group}')`);
        tag.appendChild(input);
        let label = document.createElement("label");
        label.classList.add(`custom-control-label`);
        label.classList.add(`attribute`);
        label.setAttribute("for", `${i}`);
        text = document.createTextNode(`${group}`);
        label.appendChild(text);
        tag.appendChild(label);
        element.append(tag);
    })
    curAttrData = dataSets;

    displayPeople(attribute);
}

function displayBySubgroup(group){
    $('.subGroup').remove();
    let svg = d3.select("#scene2Chart");
    line(svg, curAttrData[`${group}`]["d"], "Time Period End Date", "Value", "#EAF0CE", ("0, 0"), x_attr, y_attr, "subGroup")
    line(svg, curAttrData[`${group}`]["a"], "Time Period End Date", "Value", "#7D8491", ("0, 0"), x_attr, y_attr, "subGroup")
    line(svg, curAttrData[`${group}`]["b"], "Time Period End Date", "Value", "#574B60", ("0, 0"), x_attr, y_attr, "subGroup")
}

function displayPeople(attribute){
    let svg = d3.select("#scene2Chart");
    let scale = 300/Object.keys(curAttrData).length/300;
    Object.keys(curAttrData).forEach((key, i) => {
        let percent = 0;
        curAttrData[`${key}`]["b"].forEach(row => {
            percent+=row.Value;
        });
        
        if (i % 2 != 0){
            svg.append('rect')
                .attr('x', 50)
                .attr('y', `${(i * 300 * scale)}`)
                .attr('width', 900)
                .attr("class", "attribute")
                .attr('height', scale*300)
                .attr('stroke', 'none')
                .attr('fill', '#a3c4a9');
        }
        percent = percent /curAttrData[`${key}`]["b"].length
        percent= Math.round(percent / 10)
        for(let j = 1; j < percent + 1; j++){
            svg.append("path")
                .attr("transform", `translate(${j * 70}, ${(i * 300 * scale) + (10*scale)}) scale(${scale})`)
                .attr("class", "attribute")
                .attr("fill","#574B60")
                .attr("stroke", "#574B60")
                .attr("stroke-width", 2)
                .attr("d", person);
        }
        for(let g = percent + 1; g < 11; g++){
            svg.append("path")
                .attr("transform", `translate(${g * 70}, ${(i * 300 * scale) + (10*scale)}) scale(${scale})`)
                .attr("class", "attribute")
                .attr("fill","none")
                .attr("stroke", "#574B60")
                .attr("stroke-width", 2)
                .attr("d", person);
        }

        svg.append("text")            
            .attr("class", "attribute")
            .attr("y", `${(i * 300 * scale) + ((300 * scale)/2) + (10*scale) - 12}`)
            .attr("x", 750)
            .style("width", "80px")
            .style("height", "80px")
            .style("font-size", "9pt")
            .style("text-anchor", "left")
            .text(`About ${percent*10}% of ${key}`);

        svg.append("text")            
            .attr("class", "attribute")
            .attr("y", `${(i * 300 * scale) + ((300 * scale)/2)+ (10*scale)}`)
            .attr("x", 750)
            .style("width", "80px")
            .style("height", "80px")
            .style("font-size", "9pt")
            .style("text-anchor", "left")
            .text(`persons experieced symptoms`);

        svg.append("text")            
            .attr("class", "attribute")
            .attr("y", `${(i * 300 * scale) + ((300 * scale)/2) + (10*scale) + 12}`)
            .attr("x", 750)
            .style("width", "80px")
            .style("height", "80px")
            .style("font-size", "9pt")
            .style("text-anchor", "left")
            .text(`of depression or anxiety`);
    })
    
}
