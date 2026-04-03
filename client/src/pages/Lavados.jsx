import { Routes, Route } from 'react-router-dom';
import LavadosList from '../features/lavados/LavadosList';
import LavadoDetail from './LavadoDetail';

const Lavados = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<LavadosList />} />
        <Route path=":id" element={<LavadoDetail />} />
      </Routes>
    </div>
  );
};

export default Lavados;