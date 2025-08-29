import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ShoppingCart, Users, Package, TrendingUp, DollarSign, Calendar, Clock, CheckCircle, AlertCircle, XCircle, Truck, PackageX } from 'lucide-react';
import axios from 'axios';
import { API } from '../constant';
import { FaRupeeSign } from 'react-icons/fa';

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      deliveredOrders: 0,
      pendingOrders: 0,
      acceptedOrders: 0,
      preparingOrders: 0,
      shippedOrders: 0,
      cancelledOrders: 0,
      todayRevenue: 0,
      todayOrders: 0
    },
    chartData: {
      daily: [],
      weekly: [],
      monthly: []
    },
    orderStatusData: [],
    recentOrders: []
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all required data
      const [ordersRes, usersRes, statsRes] = await Promise.all([
        axios.get(`${API}/order/admin/all?limit=100`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get(`${API}/order/admin/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get(`${API}/order/admin/stats?timeframe=30`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
      ]);

      const orders = ordersRes.data.orders || [];
      const users = usersRes.data.users || [];
      const stats = statsRes.data.stats || {};

      // Process order statistics
      const orderStats = processOrderStats(orders);
      const chartData = generateChartData(orders);
      const orderStatusData = generateStatusData(orders);

      setDashboardData({
        stats: {
          totalRevenue: orderStats.totalRevenue,
          totalOrders: orders.length,
          totalUsers: users.length,
          deliveredOrders: orderStats.delivered,
          pendingOrders: orderStats.pending,
          acceptedOrders: orderStats.accepted,
          preparingOrders: orderStats.preparing,
          shippedOrders: orderStats.shipped,
          cancelledOrders: orderStats.cancelled,
          todayRevenue: orderStats.todayRevenue,
          todayOrders: orderStats.todayOrders
        },
        chartData,
        orderStatusData,
        recentOrders: orders.slice(0, 5)
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if order should contribute to revenue
  const isRevenueEligible = (status) => {
    const eligibleStatuses = ['pending', 'accepted', 'preparing', 'shipped', 'delivered'];
    return eligibleStatuses.includes(status.toLowerCase());
  };

  // Process order statistics with proper revenue calculation
  const processOrderStats = (orders) => {
    const today = new Date().toDateString();
    let stats = {
      totalRevenue: 0,
      delivered: 0,
      pending: 0,
      accepted: 0,
      preparing: 0,
      shipped: 0,
      cancelled: 0,
      todayRevenue: 0,
      todayOrders: 0
    };

    orders.forEach(order => {
      // Only count revenue from non-cancelled orders
      if (isRevenueEligible(order.status)) {
        stats.totalRevenue += order.total;
      }

      // Count by status
      switch (order.status.toLowerCase()) {
        case 'delivered': stats.delivered++; break;
        case 'pending': stats.pending++; break;
        case 'accepted': stats.accepted++; break;
        case 'preparing': stats.preparing++; break;
        case 'shipped': stats.shipped++; break;
        case 'cancelled': stats.cancelled++; break;
      }

      // Today's stats - only count revenue from eligible orders
      if (new Date(order.createdAt).toDateString() === today) {
        if (isRevenueEligible(order.status)) {
          stats.todayRevenue += order.total;
        }
        stats.todayOrders++;
      }
    });

    return stats;
  };

  // Generate chart data for different timeframes
  const generateChartData = (orders) => {
    const daily = generateDailyData(orders);
    const weekly = generateWeeklyData(orders);
    const monthly = generateMonthlyData(orders);

    return { daily, weekly, monthly };
  };

  const generateDailyData = (orders) => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();

      const dayOrders = orders.filter(order =>
        new Date(order.createdAt).toDateString() === dateString
      );

      // Calculate revenue only from eligible orders
      const dayRevenue = dayOrders
        .filter(order => isRevenueEligible(order.status))
        .reduce((sum, order) => sum + order.total, 0);

      const dayCancelled = dayOrders.filter(order => order.status.toLowerCase() === 'cancelled').length;

      data.push({
        date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        revenue: dayRevenue,
        orders: dayOrders.length,
        eligibleOrders: dayOrders.filter(order => isRevenueEligible(order.status)).length,
        cancelledOrders: dayCancelled
      });
    }

    return data;
  };

  const generateWeeklyData = (orders) => {
    const data = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekStart && orderDate <= weekEnd;
      });

      // Calculate revenue only from eligible orders
      const weekRevenue = weekOrders
        .filter(order => isRevenueEligible(order.status))
        .reduce((sum, order) => sum + order.total, 0);

      const weekCancelled = weekOrders.filter(order => order.status.toLowerCase() === 'cancelled').length;

      data.push({
        week: `Week ${12 - i}`,
        revenue: weekRevenue,
        orders: weekOrders.length,
        eligibleOrders: weekOrders.filter(order => isRevenueEligible(order.status)).length,
        cancelledOrders: weekCancelled
      });
    }

    return data;
  };

  const generateMonthlyData = (orders) => {
    const data = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= month && orderDate <= nextMonth;
      });

      // Calculate revenue only from eligible orders
      const monthRevenue = monthOrders
        .filter(order => isRevenueEligible(order.status))
        .reduce((sum, order) => sum + order.total, 0);

      const monthCancelled = monthOrders.filter(order => order.status.toLowerCase() === 'cancelled').length;

      data.push({
        month: month.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        orders: monthOrders.length,
        eligibleOrders: monthOrders.filter(order => isRevenueEligible(order.status)).length,
        cancelledOrders: monthCancelled
      });

    }

    return data;
  };

  // Generate order status pie chart data
  const generateStatusData = (orders) => {
    const statusCounts = {
      'Accepted': 0,
      'Preparing': 0,
      'Shipped': 0,
      'Delivered': 0,
      'Cancelled': 0,
      'Pending': 0
    };

    orders.forEach(order => {
      const status = order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });

    const colors = {
      'Accepted': '#F59E0B',
      'Preparing': '#3B82F6',
      'Shipped': '#8B5CF6',
      'Delivered': '#10B981',
      'Cancelled': '#EF4444',
      'Pending': '#6B7280'
    };

    return Object.entries(statusCounts)
      .filter(([status, count]) => count > 0)
      .map(([status, count]) => ({
        name: status,
        value: count,
        color: colors[status]
      }));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getCurrentData = () => {
    return dashboardData.chartData[timeframe] || [];
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue", subtitle }) => {
    const colorClasses = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50",
      green: "bg-green-500 text-green-600 bg-green-50",
      yellow: "bg-yellow-500 text-yellow-600 bg-yellow-50",
      red: "bg-red-500 text-red-600 bg-red-50",
      purple: "bg-purple-500 text-purple-600 bg-purple-50",
      orange: "bg-orange-500 text-orange-600 bg-orange-50",
      gray: "bg-gray-500 text-gray-600 bg-gray-50"
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[2]}`}>
            <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
          </div>
          {trend && (
            <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {trendValue}%
            </div>
          )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Jharokha Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Main Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            // value={`₹${(dashboardData.stats.totalRevenue / 100000).toFixed(1)}L`}
            value={`₹${(dashboardData.stats.totalRevenue).toFixed(1)}`}
            icon={FaRupeeSign}
            color="green"
            subtitle="Excluding cancelled orders only"
          />
          <StatCard
            title="Total Orders"
            value={dashboardData.stats.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={dashboardData.stats.totalUsers.toLocaleString()}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Delivered Orders"
            value={dashboardData.stats.deliveredOrders.toLocaleString()}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Pending"
            value={dashboardData.stats.pendingOrders}
            icon={Clock}
            color="gray"
          />
          <StatCard
            title="Accepted"
            value={dashboardData.stats.acceptedOrders}
            icon={AlertCircle}
            color="yellow"
          />
          <StatCard
            title="Preparing"
            value={dashboardData.stats.preparingOrders}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Shipped"
            value={dashboardData.stats.shippedOrders}
            icon={Truck}
            color="purple"
          />
          <StatCard
            title="Delivered"
            value={dashboardData.stats.deliveredOrders}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Cancelled"
            value={dashboardData.stats.cancelledOrders}
            icon={XCircle}
            color="red"
          />
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Today's Revenue"
            value={`₹${dashboardData.stats.todayRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="green"
            subtitle="Excluding cancelled orders only"
          />
          <StatCard
            title="Today's Orders"
            value={dashboardData.stats.todayOrders}
            icon={Calendar}
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Revenue Overview
                <span className="text-sm text-gray-500 block">Excludes cancelled orders only</span>
              </h2>
              <div className="flex gap-2">
                {['daily', 'weekly', 'monthly'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${timeframe === period
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeframe === 'monthly' ? 'month' : timeframe === 'weekly' ? 'week' : 'date'} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue (Valid Orders)' : 'Total Orders'
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#EC4899" fill="#EC489950" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Orders Overview</h2>
              <span className="text-sm text-gray-500">Stacked view: Green (Revenue Contributing) + Red (Cancelled) = Total</span>
            </div>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${timeframe === period
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={timeframe === 'monthly' ? 'month' : timeframe === 'weekly' ? 'week' : 'date'} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const labels = {
                    'eligibleOrders': 'Revenue Contributing Orders',
                    'cancelledOrders': 'Cancelled Orders'
                  };
                  return [value, labels[name] || name];
                }}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="eligibleOrders"
                fill="#10B981"
                name="Revenue Contributing"
                stackId="stack"
              />
              <Bar
                dataKey="cancelledOrders"
                fill="#EF4444"
                name="Cancelled"
                stackId="stack"
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {getCurrentData().reduce((sum, item) => sum + item.orders, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {getCurrentData().reduce((sum, item) => sum + item.eligibleOrders, 0)}
              </p>
              <p className="text-sm text-gray-500">Revenue Contributing</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {getCurrentData().reduce((sum, item) => sum + (item.cancelledOrders || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Cancelled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {((getCurrentData().reduce((sum, item) => sum + item.eligibleOrders, 0) /
                  Math.max(getCurrentData().reduce((sum, item) => sum + item.orders, 0), 1)) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.fullName || order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Accepted' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${isRevenueEligible(order.status)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {isRevenueEligible(order.status) ? 'Counts' : 'Excluded'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;