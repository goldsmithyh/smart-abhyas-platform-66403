
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { 
      icon: 'fas fa-tachometer-alt', 
      label: 'Dashboard', 
      path: '/admin',
      exact: true
    },
    { 
      icon: 'fas fa-file-pdf', 
      label: 'PDFs', 
      path: '/admin/pdfs',
      submenu: [
        { label: 'Add New', path: '/admin/add-new' },
        { label: 'All PDFs', path: '/admin/all-pdfs' }
      ]
    },
    { 
      icon: 'fas fa-rupee-sign', 
      label: 'Pricing', 
      path: '/admin/pricing'
    },
    { 
      icon: 'fas fa-users', 
      label: 'Users', 
      path: '/admin/users'
    },
    { 
      icon: 'fas fa-download', 
      label: 'Admin Download', 
      path: '/admin/downloads'
    },
    { 
      icon: 'fas fa-globe', 
      label: 'Mini Website', 
      path: '/admin/mini-website'
    },
    { 
      icon: 'fas fa-trash', 
      label: 'Trash', 
      path: '/admin/trash'
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <img src="/smartlogo.png" alt="Smart Abhyas" className="sidebar-logo" />
        <h3>Smart Abhyas</h3>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item-group">
            <Link 
              to={item.path} 
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
            
            {item.submenu && (
              <div className="submenu">
                {item.submenu.map((subItem, subIndex) => (
                  <Link 
                    key={subIndex}
                    to={subItem.path}
                    className={`submenu-item ${isActive(subItem.path) ? 'active' : ''}`}
                  >
                    <span>{subItem.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
