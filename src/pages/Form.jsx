import { useNavigate } from 'react-router-dom';
import IncidentForm from './IncidentForm.jsx';
import { incidentsApi } from '../api/incidents.js';

export default function Form() {
  const navigate = useNavigate();

  const handleSubmit = (values) =>
    incidentsApi.create(values).then(() => navigate('/'));

  return (
    <section className="page">
      <h1>Регистрация нового инцидента</h1>
      <IncidentForm submitLabel="Сохранить" onSubmit={handleSubmit} />
    </section>
  );
}
