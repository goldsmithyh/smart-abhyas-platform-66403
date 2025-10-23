
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  totalPDFs: number;
  totalTransactions: number;
  todayPurchases: number;
  totalRevenue: number;
}

const AdminDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPDFs: 0,
    totalTransactions: 0,
    todayPurchases: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total papers count
        const { count: papersCount } = await supabase
          .from('papers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Get total transactions (all downloads)
        const { count: transactionsCount } = await supabase
          .from('download_logs')
          .select('*', { count: 'exact', head: true });

        // Get unique users count
        const { data: uniqueUsers } = await supabase
          .from('download_logs')
          .select('user_email')
          .order('user_email');

        const uniqueUserEmails = [...new Set(uniqueUsers?.map(u => u.user_email) || [])];

        // Get today's downloads
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: todayCount } = await supabase
          .from('download_logs')
          .select('*', { count: 'exact', head: true })
          .gte('downloaded_at', today.toISOString());

        // Calculate total revenue from successful payments
        const { data: payments } = await supabase
          .from('payment_transactions')
          .select('amount')
          .eq('status', 'success');

        const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

        setStats({
          totalPDFs: papersCount || 0,
          totalTransactions: transactionsCount || 0,
          totalUsers: uniqueUserEmails.length,
          todayPurchases: todayCount || 0,
          totalRevenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: 'fas fa-users',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total PDFs',
      value: stats.totalPDFs,
      icon: 'fas fa-file-pdf',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: 'fas fa-chart-bar',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: "Today's Purchases",
      value: stats.todayPurchases,
      icon: 'fas fa-shopping-cart',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: 'fas fa-indian-rupee-sign',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="dashboard-stats">
      {statCards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className={`stat-icon ${card.bgColor}`}>
            <i className={`${card.icon} ${card.color}`}></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{card.value}</h3>
            <p className="stat-title">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboardStats;
