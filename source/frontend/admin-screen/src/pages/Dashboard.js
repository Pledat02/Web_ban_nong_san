import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';
import revenueService from '../service/revenue-service';
import 'react-toastify/dist/ReactToastify.css';
import { getISOWeek, getYear, subDays, format, eachDayOfInterval } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const App = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [chartInstance, setChartInstance] = useState(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [barChartInstance, setBarChartInstance] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [averageMonthlyRevenue, setAverageMonthlyRevenue] = useState(0);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [growthRate, setGrowthRate] = useState({ value: 0, isPositive: true });
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });

  const timeframeOptions = [
    { value: 'day', label: 'Ngày', api: 'daily' },
    { value: 'week', label: 'Tuần', api: 'weekly' },
    { value: 'month', label: 'Tháng', api: 'monthly' },
    { value: 'year', label: 'Năm', api: 'yearly' },
    { value: 'custom', label: 'Tùy chỉnh', api: 'date-range' },
  ];

  const formatRevenue = (value) => {
    console.log(value)
 if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} triệu VND`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k VND`;
    } else {
      return `${value.toLocaleString()} VND`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const selectedTimeframe = timeframeOptions.find((opt) => opt.value === timeFilter)?.api || 'monthly';
      try {
        let formattedData = [];

        if (selectedTimeframe === 'date-range') {
          const startDateStr = format(dateRange.startDate, 'yyyy-MM-dd');
          const endDateStr = format(dateRange.endDate, 'yyyy-MM-dd');
          formattedData = await revenueService.getRevenueByDateRange(startDateStr, endDateStr);
          if (formattedData && formattedData.length > 0) {
            const totalRevenue = formattedData.reduce((sum, item) => sum + (item.revenue || 0), 0);
            setCurrentRevenue(totalRevenue);
            // Tính growthRate cho date-range
            const previousStartDate = subDays(dateRange.startDate, (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24));
            const previousEndDate = subDays(dateRange.startDate, 1);
            const previousData = await revenueService.getRevenueByDateRange(
                format(previousStartDate, 'yyyy-MM-dd'),
                format(previousEndDate, 'yyyy-MM-dd')
            );
            const previousTotal = previousData.reduce((sum, item) => sum + (item.revenue || 0), 0);
            const growth = previousTotal === 0 ? 0 : ((totalRevenue - previousTotal) / previousTotal) * 100;
            setGrowthRate({
              value: Math.round(Math.abs(growth) * 10) / 10,
              isPositive: growth >= 0,
            });
          } else {
            setCurrentRevenue(0);
            setGrowthRate({ value: 0, isPositive: true });
          }

          // Lấy dữ liệu cho date-range
          const topProductsData = await revenueService.getTopProductsByRevenue('date-range', 5, startDateStr, endDateStr);
          setTopProducts(topProductsData || []);
          const topCustomersData = await revenueService.getTopCustomersByValue('date-range', 5, startDateStr, endDateStr);
          setTopCustomers(
              topCustomersData.map((c) => ({
                id: c.id,
                name: c.name || 'Unknown',
                revenue: c.totalSpent || 0,
                orders: c.totalOrders || 0,
                favoriteProduct: c.favoriteProduct || 'N/A',
              })) || []
          );
          const productsSold = await revenueService.getProductsSoldCount('date-range', startDateStr, endDateStr);
          const customersCount = await revenueService.getCustomerCount('date-range', startDateStr, endDateStr);
          setTotalProducts(productsSold || 0);
          setTotalCustomers(customersCount || 0);
        } else {
          const avgData = await revenueService.getAverageMonthlyRevenue();
          setAverageMonthlyRevenue(avgData || 0);

          switch (selectedTimeframe) {
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

          const topProductsData = await revenueService.getTopProductsByRevenue(selectedTimeframe, 5);
          setTopProducts(topProductsData || []);
          const topCustomersData = await revenueService.getTopCustomersByValue(selectedTimeframe, 5);
          setTopCustomers(
              topCustomersData.map((c) => ({
                id: c.id,
                name: c.name || 'Unknown',
                revenue: c.totalSpent || 0,
                orders: c.totalOrders || 0,
                favoriteProduct: c.favoriteProduct || 'N/A',
              })) || []
          );
          const productsSold = await revenueService.getProductsSoldCount(selectedTimeframe);
          const customersCount = await revenueService.getCustomerCount(selectedTimeframe);
          setTotalProducts(productsSold || 0);
          setTotalCustomers(customersCount || 0);

          const currentDate = new Date();
          if (selectedTimeframe === 'monthly') {
            const { currentRevenue, growthRate, isPositive } = await revenueService.getCurrentMonthGrowth();
            setCurrentRevenue(currentRevenue || 0);
            setGrowthRate({ value: growthRate || 0, isPositive: isPositive || true });
          } else {
            let currentDateStr, previousDateStr, currentData, previousData;
            if (selectedTimeframe === 'daily') {
              currentDateStr = currentDate.toISOString().slice(0, 10);
              const previousDate = subDays(currentDate, 1);
              previousDateStr = previousDate.toISOString().slice(0, 10);
              currentData = formattedData.find((item) => item.date === currentDateStr);
              previousData = formattedData.find((item) => item.date === previousDateStr);
            } else if (selectedTimeframe === 'weekly') {
              const currentYear = getYear(currentDate);
              const currentWeek = getISOWeek(currentDate);
              currentDateStr = `${currentYear}-W${currentWeek < 10 ? '0' + currentWeek : currentWeek}`;
              previousDateStr = `${currentWeek === 1 ? currentYear - 1 : currentYear}-W${currentWeek === 1 ? 52 : currentWeek - 1 < 10 ? '0' + (currentWeek - 1) : currentWeek - 1}`;
              currentData = formattedData.find((item) => item.date === currentDateStr) || formattedData.sort((a, b) => b.date.localeCompare(a.date))[0];
              previousData = formattedData.find((item) => item.date === previousDateStr);
            } else {
              currentDateStr = currentDate.getFullYear().toString();
              previousDateStr = (currentDate.getFullYear() - 1).toString();
              currentData = formattedData.find((item) => item.date === currentDateStr);
              previousData = formattedData.find((item) => item.date === previousDateStr);
            }
            const currentRevenue = currentData?.revenue || 0;
            const previousRevenue = previousData?.revenue || 0;
            const growth = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
            setCurrentRevenue(currentRevenue);
            setGrowthRate({
              value: Math.round(Math.abs(growth) * 10) / 10,
              isPositive: growth >= 0,
            });
          }
        }
        setRevenueData(formattedData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Lỗi khi tải dữ liệu dashboard: ' + (error.response?.data?.message || error.message), { position: 'top-right' });
        setRevenueData([]);
        setAverageMonthlyRevenue(0);
        setCurrentRevenue(0);
        setGrowthRate({ value: 0, isPositive: true });
        setTopProducts([]);
        setTopCustomers([]);
        setTotalProducts(0);
        setTotalCustomers(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeFilter, dateRange]);
  useEffect(() => {
    const chartDom = document.getElementById('revenue-chart');
    if (chartDom && !chartInstance) {
      const myChart = echarts.init(chartDom);
      setChartInstance(myChart);
    }

    const pieChartDom = document.getElementById('product-pie-chart');
    if (pieChartDom && !pieChartInstance) {
      const pieChart = echarts.init(pieChartDom);
      setPieChartInstance(pieChart);
    }

    const barChartDom = document.getElementById('customer-bar-chart');
    if (barChartDom && !barChartInstance) {
      const barChart = echarts.init(barChartDom);
      setBarChartInstance(barChart);
    }

    const handleResize = () => {
      chartInstance?.resize();
      pieChartInstance?.resize();
      barChartInstance?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance?.dispose();
      pieChartInstance?.dispose();
      barChartInstance?.dispose();
    };
  }, [chartInstance, pieChartInstance, barChartInstance]);

  useEffect(() => {
    if (chartInstance && revenueData.length > 0) {
      const option = {
        animation: true,
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const { name, value } = params[0];
            return `${name}: ${formatRevenue(value * 1000000)}`;
          },
        },
        color: ['#22C55E'],
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: revenueData.map((item) => item.date),
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value) => `${value.toFixed(0)} tr`,
          },
        },
        series: [
          {
            name: 'Doanh thu',
            type: 'line',
            data: revenueData.map((item) => item.revenue / 1000000),
            smooth: true,
            lineStyle: { width: 3, color: '#22C55E' },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(34, 197, 94, 0.4)' },
                  { offset: 1, color: 'rgba(34, 197, 94, 0.1)' },
                ],
              },
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: { color: '#22C55E' },
          },
        ],
      };
      chartInstance.setOption(option);
    }
  }, [chartInstance, revenueData]);

  useEffect(() => {
    if (pieChartInstance && topProducts.length > 0) {
      const pieOption = {
        animation: true,
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const { name, value } = params;
            return `${name}: ${formatRevenue(value * 1000000)} (${params.percent}%)`;
          },
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: topProducts.map((p) => p.name),
        },
        series: [
          {
            name: 'Nhóm sản phẩm',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
            label: { show: false, position: 'center' },
            emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
            labelLine: { show: false },
            data: topProducts.map((p, i) => ({
              value: p.revenue / 1000000,
              name: p.name,
              itemStyle: { color: ['#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0', '#DCFCE7'][i % 5] },
            })),
          },
        ],
      };
      pieChartInstance.setOption(pieOption);
    }
  }, [pieChartInstance, topProducts]);

  useEffect(() => {
    if (barChartInstance && topCustomers.length > 0) {
      const barOption = {
        animation: true,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            const { name, value } = params[0];
            return `${name}: ${formatRevenue(value * 1000000)}`;
          },
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'value',
          axisLabel: { formatter: (value) => `${value.toFixed(0)} tr` },
        },
        yAxis: {
          type: 'category',
          data: topCustomers.map((c) => c.name),
          axisLabel: { fontSize: 12, width: 120, overflow: 'truncate' },
        },
        series: [
          {
            name: 'Doanh thu',
            type: 'bar',
            data: topCustomers.map((c) => c.revenue / 1000000),
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#22C55E' },
                  { offset: 1, color: '#4ADE80' },
                ],
              },
              borderRadius: [0, 4, 4, 0],
            },
          },
        ],
      };
      barChartInstance.setOption(barOption);
    }
  }, [barChartInstance, topCustomers]);

  const handleExport = () => {
    const revenueSheet = XLSX.utils.json_to_sheet(
        revenueData.map((item) => ({
          Date: item.date,
          Revenue: formatRevenue(item.revenue),
        }))
    );
    const productsSheet = XLSX.utils.json_to_sheet(
        topProducts.map((p) => ({
          Name: p.name,
          Quantity: p.quantity,
          Revenue: formatRevenue(p.revenue ),
          Growth: p.growth ? `${p.growth}%` : 'N/A',
        }))
    );
    const customersSheet = XLSX.utils.json_to_sheet(
        topCustomers.map((c) => ({
          Name: c.name,
          Orders: c.orders,
          Revenue: formatRevenue(c.revenue),
          FavoriteProduct: c.favoriteProduct,
        }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, revenueSheet, 'Revenue Data');
    XLSX.utils.book_append_sheet(wb, productsSheet, 'Top Products');
    XLSX.utils.book_append_sheet(wb, customersSheet, 'Top Customers');
    XLSX.writeFile(wb, `revenue-${timeFilter}-report.xlsx`);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full">
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Thống kê tổng quan</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {timeframeOptions.map((option) => (
                      <button
                          key={option.value}
                          onClick={() => handleTimeFilterChange(option.value)}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                              timeFilter === option.value
                                  ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm'
                                  : 'text-gray-500 dark:text-gray-300'
                          } whitespace-nowrap cursor-pointer`}
                      >
                        {option.label}
                      </button>
                  ))}
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Xuất báo cáo
                </button>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
                  <i className="fas fa-dollar-sign text-green-600 dark:text-green-400 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Doanh thu {timeFilter === 'month' ? 'tháng này' : timeFilter === 'custom' ? 'khoảng thời gian' : timeFilter}
                  </p>
                  <div className="flex items-baseline">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {loading ? 'Loading...' : formatRevenue(currentRevenue )}
                    </h2>
                    <span
                        className={`ml-2 text-sm font-medium ${
                            growthRate.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                    <i className={`fas fa-arrow-${growthRate.isPositive ? 'up' : 'down'} mr-1`}></i>
                      {Math.abs(growthRate.value)}%
                  </span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
                  <i className="fas fa-shopping-cart text-green-600 dark:text-green-400 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Doanh thu trung bình tháng</p>
                  <div className="flex items-baseline">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {loading ? 'Loading...' : formatRevenue(averageMonthlyRevenue )}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
                  <i className="fas fa-box text-purple-600 dark:text-purple-400 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tổng sản phẩm đã bán</p>
                  <div className="flex items-baseline">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalProducts}</h2>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
                  <i className="fas fa-users text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tổng khách hàng đã mua</p>
                  <div className="flex items-baseline">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCustomers}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Biểu đồ doanh thu</h2>
                  <div className="flex space-x-2">
                    {timeFilter === 'custom' ? (
                        <div className="flex space-x-2">
                          <DatePicker
                              selected={dateRange.startDate}
                              onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                              dateFormat="dd/MM/yyyy"
                              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <span className="text-gray-500 dark:text-gray-300">-</span>
                          <DatePicker
                              selected={dateRange.endDate}
                              onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                              dateFormat="dd/MM/yyyy"
                              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                    ) : (
                        <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <i className="fas fa-calendar-alt mr-2"></i>
                          {format(dateRange.startDate, 'dd/MM/yyyy')} - {format(dateRange.endDate, 'dd/MM/yyyy')}
                        </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div id="revenue-chart" style={{ width: '100%', height: '400px' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Phân tích sản phẩm</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div>
                    <div id="product-pie-chart" style={{ width: '100%', height: '300px' }}></div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">Top 5 sản phẩm bán chạy</h3>
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Sản phẩm
                          </th>
                          <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            SL
                          </th>
                          <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Doanh thu
                          </th>
                          <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Tăng trưởng
                          </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {topProducts.map((product, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {product.name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {product.quantity.toLocaleString()}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {formatRevenue(product.revenue )}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                                {product.growth ? `+${product.growth}%` : 'N/A'}
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Phân tích khách hàng</h2>
                </div>
                <div className="p-6">
                  <div id="customer-bar-chart" style={{ width: '100%', height: '300px' }}></div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mt-6 mb-4">Khách hàng VIP</h3>
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Khách hàng
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Giá trị
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Đơn hàng
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Sản phẩm ưa thích
                        </th>
                      </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {topCustomers.map((customer, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              {customer.name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {formatRevenue(customer.revenue )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {customer.orders.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {customer.favoriteProduct}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

export default App;