import React, { useState } from 'react';
import { Card, StatCard } from '../ui/Card';
import { useProject } from '../../context/ProjectContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, CreditCard, FileText, TrendingDown, Check, X, AlertTriangle, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';

const expenseData = [
  { name: 'Week 1', amount: 12000 },
  { name: 'Week 2', amount: 19000 },
  { name: 'Week 3', amount: 15000 },
  { name: 'Week 4', amount: 24000 },
];

export const FinanceView: React.FC = () => {
  const { transactions, updateTransaction } = useProject();
  const [activeTab, setActiveTab] = useState<'overview' | 'budget'>('overview');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleTransaction = (id: string, action: 'Approve' | 'Reject') => {
    updateTransaction(id, action === 'Approve' ? 'Approved' : 'Rejected');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Control Center</h1>
            <p className="text-gray-500">Monitor budget utilization, approve expenses, and forecast costs.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('budget')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'budget' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
                Budget Planning
            </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Available Budget" value="$1.8M" icon={<DollarSign size={24} />} trend="12% Remaining" trendUp={false} />
            <StatCard label="Monthly Burn Rate" value="$145k" icon={<TrendingDown size={24} />} trend="Under Limit" trendUp={true} />
            <StatCard label="Pending Invoices" value={transactions.filter(t => t.status === 'Pending').length} icon={<FileText size={24} />} />
            <StatCard label="Corporate Card" value="$12,450" icon={<CreditCard size={24} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Monthly Expense Trend" className="lg:col-span-2">
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </Card>

            <Card title="Budget by Category">
            <div className="space-y-5">
                {[
                { name: 'Materials', val: 78, color: 'bg-blue-600' },
                { name: 'Labor', val: 65, color: 'bg-green-500' },
                { name: 'Services', val: 42, color: 'bg-purple-500' },
                { name: 'Logistics', val: 89, color: 'bg-orange-500' },
                ].map((cat) => (
                <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{cat.name}</span>
                    <span className="text-gray-500">{cat.val}% Used</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${cat.val}%` }}></div>
                    </div>
                </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600 flex items-start">
                <AlertTriangle className="text-orange-500 mr-2 flex-shrink-0" size={18} />
                <p><strong>Note:</strong> Logistics budget is reaching critical threshold. Please review upcoming shipment approvals.</p>
            </div>
            </Card>
        </div>

        <Card title="Transaction Approvals">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                <tr>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{t.description}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{t.category}</span></td>
                    <td className="px-6 py-4">{t.date}</td>
                    <td className="px-6 py-4 font-semibold">{formatCurrency(t.amount)}</td>
                    <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${t.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                            t.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'}`}>
                        {t.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        {t.status === 'Pending' ? (
                        <div className="flex justify-end space-x-2">
                            <button 
                            onClick={() => handleTransaction(t.id, 'Approve')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                            >
                            <Check size={18} />
                            </button>
                            <button 
                            onClick={() => handleTransaction(t.id, 'Reject')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                            >
                            <X size={18} />
                            </button>
                        </div>
                        ) : (
                        <span className="text-gray-400 text-xs">Closed</span>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </Card>
      </>
      ) : (
          <Card title="Budget Allocation Plan (FY 2024)">
              <div className="flex justify-end mb-4">
                  <button onClick={() => setIsBudgetModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm shadow hover:bg-blue-700">
                      <Plus size={16} className="mr-2" />
                      Add Allocation
                  </button>
              </div>
              <div className="space-y-4">
                  {[
                      { cat: 'Structural Materials', allocated: 2500000, spent: 1800000 },
                      { cat: 'Site Labor', allocated: 1200000, spent: 900000 },
                      { cat: 'Heavy Equipment', allocated: 800000, spent: 750000 },
                  ].map((item, i) => (
                      <div key={i} className="p-4 border border-gray-100 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-gray-800">{item.cat}</h4>
                              <span className="text-sm text-gray-500">{formatCurrency(item.spent)} / {formatCurrency(item.allocated)}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full ${item.spent/item.allocated > 0.9 ? 'bg-red-500' : 'bg-blue-600'}`} 
                                style={{width: `${(item.spent/item.allocated)*100}%`}}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>
              
              <Modal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} title="New Budget Allocation">
                  <div className="p-2 space-y-4">
                      <p className="text-gray-500 text-sm">Create a new budget category or add funds to existing one.</p>
                      <input type="text" placeholder="Category Name" className="w-full border p-2 rounded-lg" />
                      <input type="number" placeholder="Amount ($)" className="w-full border p-2 rounded-lg" />
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Create Allocation</button>
                  </div>
              </Modal>
          </Card>
      )}
    </div>
  );
};
