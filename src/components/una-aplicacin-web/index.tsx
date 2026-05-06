import PichangaDashboard from './PichangaDashboard.js';
import DashboardPagos from './DashboardPagos.js';
import DashboardPichanga from './DashboardPichanga.js';
import SociosList from './SociosList.js';

export default function App() {
  return (
    <>
      <PichangaDashboard />
          <DashboardPagos />
          <DashboardPichanga />
          <SociosList />
    </>
  );
}
