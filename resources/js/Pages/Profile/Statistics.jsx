import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Head } from '@inertiajs/react';

export default function Statistics({ daily, monthly, yearly, total }) {
    return (
        <div className="p-8">
            <Head title="Statistics" />
            <h1 className="text-3xl font-bold mb-6">Statistics</h1>

            <div className="mb-8">
                <h2 className="text-xl mb-4">Daily Views</h2>
                <LineChart width={800} height={400} data={daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-4">Monthly Views</h2>
                <LineChart width={800} height={400} data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                </LineChart>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-4">Yearly Views</h2>
                <LineChart width={800} height={400} data={yearly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#ffc658" />
                </LineChart>
            </div>

            <div className="text-xl mt-10">
                <strong>Total Views:</strong> {total}
            </div>
        </div>
    );
}
