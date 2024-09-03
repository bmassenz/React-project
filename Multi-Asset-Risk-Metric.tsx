import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
// Mock data and functions (replace with actual API calls and data processing)
const mockHistoricalData = [...Array(100)].map((_, i) => ({
date: new Date(2020, 0, i + 1).toISOString().split('T')[0],
btcPrice: 30000 + Math.random() * 10000,
ethPrice: 2000 + Math.random() * 1000,
bnbPrice: 300 + Math.random() * 100,
portfolioValue: 100000 + Math.random() * 20000,
}));
const calculateRisk = (asset, price, volume, activeAddresses, gasPrice, marketCap, dominance, sentiment) => {
// Simplified risk calculation (replace with actual logic from Pine Script)
return Math.random() * 100;
};
const RiskMetricDashboard = () => {
const [settings, setSettings] = useState({
backtest: { start: '2020-01-01', end: '2024-01-01' },
assets: { btc: true, eth: true, bnb: true },
riskThresholds: { low: 20, medium: 40, high: 60, veryHigh: 80 },
ml: { use: true, lookback: 100, horizon: 10 },
riskManagement: { atrPeriod: 14, riskPerTrade: 1, stopLossMultiple: 2 },
});
const [portfolioMetrics, setPortfolioMetrics] = useState({
value: 0,
totalReturn: 0,
annualizedReturn: 0,
sharpeRatio: 0,
maxDrawdown: 0,
});
const [assetRisks, setAssetRisks] = useState({ btc: 0, eth: 0, bnb: 0 });
useEffect(() => {
// Simulate API call and data processing
const lastDataPoint = mockHistoricalData[mockHistoricalData.length - 1];
setPortfolioMetrics({
value: lastDataPoint.portfolioValue.toFixed(2),
totalReturn: ((lastDataPoint.portfolioValue - 100000) / 100000 * 100).toFixed(2),
annualizedReturn: (Math.pow(lastDataPoint.portfolioValue / 100000, 365 / mockHistoricalData.length) - 1).toFixed(2),
sharpeRatio: ((Math.pow(lastDataPoint.portfolioValue / 100000, 365 / mockHistoricalData.length) - 1 - 0.02) / 0.2).toFixed(2),
maxDrawdown: (Math.max(...mockHistoricalData.map(d => d.portfolioValue)) - lastDataPoint.portfolioValue) / Math.max(...mockHistoricalData.map(d => d.portfolioValue)) * 100,
});
setAssetRisks({
btc: calculateRisk('btc', lastDataPoint.btcPrice, 1000000, 1000000, 0, 1000000000000, 60, 0.6),
eth: calculateRisk('eth', lastDataPoint.ethPrice, 500000, 500000, 50, 500000000000, 20, 0.7),
bnb: calculateRisk('bnb', lastDataPoint.bnbPrice, 100000, 100000, 0, 100000000000, 5, 0.5),
});
}, [settings]);
const handleSettingChange = (category, setting, value) => {
setSettings(prev => ({
...prev,
[category]: { ...prev[category], [setting]: value },
}));
};
return (
<div className="p-4 max-w-7xl mx-auto">
<h1 className="text-3xl font-bold mb-6">Enhanced Multi-Asset Risk Metric Strategy Dashboard</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<Card>
<CardHeader>Settings</CardHeader>
<CardContent>
<div className="space-y-4">
<div>
<h3 className="font-semibold">Backtest Period</h3>
<div className="flex space-x-2">
<Input
type="date"
value={settings.backtest.start}
onChange={(e) => handleSettingChange('backtest', 'start', e.target.value)}
/>
<Input
type="date"
value={settings.backtest.end}
onChange={(e) => handleSettingChange('backtest', 'end', e.target.value)}
/>
</div>
</div>
<div>
<h3 className="font-semibold">Assets</h3>
<div className="flex space-x-4">
{['btc', 'eth', 'bnb'].map(asset => (
<div key={asset} className="flex items-center space-x-2">
<Switch
checked={settings.assets[asset]}
onCheckedChange={(checked) => handleSettingChange('assets', asset, checked)}
/>
<span className="uppercase">{asset}</span>
</div>
))}
</div>
</div>
<div>
<h3 className="font-semibold">Risk Thresholds</h3>
{['low', 'medium', 'high', 'veryHigh'].map(threshold => (
<div key={threshold} className="flex items-center space-x-2">
<span className="capitalize">{threshold}:</span>
<Slider
value={[settings.riskThresholds[threshold]]}
min={0}
max={100}
step={1}
onValueChange={(value) => handleSettingChange('riskThresholds', threshold, value[0])}
/>
<span>{settings.riskThresholds[threshold]}%</span>
</div>
))}
</div>
<div>
<h3 className="font-semibold">Machine Learning</h3>
<div className="flex items-center space-x-2">
<Switch
checked={settings.ml.use}
onCheckedChange={(checked) => handleSettingChange('ml', 'use', checked)}
/>
<span>Use ML Predictions</span>
</div>
<div className="flex space-x-2">
<Input
type="number"
value={settings.ml.lookback}
onChange={(e) => handleSettingChange('ml', 'lookback', parseInt(e.target.value))}
min={50}
max={500}
/>
<span>Lookback Period</span>
</div>
<div className="flex space-x-2">
<Input
type="number"
value={settings.ml.horizon}
onChange={(e) => handleSettingChange('ml', 'horizon', parseInt(e.target.value))}
min={1}
max={30}
/>
<span>Prediction Horizon</span>
</div>
</div>
<div>
<h3 className="font-semibold">Risk Management</h3>
<div className="flex space-x-2">
<Input
type="number"
value={settings.riskManagement.atrPeriod}
onChange={(e) => handleSettingChange('riskManagement', 'atrPeriod', parseInt(e.target.value))}
min={1}
max={50}
/>
<span>ATR Period</span>
</div>
<div className="flex space-x-2">
<Input
type="number"
value={settings.riskManagement.riskPerTrade}
onChange={(e) => handleSettingChange('riskManagement', 'riskPerTrade', parseFloat(e.target.value))}
min={0.1}
max={5}
step={0.1}
/>
<span>Risk Per Trade (%)</span>
</div>
<div className="flex space-x-2">
<Input
type="number"
value={settings.riskManagement.stopLossMultiple}
onChange={(e) => handleSettingChange('riskManagement', 'stopLossMultiple', parseFloat(e.target.value))}
min={0.5}
max={5}
step={0.1}
/>
<span>Stop Loss ATR Multiple</span>
</div>
</div>
</div>
</CardContent>
</Card>
<Card>
<CardHeader>Portfolio Metrics</CardHeader>
<CardContent>
<div className="space-y-2">
<p>Portfolio Value: ${portfolioMetrics.value}</p>
<p>Total Return: {portfolioMetrics.totalReturn}%</p>
<p>Annualized Return: {portfolioMetrics.annualizedReturn}%</p>
<p>Sharpe Ratio: {portfolioMetrics.sharpeRatio}</p>
<p>Max Drawdown: {portfolioMetrics.maxDrawdown.toFixed(2)}%</p>
</div>
</CardContent>
</Card>
</div>
<Card className="mb-6">
<CardHeader>Asset Risk Levels</CardHeader>
<CardContent>
<div className="flex justify-around">
{Object.entries(assetRisks).map(([asset, risk]) => (
<div key={asset} className="text-center">
<h3 className="font-semibold uppercase">{asset}</h3>
<p className="text-2xl">{risk.toFixed(2)}%</p>
<p className="text-sm">
{risk < settings.riskThresholds.low && 'Low Risk'}
{risk >= settings.riskThresholds.low && risk < settings.riskThresholds.medium && 'Medium Risk'}
{risk >= settings.riskThresholds.medium && risk < settings.riskThresholds.high && 'High Risk'}
{risk >= settings.riskThresholds.high && 'Very High Risk'}
</p>
</div>
))}
</div>
</CardContent>
</Card>
<Card>
<CardHeader>Portfolio Performance</CardHeader>
<CardContent>
<ResponsiveContainer width="100%" height={300}>
<LineChart data={mockHistoricalData}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<Legend />
<Line type="monotone" dataKey="portfolioValue" stroke="#8884d8" name="Portfolio Value" />
</LineChart>
</ResponsiveContainer>
</CardContent>
</Card>
<Alert className="mt-6">
<AlertDescription>
This is a simulated dashboard. In a real-world scenario, you would integrate with actual cryptocurrency data APIs, implement the full strategy logic, and use real-time data for calculations.
</AlertDescription>
</Alert>
</div>
);
};
export default RiskMetricDashboard;