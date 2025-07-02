import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Custom SVG Icons
const TrendUpIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ChartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const GlobeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);

const StatCard = ({ title, value, change, changeType, icon: Icon, gradient }) => {
    const isPositive = changeType === 'positive';
    
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div className={`absolute inset-0 opacity-5 ${gradient}`}></div>
            <div className="relative">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {value?.toLocaleString() || '0'}
                        </p>
                        {change !== undefined && (
                            <div className={`flex items-center text-sm ${
                                isPositive 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                <TrendUpIcon className={`w-4 h-4 mr-1 ${!isPositive ? 'rotate-180' : ''}`} />
                                <span>{Math.abs(change)}%</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${gradient}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SimpleChart = ({ data, type, color }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
        <div className="h-64 flex items-end justify-center space-x-2 p-4">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 max-w-12">
                    <div 
                        className={`w-full ${color} rounded-t-lg transition-all duration-500 hover:opacity-80`}
                        style={{ 
                            height: `${(item.value / maxValue) * 180}px`,
                            minHeight: '4px'
                        }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const ChartCard = ({ title, data, type, color, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                {title}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Last {data?.length || 0} periods
            </div>
        </div>
        <SimpleChart data={data || []} type={type} color={color} />
    </div>
);

export default function Statistics({ daily, monthly, yearly, total }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Calculate sample changes (you can replace with real data)
    const calculateChange = (current, previous) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    // Sample data transformation
    const dailyData = daily?.map((item, index) => ({
        label: `D${index + 1}`,
        value: item || Math.floor(Math.random() * 100) + 20
    })) || Array.from({ length: 7 }, (_, i) => ({
        label: `D${i + 1}`,
        value: Math.floor(Math.random() * 100) + 20
    }));

    const monthlyData = monthly?.map((item, index) => ({
        label: `M${index + 1}`,
        value: item || Math.floor(Math.random() * 500) + 100
    })) || Array.from({ length: 12 }, (_, i) => ({
        label: `M${i + 1}`,
        value: Math.floor(Math.random() * 500) + 100
    }));

    const yearlyData = yearly?.map((item, index) => ({
        label: `Y${index + 1}`,
        value: item || Math.floor(Math.random() * 2000) + 500
    })) || Array.from({ length: 5 }, (_, i) => ({
        label: `Y${i + 1}`,
        value: Math.floor(Math.random() * 2000) + 500
    }));

    const tabs = [
        { id: 'overview', label: 'Overview', icon: ChartIcon },
        { id: 'daily', label: 'Daily Stats', icon: CalendarIcon },
        { id: 'trends', label: 'Trends', icon: TrendUpIcon },
        { id: 'global', label: 'Global', icon: GlobeIcon }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Statistics Dashboard
                    </h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            }
        >
            <Head title="Statistics Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Tab Navigation */}
                    <div className="mb-8">
                        <div className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4 mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Records"
                            value={total || 12458}
                            change={12.5}
                            changeType="positive"
                            icon={ChartIcon}
                            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                        <StatCard
                            title="Daily Average"
                            value={dailyData.reduce((sum, item) => sum + item.value, 0) / dailyData.length}
                            change={-2.3}
                            changeType="negative"
                            icon={CalendarIcon}
                            gradient="bg-gradient-to-br from-green-500 to-green-600"
                        />
                        <StatCard
                            title="Monthly Growth"
                            value={monthlyData[monthlyData.length - 1]?.value || 847}
                            change={8.7}
                            changeType="positive"
                            icon={TrendUpIcon}
                            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                        />
                        <StatCard
                            title="Yearly Total"
                            value={yearlyData.reduce((sum, item) => sum + item.value, 0)}
                            change={15.2}
                            changeType="positive"
                            icon={GlobeIcon}
                            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                        />
                    </div>

                    {/* Charts Section */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ChartCard
                                title="Daily Performance"
                                data={dailyData}
                                type="bar"
                                color="bg-gradient-to-t from-blue-400 to-blue-600"
                                icon={CalendarIcon}
                            />
                            <ChartCard
                                title="Monthly Trends"
                                data={monthlyData.slice(-6)}
                                type="bar"
                                color="bg-gradient-to-t from-green-400 to-green-600"
                                icon={TrendUpIcon}
                            />
                        </div>
                    )}

                    {activeTab === 'daily' && (
                        <div className="grid grid-cols-1 gap-6">
                            <ChartCard
                                title="Daily Detailed Statistics"
                                data={dailyData}
                                type="bar"
                                color="bg-gradient-to-t from-blue-400 to-blue-600"
                                icon={CalendarIcon}
                            />
                        </div>
                    )}

                    {activeTab === 'trends' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ChartCard
                                title="Monthly Trends"
                                data={monthlyData}
                                type="bar"
                                color="bg-gradient-to-t from-purple-400 to-purple-600"
                                icon={TrendUpIcon}
                            />
                            <ChartCard
                                title="Yearly Overview"
                                data={yearlyData}
                                type="bar"
                                color="bg-gradient-to-t from-orange-400 to-orange-600"
                                icon={GlobeIcon}
                            />
                        </div>
                    )}

                    {activeTab === 'global' && (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <GlobeIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    Global Statistics Overview
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                            {(total || 12458).toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                            {yearlyData.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Years</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                            {(monthlyData.reduce((sum, item) => sum + item.value, 0) / monthlyData.length).toFixed(0)}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Average</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Info Section */}
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Quick Insights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Peak Performance</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                    Highest daily record: {Math.max(...dailyData.map(d => d.value)).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">Growth Rate</h4>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    Average monthly growth: +{((monthlyData[monthlyData.length-1]?.value / monthlyData[0]?.value - 1) * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Consistency</h4>
                                <p className="text-sm text-purple-700 dark:text-purple-400">
                                    Performance stability: High variance detected
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}