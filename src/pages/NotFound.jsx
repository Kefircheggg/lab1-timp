import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page page--center">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__text">Запрошенная страница не найдена.</p>
      <Link to="/" className="btn btn--primary">
        Вернуться на главную
      </Link>
    </section>
  );
}
