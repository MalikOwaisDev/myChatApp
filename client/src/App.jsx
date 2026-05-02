import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import './styles/main.scss';

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
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
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
