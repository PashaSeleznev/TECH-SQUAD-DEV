import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {

  // Получаем текущий путь из маршрутизатора
  const location = useLocation();

  // Показ списка уведомлений
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="header">
      <div className="header-radex-logo">
        RADEX
      </div>

      <ul className="header-nav">
        <li>
          <Link 
            className={ location.pathname === '/' ? 'nav-link-active' : 'nav-link'} 
            to = '/'
          >
            Загрузка
          </Link>
        </li>

        <li>
          <Link 
            className={ location.pathname === '/reports' ? 'nav-link-active' : 'nav-link'} 
            to = '/reports'
          >
            Мои отчеты
          </Link>
        </li>

        <li>
          <Link 
            className={ location.pathname === '/profile' ? 'nav-link-active' : 'nav-link'} 
            to = '/profile'
          >
            Профиль
          </Link>
        </li>
      </ul>

      <div className="header-icons">
        <img className="header-icons-notification" 
          src="/images/notifications.png"
          onClick={() => setShowNotifications(!showNotifications)} 
        />

        {showNotifications && (
        <div className="notification-dropdown">
          <div>
            Здесь пока нет уведомлений
          </div>
        </div>
        )}

        <img className="header-icons-profile" 
          src="/images/avatar.png" 
        />
      </div>
    </div>
    );
  };
  
  export default Header;