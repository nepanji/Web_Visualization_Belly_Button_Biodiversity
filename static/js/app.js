// Grab Belly Bio data
let datafile  = "samples.json";

d3.json(datafile).then((data => {
    console.log(data);
    var DD_names = data.names;
    DD_names.forEach((object) => {
        d3.select("#selDataset").append("option").text(object);
    });

    //Fetch data and define variables 
    init_item = data.samples.filter(object => object.id === "940")[0];
    console.log(init_item);

    // define otu ids (metadata list)
    var otu_ids = init_item.otu_ids;
    // define sample values (metadata list)
    var s_values = init_item.sample_values;
    // define otu labels (metadata list)
    var hoverinfo = init_item.otu_labels;


    //Define Top 10 values
    test_values = init_item.sample_values.slice(0, 10).reverse();
    test_ids = init_item.otu_ids.slice(0, 10).reverse();
    test_labels  = init_item.otu_labels.slice(0, 10).reverse();

    console.log(test_values);
    console.log(test_ids);
    console.log(test_labels);

   // Create Bar chart (use Top 10 variables)
   let bar_info = [{
    x:test_labels,
    y:test_ids.map(object=>`OTU ${object}`),
    text:test_values,
    type: "bar",
    orientation:"h"
    }];
    let bar_chart = {
        title: "Top 10 Belly Bacteria Samples",
        xaxis: {title: "Sample Value"},
        width: 550,
        height: 650
    };

    Plotly.newPlot("bar", bar_info, bar_chart);

    //Create Bubble Chart
    var bubble_chart = {
        title: "Belly Button Samples (Bubble Chart)",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Sample Value"}
    }
    let bubble_info = [{
        x: otu_ids,
        y: s_values,
        labels: hoverinfo,
        mode: 'markers',
        marker: {
            color: otu_ids,
            colorscale: "Dark2",
            size: s_values,
        }
    }];
    Plotly.newPlot("bubble", bubble_info, bubble_chart);
    
    // Define Demographic variables
    demo_data = data.metadata.filter(object => object.id.toString() == 940)[0];
    console.log(demo_data);
    
    //Display Demographic metadata
    Object.entries(demo_data).forEach(
        ([key, value]) => {d3.select("#sample-metadata").append("h6")
        .text(`${key}: ${value}`)})
    
        // ADVANCED CHALLENGE: GAUGE CHART
    // Get the washing frequency value for the default test ID
    var wash_freq = demo_data.wfreq;

    // ***Bonus: Gauge Chart***
var gaugeDiv = document.getElementById("gauge-chart");

var gauge_info = [{
  type: "pie",
  showlegend: false,
  hole: 0.5,
  rotation: 180,
  values: wash_freq,
  text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
  direction: "clockwise",
  textinfo: "text",
  textposition: "inside",
  marker: {
    colors: ["rgba(0, 127, 255, 0.6)", "rgba(0, 0, 255, 0.6)", "rgba(127, 0, 255, 0.6)", "rgba(255, 0, 255, 0.6)", "rgba(255, 0, 127, 0.6)", "rgba(255, 0, 0, 0.6)", "rgba(255, 127, 0, 0.6)", "rgba(255, 255, 0, 0.6)", "rgba(127, 255, 0, 0.6)", "white"]
  },
  labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
  hoverinfo: "label"
}];
// gauge needle
var degrees = 50, radius = .6;
var radians = degrees * Math.PI / 180;
var x = -1 * radius * Math.cos(radians);
var y = radius * Math.sin(radians);

var layout = {
  shapes:[{
      type: 'line',
      x0: 0.5,
      y0: 0.5,
      x1: 0,
      y1: 0.5,
      line: {
        color: 'black',
        width: 3
      }
    }],
  title: 'Belly Button Wash Frequency',
  xaxis: {visible: false, range: [0, 1]},
  yaxis: {visible: false, range: [0, 1]}
};


Plotly.plot(gaugeDiv, gauge_info, layout, {staticPlot: true});



    
    //Update Demo Info when id changes
    d3.selectAll("selDataset").on("change", updatePlotly);

    //Update html Dropdown menu reassigned to new item
    // function update_elements(){
        var new_dropdown = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var dataset = new_dropdown.property("value");
        console.log(dataset)

        //Update the data for id selection
        new_id = data.samples.filter(object => object.id === dataset)[0];
        console.log(new_id)

        //Define new variables
        let otu_id = new_id.otu_ids;
        let sample_value = new_id.sample_values;
        let otu_label = new_id.otu_labels

        // Initializes the page with a default plot
        let x_data = sample_value.slice(0, 10).reverse();
        let y_data = otu_id.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
        let bar_text = otu_label.slice(0, 10).reverse();

        //restyle the bar chart once new id value is selected
        Plotly.restyle("bar", "x", [x_data]);
        Plotly.restyle("bar", "y", [y_data.map(updated_ID => `OTU ${updated_ID}`)]);
        Plotly.restyle("bar", "text", [bar_text]);

        // restyle bubble chart once new id value is selected
        Plotly.restyle("bubble", "x", [x_data]);
        Plotly.restyle("bubble", "y", [y_data]);
        Plotly.restyle("bubble", "labels", [otu_label]);
        Plotly.restyle("bubble", "marker.color", [otu_id]);
        Plotly.restyle("bubble", "marker.size", [sample_value])

		meta_data = data.metadata.filter(object => object.id == dataset)[0];

		// Clear out current contents in the panel
		d3.select("#sample-metadata").html("");

		// Display each key-value pair from the metadata JSON object
		Object.entries(meta_data).forEach(([key, value]) => d3.select("#sample-metadata").append("h6").text(`${key}: ${value}`));

    

}))