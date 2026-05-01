import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { ChatProvider } from './context/ChatContext';
import AppRoutes from './routes/AppRoutes';
import './styles/main.scss';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <UIProvider>
        <SettingsProvider>
          <NotificationProvider>
            <ChatProvider>
            <AppRoutes />
            </ChatProvider>
          </NotificationProvider>
        </SettingsProvider>
      </UIProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
