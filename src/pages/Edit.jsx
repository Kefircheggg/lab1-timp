import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IncidentForm from './IncidentForm.jsx';
import { incidentsApi } from '../api/incidents.js';
import ErrorBanner from '../components/ErrorBanner.jsx';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    incidentsApi.get(id).then(setItem).catch((e) => setError(e.message));
  }, [id]);

  const handleSubmit = (values) =>
    incidentsApi.update(id, { ...values, id: Number(id) }).then(() => navigate(`/detail/${id}`));

  if (error) {
    return (
      <section className="page">
        <ErrorBanner message={error} />
      </section>
    );
  }

  if (!item) {
    return (
      <section className="page">
        <p>Загрузка…</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Редактирование инцидента №{item.id}</h1>
      <IncidentForm initial={item} submitLabel="Сохранить изменения" onSubmit={handleSubmit} />
    </section>
  );
}
