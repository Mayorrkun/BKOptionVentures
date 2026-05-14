import { Link } from 'react-router-dom';

export default function Button({ variant = 'primary', size = 'md', as, to, href, onClick, children, className = '', ...rest }) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim();

  if (as === 'link' || to) {
    return <Link to={to} className={cls} {...rest}>{children}</Link>;
  }
  if (href) {
    return <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>{children}</a>;
  }
  return <button className={cls} onClick={onClick} {...rest}>{children}</button>;
}
