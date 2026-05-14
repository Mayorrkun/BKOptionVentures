import { Link } from 'react-router-dom';
import '../css/breadcrumb.css';

export default function Breadcrumb({ crumbs }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="breadcrumb-item">
            {i > 0 && <span className="breadcrumb-sep">›</span>}
            {isLast
              ? <span className="breadcrumb-current">{crumb.label}</span>
              : <Link to={crumb.href} className="breadcrumb-link">{crumb.label}</Link>
            }
          </span>
        );
      })}
    </nav>
  );
}
