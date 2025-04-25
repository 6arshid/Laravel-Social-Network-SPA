import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function StatisticsChart({ daily, monthly, yearly, total }) {
    return (
        <div className="p-6">

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Daily Views</h2>
                <LineChart width={700} height={300} data={daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" />
                </LineChart>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Monthly Views</h2>
                <LineChart width={700} height={300} data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                </LineChart>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Yearly Views</h2>
                <LineChart width={700} height={300} data={yearly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#ffc658" />
                </LineChart>
            </div>

            <div className="text-lg mt-8">
                <strong>Total Views:</strong> {total}
            </div>
        </div>
    );
}
