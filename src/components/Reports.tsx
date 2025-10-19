import React, { useMemo } from 'react';
import type { Transaction } from '../types';
import BarChart from './charts/BarChart';
import DoughnutChart from './charts/DoughnutChart';
import { generateReportPdf } from '../services/pdfService';
import { DownloadIcon } from './icons';

interface ReportsProps {
    transactions: Transaction[];
    currency: string;
}

const ReportCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-surface p-6 rounded-xl border border-slate-700/50 flex flex-col ${className}`}>
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
        <div className="flex-grow flex flex-col justify-center">{children}</div>
    </div>
);

const Reports: React.FC<ReportsProps> = ({ transactions, currency }) => {
    const reportId = "financial-report-container";

    const { totalIncome, totalExpenses, spendingByCategory, monthlyData } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + Number(t.amount), 0);
        const expenses = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Number(t.amount), 0);

        const categoryMap = transactions.filter(t => t.type === 'debit').reduce((acc, t) => {
            const key = t.category || 'Uncategorized';
            acc[key] = (acc[key] || 0) + Number(t.amount);
            return acc;
        }, {} as Record<string, number>);
        
        const sortedCategories = Object.entries(categoryMap).sort(([, a], [, b]) => b - a).slice(0, 5);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlySummary = { labels: months, income: Array(12).fill(0), expenses: Array(12).fill(0) };
        
        transactions.forEach(t => {
            const date = new Date(t.date);
            if (!isNaN(date.getTime())) {
                const month = date.getMonth();
                t.type === 'credit' ? monthlySummary.income[month] += Number(t.amount) : monthlySummary.expenses[month] += Number(t.amount);
            }
        });

        return { totalIncome: income, totalExpenses: expenses, spendingByCategory: sortedCategories, monthlyData: monthlySummary };
    }, [transactions]);
    
    const handleDownload = () => generateReportPdf(reportId);

    const topSpendingLabels = spendingByCategory.map(([name]) => name);
    const topSpendingData = spendingByCategory.map(([, amount]) => Number(amount));
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Financial Reports</h1>
                 <button 
                    onClick={handleDownload}
                    disabled={transactions.length === 0}
                    className="flex items-center space-x-2 bg-secondary/20 text-secondary font-semibold py-2 px-4 rounded-lg hover:bg-secondary/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <DownloadIcon />
                    <span>Download Report PDF</span>
                </button>
            </div>
            <div id={reportId} className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-background p-4 -m-4 rounded-lg">
                <ReportCard title="Income vs. Expenses">
                    <div className="h-80">
                        <BarChart
                            labels={monthlyData.labels}
                            datasets={[
                                { label: 'Income', data: monthlyData.income, backgroundColor: 'rgba(16, 185, 129, 0.6)' },
                                { label: 'Expenses', data: monthlyData.expenses, backgroundColor: 'rgba(239, 68, 68, 0.6)' }
                            ]}
                        />
                    </div>
                </ReportCard>
                
                <ReportCard title="Top Spending Categories">
                    {spendingByCategory.length > 0 ? (
                        <div className="h-80 flex items-center justify-center">
                            <DoughnutChart labels={topSpendingLabels} data={topSpendingData} />
                        </div>
                    ) : (
                        <p className="text-center text-text-muted py-16">No spending data available for this period.</p>
                    )}
                </ReportCard>

                <ReportCard title="Overall Breakdown" className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center py-8">
                         <div>
                            <p className="text-sm text-text-muted">Total Income</p>
                            <p className="text-2xl md:text-3xl font-bold text-primary-light mt-1">{currency}{totalIncome.toFixed(2)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-text-muted">Total Expenses</p>
                            <p className="text-2xl md:text-3xl font-bold text-danger mt-1">{currency}{totalExpenses.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Net Flow</p>
                            <p className={`text-2xl md:text-3xl font-bold mt-1 ${totalIncome - totalExpenses >= 0 ? 'text-primary' : 'text-danger'}`}>
                                {currency}{(totalIncome - totalExpenses).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </ReportCard>
            </div>
        </div>
    );
};

export default Reports;
