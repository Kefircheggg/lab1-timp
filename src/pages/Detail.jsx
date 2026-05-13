import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { incidentsApi } from '../api/incidents.js';
import ErrorBanner from '../components/ErrorBanner.jsx';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    incidentsApi.get(id).then(setItem).catch((e) => setError(e.message));
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm('Удалить инцидент?')) return;
    incidentsApi
      .remove(id)
      .then(() => navigate('/'))
      .catch((e) => setError(e.message));
  };

  if (error) {
    return (
      <section className="page">
        <ErrorBanner message={error} />
        <Link to="/" className="btn">К списку</Link>
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
      <div className="page__header">
        <h1>Инцидент №{item.id}</h1>
        <div className="actions">
          <Link to={`/edit/${item.id}`} className="btn btn--primary">
            Редактировать
          </Link>
          <button type="button" className="btn btn--danger" onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>

      <dl className="detail">
        <dt>Наименование</dt>
        <dd>{item.title}</dd>
        <dt>Учреждение</dt>
        <dd>{item.institution}</dd>
        <dt>Тип угрозы</dt>
        <dd>{item.type}</dd>
        <dt>Дата</dt>
        <dd>{item.date}</dd>
        <dt>Критичность</dt>
        <dd>{item.severity}</dd>
        <dt>Статус</dt>
        <dd>{item.status}</dd>
        <dt>Ответственный</dt>
        <dd>{item.responsible}</dd>
        <dt>Описание</dt>
        <dd>{item.description}</dd>
      </dl>

      <Link to="/" className="btn">К списку</Link>
    </section>
  );
}
