import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { ChartConfig } from '../../types/analytics';

// Register Chart.js components
ChartJS.register(...registerables);

interface AnalyticsChartProps {
  config: ChartConfig;
  className?: string;
  isLoading?: boolean;
  error?: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  config,
  className = '',
  isLoading = false,
  error,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || isLoading) return;

    try {
      // Destroy existing chart
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) {
        setChartError('Unable to get canvas context');
        return;
      }

      // Create new chart
      const chart = new ChartJS(ctx, {
        type: config.type,
        data: config.data,
        options: {
          ...config.options,
          responsive: config.responsive,
          animation: config.animation ? {
            duration: 1000,
            easing: 'easeInOutQuart',
          } : false,
        },
      });

      chartRef.current = chart;
      setChartError(null);
    } catch (err) {
      console.error('Chart creation error:', err);
      setChartError('Failed to create chart');
    }

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config, isLoading]);

  // Update chart data if it changes
  useEffect(() => {
    if (chartRef.current && config.data) {
      chartRef.current.data = config.data;
      chartRef.current.update('active');
    }
  }, [config.data]);

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-2">Loading chart data...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error || chartError) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <p className="text-red-600 font-medium">Chart Error</p>
            <p className="text-gray-500 text-sm mt-1">
              {error || chartError || 'Unable to load chart data'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
        {config.description && (
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        )}
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ maxHeight: '400px' }}
        />
      </div>
    </Card>
  );
};

// Utility functions for creating common chart configurations
export const createLineChartConfig = (
  title: string,
  data: { labels: string[]; datasets: Array<{ label: string; data: number[]; color?: string }> },
  description?: string
): ChartConfig => ({
  type: 'line',
  title,
  description,
  data: {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.color || '#3B82F6',
      backgroundColor: dataset.color ? `${dataset.color}20` : '#3B82F620',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    })),
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
      },
      x: {
        grid: {
          color: '#F3F4F6',
        },
      },
    },
  },
  responsive: true,
  animation: true,
});

export const createBarChartConfig = (
  title: string,
  data: { labels: string[]; datasets: Array<{ label: string; data: number[]; color?: string }> },
  description?: string
): ChartConfig => ({
  type: 'bar',
  title,
  description,
  data: {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.color || '#3B82F6',
      borderColor: dataset.color || '#3B82F6',
      borderWidth: 1,
    })),
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  },
  responsive: true,
  animation: true,
});

export const createPieChartConfig = (
  title: string,
  data: { labels: string[]; values: number[]; colors?: string[] },
  description?: string
): ChartConfig => ({
  type: 'pie',
  title,
  description,
  data: {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.values,
        backgroundColor: data.colors || [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
          '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        display: true,
        position: 'right',
      },
    },
  },
  responsive: true,
  animation: true,
});

export const createDoughnutChartConfig = (
  title: string,
  data: { labels: string[]; values: number[]; colors?: string[] },
  description?: string
): ChartConfig => ({
  type: 'doughnut',
  title,
  description,
  data: {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.values,
        backgroundColor: data.colors || [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  },
  responsive: true,
  animation: true,
});

export const createAreaChartConfig = (
  title: string,
  data: { labels: string[]; datasets: Array<{ label: string; data: number[]; color?: string }> },
  description?: string
): ChartConfig => ({
  type: 'line',
  title,
  description,
  data: {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.color || '#3B82F6',
      backgroundColor: dataset.color ? `${dataset.color}40` : '#3B82F640',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    })),
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
      },
      x: {
        grid: {
          color: '#F3F4F6',
        },
      },
    },
  },
  responsive: true,
  animation: true,
});