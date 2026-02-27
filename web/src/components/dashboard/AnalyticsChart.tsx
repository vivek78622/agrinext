"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '../ui/Card';
import { useState } from 'react';
import clsx from 'clsx';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: 'rgba(15, 15, 15, 0.9)',
            titleColor: '#fff',
            bodyColor: '#ccc',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
                drawBorder: false,
            },
            ticks: {
                color: '#666',
            },
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false,
            },
            ticks: {
                color: '#666',
            },
        },
    },
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
};

const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];

const data = {
    labels,
    datasets: [
        {
            fill: true,
            label: 'Soil Moisture',
            data: [65, 62, 60, 58, 65, 70, 68],
            borderColor: '#00E676',
            backgroundColor: 'rgba(0, 230, 118, 0.1)',
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#00E676',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
        },
        {
            fill: true,
            label: 'Temperature',
            data: [22, 21, 24, 28, 30, 26, 23],
            borderColor: '#FFEB3B',
            backgroundColor: 'rgba(255, 235, 59, 0.05)',
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#FFEB3B',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
        },
    ],
};

const timeRanges = ['24h', '7d', '30d'];

export default function AnalyticsChart() {
    const [activeRange, setActiveRange] = useState('24h');

    return (
        <Card className="h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">Environmental Trends</h3>
                    <p className="text-sm text-gray-400">Soil Moisture vs Temperature</p>
                </div>
                <div className="flex bg-white/5 rounded-lg p-1">
                    {timeRanges.map((range) => (
                        <button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={clsx(
                                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                                activeRange === range
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full min-h-0">
                <Line options={options} data={data} />
            </div>
        </Card>
    );
}
