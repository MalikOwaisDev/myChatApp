import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Toast from '../components/ui/Toast';

const AppLayout = () => (
  <div className="app-layout">
    <Navbar />
    <main className="app-layout__main">
      <Outlet />
    </main>
    <Toast />
  </div>
);

export default AppLayout;
