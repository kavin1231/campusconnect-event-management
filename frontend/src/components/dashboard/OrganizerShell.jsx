import { C, FONT } from '../../constants/colors';
import Sidebar from '../common/Sidebar';
import { useTheme } from '../../context/ThemeContext';

export default function OrganizerShell({ children }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        background: isDarkMode ? '#0B1324' : C.neutral,
        fontFamily: FONT,
      }}
    >
      <Sidebar isAdmin={true} />
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}
