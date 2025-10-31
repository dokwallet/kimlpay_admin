import s from './Button.module.css';

const Button = ({
  children,
  disabled = false,
  type,
  className,
  onClick,
  isLoading = false,
  ...props
}) => {
  return (
    <button
      className={`${s.buttonContainer} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}>
      {isLoading ? <div className={s.spinner} /> : <span>{children}</span>}
    </button>
  );
};

export default Button;
