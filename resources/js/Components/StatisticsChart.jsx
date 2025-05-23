import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTranslation } from 'react-i18next';

export default function StatisticsChart({ daily, monthly, yearly, total }) {
    const { t } = useTranslation();

    return (
        <div className="p-6">

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">{t('daily_views')}</h2>
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={daily}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="total" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">{t('monthly_views')}</h2>
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthly}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">{t('yearly_views')}</h2>
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={yearly}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="total" stroke="#ffc658" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="text-lg mt-8">
                <strong>{t('total_views')}:</strong> {total}
            </div>
        </div>
    );
}
