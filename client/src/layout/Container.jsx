const Container = ({ children, size = 'default', className = '' }) => (
  <div className={['container', size !== 'default' ? `container--${size}` : '', className].filter(Boolean).join(' ')}>
    {children}
  </div>
);

export default Container;
