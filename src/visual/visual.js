import React from "react";
import { Line } from "react-chartjs-2";
import csv from "csvtojson";

class VisualizeData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: {
        labels: [],
        datasets: [],
      },
    };
    this.convertToGraphData = this.convertToGraphData.bind(this);
    this.readFile = this.readFile.bind(this);
  }

  data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      // {
      //   label: 'My First dataset',
      //   fill: false,
      //   lineTension: 0.1,
      //   backgroundColor: 'rgba(75,192,192,0.4)',
      //   borderColor: 'rgba(75,192,192,1)',
      //   borderCapStyle: 'butt',
      //   borderDash: [],
      //   borderDashOffset: 0.0,
      //   borderJoinStyle: 'miter',
      //   pointBorderColor: 'rgba(75,192,192,1)',
      //   pointBackgroundColor: '#fff',
      //   pointBorderWidth: 1,
      //   pointHoverRadius: 5,
      //   pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      //   pointHoverBorderColor: 'rgba(220,220,220,1)',
      //   pointHoverBorderWidth: 2,
      //   pointRadius: 1,
      //   pointHitRadius: 10,
      //   data: [65, 59, 80, 81, 56, 55, 40]
      // }
    ],
  };

  convertToGraphData = function (ledger) {
    const assets = [];

    ledger.forEach((row) => {
      if (assets.indexOf(row.asset) === -1) {
        assets.push(row.asset);
      }
    });

    const datasets = assets.map((asset) => {
      return {
        label: asset,
        data: ledger
          .filter((row) => row.asset === asset)
          .map((row) => {
            return {
              t: row.time,
              y: row.balance,
            };
          }),
      };
    });
    const updatedGraphData = {
      labels: assets,
      datasets,
    };
    this.setState({ graphData: updatedGraphData });
  };

  readFile = function (input) {
    const reader = new FileReader();
    const file = document.querySelector("#ledger").files[0];
    const _this = this;
    reader.addEventListener(
      "load",
      function () {
        csv()
          .fromString(reader.result)
          .then((jsonObj) => {
            _this.convertToGraphData(jsonObj);
          });
      },
      false
    );
    reader.readAsText(file);
  };

  render() {
    return (
      <div>
        <h2>Crypto Balance Analyzer</h2>
        <div>
          <h2>Upload Ledger CSV file:</h2>
          <input
            type="file"
            id="ledger"
            name="ledger"
            onChange={this.readFile}
          />
        </div>
        <Line data={this.state.graphData} />
      </div>
    );
  }
}

export default VisualizeData;
