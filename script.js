import * as d3 from "d3";
let data = await d3.csv("https://flunky.github.io/cars2017.csv");
console.log(data);