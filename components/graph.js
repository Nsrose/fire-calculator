import React, { Fragment } from 'react';
import { Line, Chart} from 'react-chartjs-2';
import Calculator from "../components/calculator";
import * as ChartAnnotation from 'chartjs-plugin-annotation';


Chart.pluginService.register( ChartAnnotation);


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

class FixedPercentageGraph extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.defaults = this.props.defaults;
    this.calculator = new Calculator();
  }


  componentDidMount = () => {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'line',
      options: 
      {
        responsive: true,
        animation: {
            duration: 5000, // general animation time
        },
        title: {
          text: "Fixed Percentage Graph",
          display: true,
          fontSize: 24
        },
        hover: {
          mode: 'x-axis',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Age'
            }
          }],
          yAxes: [{
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return '$' + value.toFixed(2);
                    }
                }
            }]
        },
        tooltips: {
          mode: "x-axis",
          displayColors: true,
          titleFontSize: 16,
          bodyFontSize: 16,
          legend: {
            display: false
          },
            callbacks: {
                label: function(tooltipItems, data) {
                    if (tooltipItems.datasetIndex == 1 || tooltipItems.datasetIndex == 2) {
                      return formatter.format(tooltipItems.yLabel - data.datasets[3].data[0]) + " " + data.datasets[tooltipItems.datasetIndex].label;
                    }
                    return formatter.format(tooltipItems.yLabel) + " " + data.datasets[tooltipItems.datasetIndex].label;
                },
                title: function (tooltipItems, data) {
                  return "Age: " + String(tooltipItems[0].xLabel)
                }
            }
        },
        annotation: {
        }
      },
      data: {
        datasets: [{
        }, {}, {}, {}]
      }
    });

    var calculationResult = this.calculator.calculate(this.defaults);
    this.handleUpdate(calculationResult);
   
  }

  addLine = (line, label, color, datasetIndex) => {
    this.myChart.data.datasets[datasetIndex].data = line;
    this.myChart.data.datasets[datasetIndex].label = label;
    // this.myChart.data.datasets[datasetIndex].fill = true;
    this.myChart.data.datasets[datasetIndex].borderColor = color;
    this.myChart.data.datasets[datasetIndex].pointRadius = 1;
    this.myChart.data.datasets[datasetIndex].pointHoverRadius = 20;
    this.myChart.data.datasets[datasetIndex].backgroundColor = color;
  }


  handleUpdate = (calculationResult) => {
    var fireYear = calculationResult.fireYear;
    var newData = calculationResult.data;

    var endOfYearSavingsLine = [];
    var initialLine = [];
    var savedLine = [];
    var returnsLine = [];
    var labels = [];
    var initial = newData[0].initial;

    for (var i = 0; i < newData.length; i++) {
      labels.push(newData[i].year);
      endOfYearSavingsLine.push(newData[i].endOfYearSavings);
      initialLine.push(initial);
      savedLine.push(newData[i].saved + initial);
      returnsLine.push(newData[i].returns + initial);
    }

    this.myChart.data.labels = labels;

    this.addLine(endOfYearSavingsLine, "Total", "rgba(155, 51, 240, 0.7)", 0);
    this.addLine(returnsLine, "Returns", "rgba(72, 64, 187, 0.7)", 1);
    this.addLine(savedLine, "Saved", "rgba(204, 0, 255, 0.7)", 2);
    this.addLine(initialLine, "Initial", "rgba(65, 63, 87, 0.5)", 3);

    this.myChart.data.datasets[0].fill = +2;
    this.myChart.data.datasets[1].fill = 3;
    this.myChart.data.datasets[2].fill = 1;


    // Vertical line for the fire year
    this.myChart.options.annotation = {
      annotations: [
        {
          type: "line",
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: fireYear,
          borderColor: "#2984c5",
          borderWidth: 5,
          label: {
            // Background color of label, default below
            backgroundColor: 'rgba(0,0,0,0.8)',

            // optional drawTime to control labels' layering; defaults to this element's drawTime
            drawTime: 'afterDatasetsDraw',

            // Padding of label to add left/right, default below
            xPadding: 6,

            // Padding of label to add top/bottom, default below
            yPadding: 6,

            // Radius of label rectangle, default below
            cornerRadius: 6,

            // Anchor position of label on line, can be one of: 'start', 'center', 'end'. Default 'center'.
            position: "center",

            // Adjustment along x-axis (left-right) of label relative to above number (can be negative)
            // Negative values move the label left, postitive right.
            xAdjust: 0,

            // Adjustment along y-axis (top-bottom) of label, in pixels. (can be negative)
            // Negative values move the label up, positive down.
            yAdjust: 0,

            // Whether the label is enabled and should be displayed
            enabled: true,

            // Text to display in label - default is null. Provide an array to display values on a new line
            content: "FIRE Age: " + String(fireYear) + " (" + String(fireYear - labels[0]) + " more years)",
            fontSize: 24,

            // Rotation of label, in degrees, or 'auto' to use the degrees of the line, default is 0
            rotation: 90,
        },
        }
      ]}

    this.myChart.update();
  }


  render() {
    return <canvas ref={this.canvasRef} />;
  }
}


export default FixedPercentageGraph;