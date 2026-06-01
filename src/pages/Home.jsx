import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { incidentsApi } from '../api/incidents.js';
import ErrorBanner from '../components/ErrorBanner.jsx';

const SEVERITY_CLASS = {
  'Низкая': 'sev sev--low',
  'Средняя': 'sev sev--mid',
  'Высокая': 'sev sev--high',
  'Критическая': 'sev sev--crit',
};

const EMPTY_FILTERS = {
  q: '',
  type: '',
  status: '',
  severity: '',
  dateFrom: '',
  dateTo: '',
};

function uniq(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru'));
}

function countBy(items, field) {
  const map = new Map();
  for (const it of items) {
    map.set(it[field], (map.get(it[field]) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

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

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return items.filter((it) => {
      if (filters.type && it.type !== filters.type) return false;
      if (filters.status && it.status !== filters.status) return false;
      if (filters.severity && it.severity !== filters.severity) return false;
      if (filters.dateFrom && it.date < filters.dateFrom) return false;
      if (filters.dateTo && it.date > filters.dateTo) return false;
      if (q) {
        const hay = `${it.title} ${it.institution} ${it.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, filters]);

  const setFilter = (key) => (event) =>
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));

  const resetFilters = () => setFilters(EMPTY_FILTERS);

  const typeOptions = useMemo(() => uniq(items.map((it) => it.type)), [items]);
  const statusOptions = useMemo(() => uniq(items.map((it) => it.status)), [items]);
  const severityOptions = useMemo(() => uniq(items.map((it) => it.severity)), [items]);

  const byStatus = useMemo(() => countBy(filtered, 'status'), [filtered]);
  const bySeverity = useMemo(() => countBy(filtered, 'severity'), [filtered]);
  const byType = useMemo(() => countBy(filtered, 'type'), [filtered]);

  return (
    <section className="page">
      <div className="page__header">
        <h1>Список инцидентов</h1>
        <Link to="/add" className="btn btn--primary">
          Зарегистрировать инцидент
        </Link>
      </div>

      <div className="notice">
        Персональные данные пациентов и сотрудников обезличены методом введения
        идентификаторов (Приказ Роскомнадзора №&nbsp;996 от 05.09.2013) в
        соответствии со ст.&nbsp;3 п.&nbsp;9 Федерального закона №&nbsp;152-ФЗ
        «О персональных данных» и режимом врачебной тайны (ст.&nbsp;13
        Федерального закона №&nbsp;323-ФЗ).
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <div className="stats">
        <div className="stats__total">
          <div className="stats__label">Всего инцидентов</div>
          <div className="stats__value">
            {filtered.length}
            <span className="stats__total-sub">из&nbsp;{items.length}</span>
          </div>
        </div>
        <div className="stats__group">
          <div className="stats__label">По статусу</div>
          <ul className="stats__list">
            {byStatus.map(([key, n]) => (
              <li key={key}>
                <span>{key}</span>
                <span className="stats__count">{n}</span>
              </li>
            ))}
            {byStatus.length === 0 && <li className="stats__empty">—</li>}
          </ul>
        </div>
        <div className="stats__group">
          <div className="stats__label">По критичности</div>
          <ul className="stats__list">
            {bySeverity.map(([key, n]) => (
              <li key={key}>
                <span>{key}</span>
                <span className="stats__count">{n}</span>
              </li>
            ))}
            {bySeverity.length === 0 && <li className="stats__empty">—</li>}
          </ul>
        </div>
        <div className="stats__group stats__group--wide">
          <div className="stats__label">По типу</div>
          <ul className="stats__list">
            {byType.map(([key, n]) => (
              <li key={key}>
                <span>{key}</span>
                <span className="stats__count">{n}</span>
              </li>
            ))}
            {byType.length === 0 && <li className="stats__empty">—</li>}
          </ul>
        </div>
      </div>

      <div className="filters">
        <div className="filters__field">
          <label>Поиск</label>
          <input
            type="text"
            value={filters.q}
            onChange={setFilter('q')}
            placeholder="по названию, учреждению, описанию"
          />
        </div>
        <div className="filters__field">
          <label>Тип</label>
          <select value={filters.type} onChange={setFilter('type')}>
            <option value="">все типы</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label>Статус</label>
          <select value={filters.status} onChange={setFilter('status')}>
            <option value="">все</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label>Критичность</label>
          <select value={filters.severity} onChange={setFilter('severity')}>
            <option value="">все</option>
            {severityOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label>Дата с</label>
          <input type="date" value={filters.dateFrom} onChange={setFilter('dateFrom')} />
        </div>
        <div className="filters__field">
          <label>Дата по</label>
          <input type="date" value={filters.dateTo} onChange={setFilter('dateTo')} />
        </div>
        <div className="filters__field filters__field--reset">
          <button type="button" className="btn" onClick={resetFilters}>
            Сбросить
          </button>
        </div>
      </div>

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
          {filtered.map((it) => (
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
          {filtered.length === 0 && !error && (
            <tr>
              <td colSpan="8" className="empty">
                {items.length === 0
                  ? 'Инциденты пока не зафиксированы.'
                  : 'По выбранным фильтрам ничего не найдено.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
