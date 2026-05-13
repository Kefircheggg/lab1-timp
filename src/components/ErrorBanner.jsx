export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert">
      <strong>Ошибка:</strong> {message}
      {onRetry && (
        <button type="button" onClick={onRetry} className="error-banner__retry">
          Повторить
        </button>
      )}
    </div>
  );
}
