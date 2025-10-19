import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useApp } from '../ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
    }[];
}

const BarChart: React.FC<BarChartProps> = ({ labels, datasets }) => {
    const { theme } = useApp();
    const isDarkMode = theme === 'dark';

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: isDarkMode ? '#d1d5db' : '#4b5563',
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                titleColor: isDarkMode ? '#f0fdf4' : '#111827',
                bodyColor: isDarkMode ? '#d1d5db' : '#4b5563',
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            y: {
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
    };

    const data = {
        labels,
        datasets,
    };

    return <Bar options={options} data={data} />;
};

export default BarChart;
