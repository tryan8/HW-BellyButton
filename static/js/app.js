function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
var metadataURL = `/metadata/${sample}`
d3.json(metadataURL).then((metadata) => {
  var selector = d3.select('#sample-metadata');
  selector.html("");

  Object.entries(metadata).forEach(function([key,value]) {
    selector
      .append("p")
      .text(`${key}:${value}`);
  });
});
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
var sampleURL = `/samples/${sample}`
d3.json(sampleURL).then((sampleData) => {
    // @TODO: Build a Bubble Chart using the sample data
  var bubbleData = [{
    x: sampleData["otu_ids"],
    y: sampleData["sample_values"],
    text: sampleData["otu_labels"],
    mode: "markers",
    marker: {
      size: sampleData["sample_values"],
      color: sampleData["otu_ids"],
      colorscale: "Earth",
    }
  }];
Plotly.newPlot("bubble", bubbleData)
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
var pieData = [{
  values: sampleData["sample_values"].slice(0, 10),
  labels: sampleData["otu_ids"].slice(0, 10),
  hovertext: sampleData["otu_labels"].slice(0, 10),
  hoverinfo: "hovertext",
  type: "pie"
}];
var pieLayout = {
  margin: {t:0,l:0}
  };
Plotly.newPlot("pie", pieData)
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
