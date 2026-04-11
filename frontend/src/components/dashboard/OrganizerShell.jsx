import { C, FONT } from '../../constants/colors';
import Sidebar from '../common/Sidebar';

export default function OrganizerShell({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: C.neutral, fontFamily: FONT }}>
      <Sidebar isAdmin={true} />
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}
