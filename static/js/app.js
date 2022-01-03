// Grab Belly Bio data
let datafile  = "samples.json";

// Fetch Json data for dropdown list
var select_info = d3.select("#selDataset");

// Fetch Json data for demographics table
var demographics_info = d3.select("#sample-metadata");

//Fetch json data (names list of ids) then add them to the html dropdown "id=#selDataset" 
d3.json(datafile).then((data => {
    console.log(data);
    var DD_names = data.names;
    DD_names.forEach((object) => {
      select_info.append("option").text(object);
    });

    //Fetch inital id from data and define variables 
    init_item = data.samples.filter(object => object.id === "940")[0];
    console.log(init_item);

    // define otu ids (metadata list)
    var otu_ids = init_item.otu_ids;
    // define sample values (metadata list)
    var s_values = init_item.sample_values;
    // define otu labels (metadata list)
    var hoverinfo = init_item.otu_labels;

    console.log(s_values);
    console.log(otu_ids);
    console.log(hoverinfo);

    //Define Top 10 values
    bar_values = init_item.sample_values.slice(0, 10).reverse();
    bar_ids = init_item.otu_ids.slice(0, 10).reverse();
    bar_labels  = init_item.otu_labels.slice(0, 10).reverse();

    // console.log(test_values);
    // console.log(test_ids);
    // console.log(test_labels);

   // Create Bar chart (use Top 10 variables)
   let bar_info = [{
    x:bar_labels,
    y:bar_ids.map(object=>`OTU ${object}`),
    text:bar_values,
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
            colorscale: "Rainbow",
            size: s_values,
        }
    }];
    Plotly.newPlot("bubble", bubble_info, bubble_chart);
    
// Bonus: GAUGE CHART

    // Fetch json data and define Demographic variables
    demo_data = data.metadata.filter(object => object.id === 940)[0];
    // console.log(demo_data);

    // Get the washing frequency value for the default test ID
    var wash_freq = demo_data.wfreq;

    // ***Bonus: Gauge Chart***
    // https://codepen.io/pen/
    var gaugeDiv = document.getElementById("gauge-chart");
    var gauge_info = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: { text: "Belly Button Wash Frequency <br> Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 5 },
        gauge: {
          axis: { range: [0, 9] },
          steps: [
            { range: [0, 1], color: "rgba(0, 127, 255, 0.6)" },
            { range: [1, 2], color: "rgba(0, 0, 255, 0.6)" },
            { range: [2, 3], color: "rgba(127, 0, 255, 0.6)" },
            { range: [3, 4], color: "rgba(255, 0, 255, 0.6)" },
            { range: [4, 5], color: "rgba(255, 0, 127, 0.6)" },
            { range: [5, 6], color: "rgba(255, 0, 0, 0.6)" },
            { range: [6, 7], color: "rgba(255, 127, 0, 0.6)" },
            { range: [7, 8], color: "rgba(255, 255, 0, 0.6)" },
            { range: [8, 9], color: "rgba(127, 255, 0, 0.6)" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 10
          }
        }
      }
    ];
    
    var gauge_chart = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot(gaugeDiv, gauge_info, gauge_chart);

//DEMO DATA

    //  // Define Demographic variables
    //  demo_data = data.metadata.filter(object => object.id === 940)[0];
    //  console.log(demo_data);
     
     //Display Demographic metadata
     Object.entries(demo_data).forEach(
         ([key, value]) => demographics_info.append("h6")
         .text(`${key}: ${value}`))
    
    //Update Demo Info when id changes
    select_info.on("change", updatePlotly);

    //Update html Dropdown menu reassigned to new item
    function updatePlotly(){
        var new_dropdown = select_info;
        // Assign the value of the dropdown menu option to a variable
        var dataset = new_dropdown.property("value");
        // console.log(dataset)

        //Update the data for id selection
        new_id = data.samples.filter(object => object.id == dataset )[0];
        // console.log(new_id)

        //Define new variables
        let otu_id = new_id.otu_ids;
        let sample_value = new_id.sample_values;
        let otu_label = new_id.otu_labels

        // Initializes the page with a default plot
        let x_data = sample_value.slice(0, 10).reverse();
        let y_data = otu_id.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
        let bar_text = otu_label.slice(0, 10).reverse();

        //restyle the bar chart once new id value is selected
        // https://community.plotly.com/t/what-is-the-most-performant-way-to-update-a-graph-with-new-data/639
        Plotly.restyle("bar", "x", [x_data]);
        Plotly.restyle("bar", "y", [y_data.map(updated_ID => `${updated_ID}`)]);
        Plotly.restyle("bar", "text", [bar_text]);

        // restyle bubble chart once new id value is selected
        Plotly.restyle("bubble", "x", [x_data]);
        Plotly.restyle("bubble", "y", [y_data]);
        Plotly.restyle("bubble", "labels", [otu_label]);
        Plotly.restyle("bubble", "marker.color", [otu_id]);
        Plotly.restyle("bubble", "marker.size", [sample_value]);

        // Clear out current contents in demographics table
        demographics_info.html("");
        meta_data = data.metadata.filter(object => object.id == dataset)[0];

        // Display each key-value pair from the metadata JSON object
        Object.entries(meta_data).forEach(([key, value]) => demographics_info
          .append("h6").text(`${key}: ${value}`));

        var data_change = meta_data.wfreq;

        
        Plotly.restyle(gaugeDiv, "value", [data_change]);
    }

})
)