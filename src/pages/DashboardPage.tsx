import { useNavigate } from 'react-router-dom';
import { DashboardView } from '../components/dashboard';

export function DashboardPage() {
  const navigate = useNavigate();

  const handleNavigateToTab = (tab: string) => {
    if (tab === 'projects') navigate('/projects');
    else if (tab === 'targets') navigate('/targets');
    else if (tab === 'history') navigate('/history');
    else navigate('/');
  };

  return <DashboardView onNavigateToTab={handleNavigateToTab} />;
}
