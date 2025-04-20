import React, { useState, useEffect } from 'react';
import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import TopProductsTable from '../components/TopProductsTable';
import RevenueChart from '../components/RevenueChart';
import ExportButton from '../components/ExportButton';
import revenueService from '../service/revenue-service';
import TopCustomersTable from '../components/TopCustomersTable';

// Temporary mock data for customers and stats
const mockStats = {
  totalCustomers: 1250,
  totalProducts: 384,
};


const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [revenueData, setRevenueData] = useState([]);
  const [averageMonthlyRevenue, setAverageMonthlyRevenue] = useState(0);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [growthRate, setGrowthRate] = useState({ value: 0, isPositive: true });
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeframeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch average monthly revenue
        const avgData = await revenueService.getAverageMonthlyRevenue();
        setAverageMonthlyRevenue(avgData);

        // Fetch revenue by timeframe
        let formattedData = [];
        switch (timeframe) {
          case 'daily':
            formattedData = await revenueService.getDailyRevenue();
            break;
          case 'weekly':
            formattedData = await revenueService.getWeeklyRevenue();
            break;
          case 'monthly':
            formattedData = await revenueService.getMonthlyRevenue();
            break;
          case 'yearly':
            formattedData = await revenueService.getYearlyRevenue();
            break;
          default:
            formattedData = await revenueService.getMonthlyRevenue();
        }
        setRevenueData(formattedData);

        // Fetch top products
        const topProductsData = await revenueService.getTopProductsByRevenue(timeframe, 5);
        setTopProducts(topProductsData);
        // Fetch top cusomers
        const topCustomersData = await revenueService.getTopCustomersByValue(timeframe, 5);
        setTopCustomers(topCustomersData);

        // Fetch current revenue and growth rate
        if (timeframe === 'monthly') {
          const { currentRevenue, growthRate, isPositive } = await revenueService.getCurrentMonthGrowth();
          setCurrentRevenue(currentRevenue);
          setGrowthRate({ value: growthRate, isPositive });
        } else if (timeframe === 'weekly') {
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentWeek = Math.ceil(((currentDate - new Date(currentYear, 0, 1)) / 86400000 + 1) / 7);
          const currentWeekDate = `${currentYear}-W${currentWeek}`;
          const currentWeekData = formattedData.find(item => item.date === currentWeekDate);
          const currentRevenue = currentWeekData?.revenue || 0;
          setCurrentRevenue(currentRevenue);

          const previousWeek = currentWeek === 1 ? 52 : currentWeek - 1;
          const previousYear = currentWeek === 1 ? currentYear - 1 : currentYear;
          const previousWeekDate = `${previousYear}-W${previousWeek}`;
          const previousWeekData = formattedData.find(item => item.date === previousWeekDate);
          const previousRevenue = previousWeekData?.revenue || 0;
          const growth = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
          setGrowthRate({
            value: Math.round(Math.abs(growth) * 10) / 10,
            isPositive: growth >= 0,
          });
        } else if (timeframe === 'daily') {
          const currentDateStr = new Date().toISOString().slice(0, 10);
          const currentDayData = formattedData.find(item => item.date === currentDateStr);
          const currentRevenue = currentDayData?.revenue || 0;
          setCurrentRevenue(currentRevenue);

          const previousDate = new Date();
          previousDate.setDate(previousDate.getDate() - 1);
          const previousDateStr = previousDate.toISOString().slice(0, 10);
          const previousDayData = formattedData.find(item => item.date === previousDateStr);
          const previousRevenue = previousDayData?.revenue || 0;
          const growth = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
          setGrowthRate({
            value: Math.round(Math.abs(growth) * 10) / 10,
            isPositive: growth >= 0,
          });
        } else {
          const currentYear = new Date().getFullYear().toString();
          const currentYearData = formattedData.find(item => item.date === currentYear);
          const currentRevenue = currentYearData?.revenue || 0;
          setCurrentRevenue(currentRevenue);

          const previousYear = (Number(currentYear) - 1).toString();
          const previousYearData = formattedData.find(item => item.date === previousYear);
          const previousRevenue = previousYearData?.revenue || 0;
          const growth = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
          setGrowthRate({
            value: Math.round(Math.abs(growth) * 10) / 10,
            isPositive: growth >= 0,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRevenueData([]);
        setAverageMonthlyRevenue(0);
        setCurrentRevenue(0);
        setGrowthRate({ value: 0, isPositive: true });
        setTopProducts([]); // Reset top products on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <ExportButton
              data={revenueData}
              filename={`revenue-${timeframe}-report`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
              title="Average Monthly Revenue"
              value={loading ? 'Loading...' : `$${Math.round(averageMonthlyRevenue).toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 0, isPositive: true }}
          />
          <StatCard
              title={
                timeframe === 'daily' ? 'Current Day Revenue' :
                    timeframe === 'weekly' ? 'Current Week Revenue' :
                        timeframe === 'monthly' ? 'Current Month Revenue' :
                            'Current Year Revenue'
              }
              value={loading ? 'Loading...' : `$${Math.round(currentRevenue).toLocaleString()}`}
              icon={TrendingUp}
              trend={growthRate}
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
              data={revenueData}
              title={`Revenue Trend (${timeframe})`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopCustomersTable customers={topCustomers} />
          <TopProductsTable products={topProducts} />
        </div>
      </div>
  );
};

export default Dashboard;