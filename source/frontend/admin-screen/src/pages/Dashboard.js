import React, { useState } from 'react';
import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import TopProductsTable from '../components/TopProductsTable';
import RevenueChart from '../components/RevenueChart';
import ExportButton from '../components/ExportButton';

// Temporary mock data
const mockStats = {
  averageMonthlyRevenue: 45000,
  currentMonthRevenue: 52000,
  totalCustomers: 1250,
  totalProducts: 384
};

const mockProducts = [
  {
    id: '1',
    name: 'Organic Carrots',
    category: 'Vegetables',
    price: 2.99,
    stock: 500,
    sold: 1200
  },
  {
    id: '2',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 1.99,
    stock: 300,
    sold: 800
  },
  {
    id: '3',
    name: 'Organic Apples',
    category: 'Fruits',
    price: 3.99,
    stock: 400,
    sold: 950
  }
];

const mockRevenueData = [
  { date: '2024-01', revenue: 42000 },
  { date: '2024-02', revenue: 45000 },
  { date: '2024-03', revenue: 52000 },
];

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('monthly');

  const timeframeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <ExportButton
              data={mockRevenueData}
              filename={`revenue-${timeframe}-report`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
              title="Average Monthly Revenue"
              value={`$${mockStats.averageMonthlyRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 12, isPositive: true }}
          />
          <StatCard
              title="Current Month Revenue"
              value={`$${mockStats.currentMonthRevenue.toLocaleString()}`}
              icon={TrendingUp}
              trend={{ value: 8, isPositive: true }}
          />
          <StatCard
              title="Total Customers"
              value={mockStats.totalCustomers.toLocaleString()}
              icon={Users}
          />
          <StatCard
              title="Total Products"
              value={mockStats.totalProducts.toLocaleString()}
              icon={Package}
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Revenue Analytics</h2>
            <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {timeframeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
              ))}
            </select>
          </div>
          <RevenueChart
              data={mockRevenueData}
              title={`Revenue Trend (${timeframe})`}
          />
        </div>

        <div className="mb-8">
          <TopProductsTable products={mockProducts} />
        </div>
      </div>
  );
};

export default Dashboard;
