import { markArt } from '../../assets/art';
import type { WorkProduct } from '../../content/work';
import { Icon } from '../atoms/Icon';
import { InlineSvg } from '../atoms/InlineSvg';

interface WorkPanelProps {
  product: WorkProduct;
  active: boolean;
}

// One product's headline, the note beside it, and its link. The headline's mark is drawn by the motion.
export function WorkPanel({ product, active }: WorkPanelProps) {
  return (
    <div
      className={active ? 'work-panel is-active' : 'work-panel'}
      role="tabpanel"
      id={`panel-${product.id}`}
      aria-labelledby={`tab-${product.id}`}
      hidden={!active}
    >
      <h3 className="work-headline">
        {product.before}
        <span className={`mark ${product.markClass}`}>
          {product.mark}
          <InlineSvg markup={markArt[product.id]} />
        </span>
        {product.after}
      </h3>
      <p className="work-kind">{product.kind}</p>
      <p className="visually-hidden">{product.description}</p>
      <a className="work-link" href={product.href} target="_blank" rel="noopener noreferrer">
        {product.label} <Icon name="arrow-up-right" />
      </a>
    </div>
  );
}
