const SectionWrapper = ({ title, children, className = '' }) => (
  <section className={['section-wrapper', className].filter(Boolean).join(' ')}>
    {title && <h2 className="section-wrapper__title">{title}</h2>}
    {children}
  </section>
);

export default SectionWrapper;
