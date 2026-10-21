import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function ProgressChart({
  labels = [],
  values = [],
  label = "Progress",
  unit = ""
}) {
  const data = {
    labels,

    datasets: [
      {
        label,
        data: values,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y}${unit}`;
          }
        }
      }
    },

    scales: {
      x: {
        grid: {
          display: false
        }
      },

      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="progress-chart">

      <div className="progress-chart-header">

        <div>
          <h3>
            {label}
          </h3>

          <p>
            Track your progress over time
          </p>
        </div>

      </div>

      <div className="chart-container">
        <Line
          data={data}
          options={options}
        />
      </div>

    </div>
  );
}

export default ProgressChart;