import { useRef } from 'react';
import { workArt } from '../../../assets/art';
import simpulMark from '../../../assets/images/simpul-mark.png';
import { SECTION_NAV } from '../../../content/nav';
import { PRODUCTS } from '../../../content/work';
import { mountWork } from '../../../motion/work/mount';
import { useSectionMotion } from '../../../motion/useSectionMotion';
import { InlineSvg } from '../../atoms/InlineSvg';
import { WorkPanel } from '../../molecules/WorkPanel';
import { WorkTabs } from '../../molecules/WorkTabs';
import { SectionNav } from '../SectionNav';
import './work.css';

// The art refers to the Simpul mark by its place in the mockup; the built file is the imported image.
const MARK_HREF = 'assets/simpul-mark.png';

// Selected work: five products on one pinned stage. Scrolling walks through them; the tabs jump to one.
export function WorkSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionMotion(ref, mountWork, 'work');
  const art = workArt.replace(MARK_HREF, simpulMark);
  return (
    <section ref={ref} className="work" id="work" aria-labelledby="work-title">
      <div className="work-stage">
        <SectionNav
          prefix="work"
          name="Selected work"
          titleId="work-title"
          nameTag="h2"
          links={SECTION_NAV.work}
        />
        <WorkTabs products={PRODUCTS} />
        {PRODUCTS.map((product, index) => (
          <WorkPanel key={product.id} product={product} active={index === 0} />
        ))}
        <InlineSvg markup={art} />
      </div>
    </section>
  );
}
