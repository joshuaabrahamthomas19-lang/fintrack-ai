import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    data: ChartData<'doughnut'>;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#d1d5db', // text-secondary
                }
            },
        },
    };

    return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
