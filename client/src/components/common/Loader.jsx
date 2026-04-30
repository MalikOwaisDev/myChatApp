const Loader = ({ size = 20 }) => (
  <span
    className="loader"
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  />
);

export default Loader;
