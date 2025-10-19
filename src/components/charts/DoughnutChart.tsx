import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: any;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#d1d5db', // text-secondary
          boxWidth: 20,
          padding: 15,
        },
      },
    },
    cutout: '60%',
  };

  return <div className="h-80"><Doughnut data={data} options={options} /></div>;
};

export default DoughnutChart;
