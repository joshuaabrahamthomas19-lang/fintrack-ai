import React, { useMemo } from 'react';
import type { Goal, Budget, UserData } from '../types';
import { UploadCloudIcon, ArrowUpIcon, ArrowDownIcon } from './icons';

interface DashboardProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  onSetBudget: () => void;
  onAddGoal: () => void;
  onAddToSavings: () => void;
  onEditBalance: () => void;
  onFundGoal: (goal: Goal) => void;
  onUploadClick: () => void;
}

const StatCard: React.FC<{ title: string; value: string; children?: React.ReactNode; className?: string }> = ({ title, value, children, className }) => (
  <div className={`bg-surface p-6 rounded-xl border border-slate-700/50 flex flex-col justify-between ${className}`}>
    <div>
        <h3 className="text-sm font-medium text-text-muted">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold text-text-primary mt-2">{value}</p>
    </div>
    {children}
  </div>
);

const WelcomeCard: React.FC<{ onUploadClick: () => void }> = ({ onUploadClick }) => (
    <div className="bg-surface p-8 rounded-xl border border-slate-700/50 text-center col-span-1 lg:col-span-2">
        <h2 className="text-2xl font-bold text-text-primary">Welcome to FinTrack AI!</h2>
        <p className="text-text-secondary mt-2 mb-6 max-w-xl mx-auto">Get started by importing your SMS transaction history. Our AI will automatically categorize and analyze your spending.</p>
        <button
            onClick={onUploadClick}
            className="bg-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-primary-dark transition-colors text-base flex items-center justify-center space-x-2 mx-auto"
        >
            <UploadCloudIcon />
            <span>Import SMS File</span>
        </button>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ userData, onSetBudget, onAddGoal, onAddToSavings, onEditBalance, onFundGoal, onUploadClick }) => {
  const { currency, transactions, totalBalance, savings, goals, budget } = userData;

  const { monthlySpending, usableBalance, effectiveDailyLimit, dailySpending } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    const daily = transactions.filter(t => t.date === todayStr && t.type === 'debit' && !t.excludeFromBudget).reduce((sum, t) => sum + t.amount, 0);
    const monthly = transactions.filter(t => t.date >= monthStart && t.type === 'debit' && !t.excludeFromBudget).reduce((sum, t) => sum + t.amount, 0);
    const totalGoalAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const usable = totalBalance - savings - totalGoalAmount;

    let dailyLimit = 0;
    if (budget.type === 'monthly' && budget.limit > 0) {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const daysPassed = Math.ceil((now.getTime() - startOfMonth.getTime()) / (1000 * 3600 * 24));
        const remainingBudget = budget.limit - monthly;
        const daysRemaining = daysInMonth - daysPassed + 1;
        dailyLimit = daysRemaining > 0 ? remainingBudget / daysRemaining : 0;
    } else if (budget.type === 'daily') {
        dailyLimit = budget.limit;
    }
    return { dailySpending: daily, monthlySpending: monthly, usableBalance: usable, effectiveDailyLimit: dailyLimit };
  }, [transactions, totalBalance, savings, goals, budget]);

  if (transactions.length === 0) {
      return <WelcomeCard onUploadClick={onUploadClick} />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats */}
        <StatCard title="Total Account Balance" value={`${currency}${totalBalance.toFixed(2)}`}>
            <button onClick={onEditBalance} className="mt-4 text-sm text-secondary hover:text-secondary-light font-medium text-left">Edit Balance</button>
        </StatCard>
        <StatCard title="Usable Balance" value={`${currency}${usableBalance.toFixed(2)}`}/>
        <StatCard title="Total Savings" value={`${currency}${savings.toFixed(2)}`}>
            <button onClick={onAddToSavings} className="mt-4 w-full bg-primary/20 text-primary-light font-semibold py-2 rounded-lg hover:bg-primary/30 transition-colors">Add to Savings</button>
        </StatCard>

        {/* Budget Card */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Budget Overview</h3>
                <button onClick={onSetBudget} className="text-secondary hover:text-secondary-light font-medium text-sm">Edit Budget</button>
            </div>
            {budget.type === 'monthly' ? (
                <>
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Monthly Spending</span>
                            <span>{currency}{monthlySpending.toFixed(2)} of {currency}{budget.limit.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2.5"><div className="bg-secondary h-2.5 rounded-full" style={{width: `${Math.min((monthlySpending/budget.limit)*100, 100)}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Today's Guideline</span>
                             <span>{currency}{dailySpending.toFixed(2)} of ~{currency}{effectiveDailyLimit > 0 ? effectiveDailyLimit.toFixed(2) : '0.00' }</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2.5"><div className="bg-warning h-2.5 rounded-full" style={{width: `${effectiveDailyLimit > 0 ? Math.min((dailySpending/effectiveDailyLimit)*100, 100) : 0}%`}}></div></div>
                    </div>
                </>
            ) : (
                <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span>Daily Spending</span>
                        <span>{currency}{dailySpending.toFixed(2)} of {currency}{budget.limit.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2.5"><div className="bg-warning h-2.5 rounded-full" style={{width: `${Math.min((dailySpending/budget.limit)*100, 100)}%`}}></div></div>
                </div>
            )}
        </div>

        {/* Goals Card */}
        <div className="lg:col-span-1 bg-surface p-6 rounded-xl border border-slate-700/50 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Goals</h3>
                <button onClick={onAddGoal} className="text-secondary hover:text-secondary-light font-medium text-sm">New Goal</button>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto">
                {goals.length > 0 ? goals.map(goal => {
                    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                    return (
                        <div key={goal.id}>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="font-medium">{goal.name}</span>
                                <button onClick={() => onFundGoal(goal)} className="text-secondary/80 text-xs font-bold">ADD</button>
                            </div>
                            <div className="w-full bg-background rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{width: `${progress}%`}}></div></div>
                            <div className="text-xs text-text-muted text-right mt-1">{currency}{goal.currentAmount.toFixed(2)} / {currency}{goal.targetAmount.toFixed(2)}</div>
                        </div>
                    )
                }) : <p className="text-center text-text-muted text-sm pt-8">No goals yet. Add one to start saving!</p>}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;