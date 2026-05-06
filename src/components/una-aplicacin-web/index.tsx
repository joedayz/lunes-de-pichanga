import DashboardWithYearFilter from '../usar-selectores-de-ao-y-mes-en-la-interf/DashboardWithYearFilter.js';
import PagoForm from '../usar-selectores-de-ao-y-mes-en-la-interf/PagoForm.js';
import FormRegistroSocioYCuota from './FormRegistroSocioYCuota.js';
import PichangaDashboard from './PichangaDashboard.js';

export default function App() {
  return (
    <>
      <DashboardWithYearFilter />
      <PagoForm />
      <FormRegistroSocioYCuota />
          <PichangaDashboard />
    </>
  );
}
