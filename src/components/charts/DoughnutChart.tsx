import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useApp } from '../ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    labels: string[];
    data: number[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, data: chartData }) => {
    const { theme } = useApp();
    const isDarkMode = theme === 'dark';

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                 labels: {
                    color: isDarkMode ? '#d1d5db' : '#4b5563',
                    boxWidth: 20,
                    padding: 20,
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                titleColor: isDarkMode ? '#f0fdf4' : '#111827',
                bodyColor: isDarkMode ? '#d1d5db' : '#4b5563',
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                borderWidth: 1,
            }
        },
        cutout: '60%',
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Spending',
                data: chartData,
                backgroundColor: [
                    'rgba(52, 211, 153, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(249, 115, 22, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                ],
                borderColor: [
                     'rgba(52, 211, 153, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return <Doughnut options={options} data={data} />;
};

export default DoughnutChart;
