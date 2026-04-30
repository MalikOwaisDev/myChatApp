import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <p className="not-found__code">404</p>
    <h1 className="not-found__title">Page not found</h1>
    <p className="not-found__text">
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>
    <Link to="/" className="btn btn--primary btn--md">Back to Chat</Link>
  </div>
);

export default NotFound;
