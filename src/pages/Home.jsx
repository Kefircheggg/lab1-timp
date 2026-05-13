import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { incidentsApi } from '../api/incidents.js';
import ErrorBanner from '../components/ErrorBanner.jsx';

const SEVERITY_CLASS = {
  'Низкая': 'sev sev--low',
  'Средняя': 'sev sev--mid',
  'Высокая': 'sev sev--high',
  'Критическая': 'sev sev--crit',
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    incidentsApi.list().then(setItems).catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Удалить инцидент?')) return;
    incidentsApi
      .remove(id)
      .then(() => setItems((prev) => prev.filter((it) => it.id !== id)))
      .catch((e) => setError(e.message));
  };

  return (
    <section className="page">
      <div className="page__header">
        <h1>Список инцидентов</h1>
        <Link to="/add" className="btn btn--primary">
          Добавить инцидент
        </Link>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Наименование</th>
            <th>Учреждение</th>
            <th>Тип</th>
            <th>Дата</th>
            <th>Критичность</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>
                <Link to={`/detail/${it.id}`}>{it.title}</Link>
              </td>
              <td>{it.institution}</td>
              <td>{it.type}</td>
              <td>{it.date}</td>
              <td>
                <span className={SEVERITY_CLASS[it.severity] || 'sev'}>{it.severity}</span>
              </td>
              <td>{it.status}</td>
              <td className="actions">
                <Link to={`/edit/${it.id}`} className="btn btn--ghost">
                  Изменить
                </Link>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => handleDelete(it.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && !error && (
            <tr>
              <td colSpan="8" className="empty">
                Инциденты пока не зафиксированы.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
