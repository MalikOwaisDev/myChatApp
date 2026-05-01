const ToggleSwitch = ({ checked, onChange, id, disabled }) => (
  <label className="toggle-switch" htmlFor={id}>
    <input
      id={id}
      type="checkbox"
      className="toggle-switch__input"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
    <span className="toggle-switch__track">
      <span className="toggle-switch__thumb" />
    </span>
  </label>
);

export default ToggleSwitch;
