import './Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`app-button app-button--${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;