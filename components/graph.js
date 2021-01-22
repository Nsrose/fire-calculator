import React, { Fragment } from 'react';
import { Line } from 'react-chartjs-2';
import Calculator from "../components/calculator";



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
        title: {
          text: "Fixed Percentage Graph",
          display: true
        },
		    // maintainAspectRatio: false,
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
          mode: "label",
          displayColors: true,
          legend: {
            display: false
          },
            callbacks: {
                label: function(tooltipItems, data) {
                    if (tooltipItems.datasetIndex == 1 || tooltipItems.datasetIndex == 2) {
                      return formatter.format(tooltipItems.yLabel - data.datasets[3].data[0]);
                    }
                    return formatter.format(tooltipItems.yLabel);
                },
                afterLabel: function(tooltipItems, data) {
                  return data.datasets[tooltipItems.datasetIndex].label
                },
                title: function (tooltipItems, data) {
                  return "Age: " + String(tooltipItems[0].xLabel)
                }
            }
        }
      },
      data: {
        datasets: [{
        }, {}, {}, {}]
      }
    });
    // debugger;
    var calculationResult = this.calculator.calculate(this.defaults);
    this.handleUpdate(calculationResult);
  }

  addLine = (line, label, color, datasetIndex) => {
    this.myChart.data.datasets[datasetIndex].data = line;
    this.myChart.data.datasets[datasetIndex].label = label;
    this.myChart.data.datasets[datasetIndex].fill = true;
    this.myChart.data.datasets[datasetIndex].borderColor = color;
    this.myChart.data.datasets[datasetIndex].pointRadius = 10;
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

    this.addLine(endOfYearSavingsLine, "Total", "rgb(0, 153, 255, 0.5)", 0);
    this.addLine(returnsLine, "Returns", "rgba(204, 0, 255, 0.5)", 1);
    this.addLine(savedLine, "Saved", "rgba(255, 51, 0, 0.5)", 2);
    this.addLine(initialLine, "Initial", "rgb(0, 204, 0, 0.5)", 3);


    this.myChart.update();
  }


  render() {
    return <canvas ref={this.canvasRef} />;
  }
}


export default FixedPercentageGraph;