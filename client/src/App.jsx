import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import './styles/main.scss';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <UIProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </UIProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
