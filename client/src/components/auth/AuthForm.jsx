const AuthForm = ({ title, subtitle, icon, children, onSubmit }) => (
  <div className="auth-wrapper">
    <div className="auth-orb auth-orb--1" aria-hidden="true" />
    <div className="auth-orb auth-orb--2" aria-hidden="true" />
    <div className="auth-orb auth-orb--3" aria-hidden="true" />

    <div className="auth-card">
      <div className="auth-card__header">
        {icon && <div className="auth-card__icon">{icon}</div>}
        <h1 className="auth-card__title">{title}</h1>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
      </div>
      <form className="auth-card__form" onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </div>
  </div>
);

export default AuthForm;
