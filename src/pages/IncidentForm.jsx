import { useState } from 'react';
import ErrorBanner from '../components/ErrorBanner.jsx';

const TYPES = [
  'Физическая угроза',
  'Информационная угроза',
  'Пожарная угроза',
  'Правонарушение',
  'Медицинский инцидент',
];

const SEVERITIES = ['Низкая', 'Средняя', 'Высокая', 'Критическая'];

const STATUSES = ['Открыт', 'В работе', 'Закрыт'];

const REQUIRED_FIELDS = ['title', 'institution', 'type', 'date', 'severity', 'status', 'responsible'];

const FIELD_LABELS = {
  title: 'Наименование',
  institution: 'Учреждение',
  type: 'Тип угрозы',
  date: 'Дата',
  severity: 'Критичность',
  status: 'Статус',
  responsible: 'Ответственный',
  description: 'Описание',
};

export function validate(values) {
  const errors = {};
  for (const field of REQUIRED_FIELDS) {
    if (!values[field] || String(values[field]).trim() === '') {
      errors[field] = `Поле «${FIELD_LABELS[field]}» обязательно для заполнения`;
    }
  }
  return errors;
}

export default function IncidentForm({ initial, submitLabel, onSubmit }) {
  const [values, setValues] = useState(() => ({
    title: '',
    institution: '',
    type: '',
    date: '',
    severity: '',
    status: '',
    responsible: '',
    description: '',
    ...(initial || {}),
  }));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setServerError('');
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit(values).catch((e) => setServerError(e.message));
  };

  const renderError = (field) =>
    errors[field] ? <span className="field__error">{errors[field]}</span> : null;

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <ErrorBanner message={serverError} />

      <div className="field">
        <label htmlFor="title">Наименование инцидента *</label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={handleChange('title')}
          className={errors.title ? 'invalid' : ''}
        />
        {renderError('title')}
      </div>

      <div className="field">
        <label htmlFor="institution">Учреждение *</label>
        <input
          id="institution"
          type="text"
          value={values.institution}
          onChange={handleChange('institution')}
          className={errors.institution ? 'invalid' : ''}
        />
        {renderError('institution')}
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="type">Тип угрозы *</label>
          <select
            id="type"
            value={values.type}
            onChange={handleChange('type')}
            className={errors.type ? 'invalid' : ''}
          >
            <option value="">— выберите —</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {renderError('type')}
        </div>

        <div className="field">
          <label htmlFor="date">Дата *</label>
          <input
            id="date"
            type="date"
            value={values.date}
            onChange={handleChange('date')}
            className={errors.date ? 'invalid' : ''}
          />
          {renderError('date')}
        </div>

        <div className="field">
          <label htmlFor="severity">Критичность *</label>
          <select
            id="severity"
            value={values.severity}
            onChange={handleChange('severity')}
            className={errors.severity ? 'invalid' : ''}
          >
            <option value="">— выберите —</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {renderError('severity')}
        </div>

        <div className="field">
          <label htmlFor="status">Статус *</label>
          <select
            id="status"
            value={values.status}
            onChange={handleChange('status')}
            className={errors.status ? 'invalid' : ''}
          >
            <option value="">— выберите —</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {renderError('status')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="responsible">Ответственный сотрудник *</label>
        <input
          id="responsible"
          type="text"
          value={values.responsible}
          onChange={handleChange('responsible')}
          className={errors.responsible ? 'invalid' : ''}
        />
        {renderError('responsible')}
      </div>

      <div className="field">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          rows="5"
          value={values.description}
          onChange={handleChange('description')}
        />
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
