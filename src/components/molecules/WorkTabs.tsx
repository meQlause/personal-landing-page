import type { WorkProduct } from '../../content/work';

interface WorkTabsProps {
  products: readonly WorkProduct[];
}

// The product tabs. The first one starts selected; the motion moves the selection as the scroll goes on.
export function WorkTabs({ products }: WorkTabsProps) {
  return (
    <div className="work-tabs" role="tablist" aria-labelledby="work-title">
      {products.map((product, index) => (
        <button
          key={product.id}
          className="work-tab"
          role="tab"
          id={`tab-${product.id}`}
          aria-controls={`panel-${product.id}`}
          aria-selected={index === 0}
          tabIndex={index === 0 ? undefined : -1}
        >
          {product.tab}
        </button>
      ))}
    </div>
  );
}
