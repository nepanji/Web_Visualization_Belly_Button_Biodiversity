# Web_Visualization_Belly_Button_Biodiversity
## Introduction
This assignment demonstrates my ability to build an interactive dashboard to explore the Belly Button Biodiversity dataset, 
which catalogs the microbes that colonize human navels.

The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) 
were present in more than 70% of people, while the rest were relatively rare.


## Plotly
To begin this project, the json data for belly button data on each test subject was pulled using the D3 library to complete the following:

### Drowpdown and Bar Chart
* Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
* Use sample_values as the values for the bar chart
* Use otu_ids as the labels for the bar chart
* Use otu_labels as the hovertext for the chart

  ![Dropdown Menu](https://user-images.githubusercontent.com/89491352/147952986-e973a19c-7654-48aa-abd4-7cd5db66e935.png)
  
  ![Bar Chart](https://user-images.githubusercontent.com/89491352/147949912-f3b4d351-86fc-4d37-b6f0-a10fdda7badc.png)



### Bubble Chart
* Create a bubble chart that displays each sample
* Use otu_ids for the x values
* Use sample_values for the y values
* Use sample_values for the marker size
* Use otu_ids for the marker colors
* Use otu_labels for the text values

 ![Bubble Chart](https://user-images.githubusercontent.com/89491352/147951263-cd89f52b-47eb-43f9-aa8e-f69c52387317.png)

### Demographics Table
* Display the sample metadata, i.e., an individual's demographic information
* Display each key-value pair from the metadata JSON object somewhere on the page
* Update all of the plots any time that a new sample is selected

  ![Demographics Table](https://user-images.githubusercontent.com/89491352/147953036-bc93293a-164f-4e24-b9c5-a551a1a3a844.png)
  
### Bonus: Gauge Chart
* Plot the weekly washing frequency of the individual
* Modify the example gauge code to account for values ranging from 0 through 9
* Update the chart whenever a new sample is selected

  ![Gauge Chart](https://user-images.githubusercontent.com/89491352/147950347-0a203045-a122-43be-a626-8ff7b0da26f4.png)
