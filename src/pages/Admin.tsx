
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminSidebar from "@/components/AdminSidebar";
import AdminDashboardStats from "@/components/AdminDashboardStats";

const Admin = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();

  if (authLoading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-primary hover:underline"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">Welcome To Admin Panel</p>
        </div>
        
        <AdminDashboardStats />
        
        <div className="admin-main-content">
          <div className="text-center text-gray-600">
            <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
            <p>Use the sidebar to navigate to different sections.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
