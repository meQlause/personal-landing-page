// Raster images of the Education section, imported so Vite bundles and hashes them.
// The certificate images are keyed by their file name, as the content names them.
import Csharp from './certificates/Csharp.webp';
import FSD from './certificates/FSD.webp';
import algebra from './certificates/algebra.webp';
import ethicalhacking from './certificates/ethicalhacking.webp';
import geometry from './certificates/geometry.webp';
import htmlcss from './certificates/htmlcss.webp';
import linearalgebra from './certificates/linearalgebra.webp';
import mathfundamental from './certificates/mathfundamental.webp';
import mikrotik from './certificates/mikrotik.webp';
import problemsolving from './certificates/problemsolving.webp';
import redteaming from './certificates/redteaming.webp';
import scrypto101 from './certificates/scrypto101.webp';
import backgroundBakti from './education/backgrounds-baktiilham.webp';
import backgroundHarisenin from './education/backgrounds-harisenin.webp';
import backgroundUt from './education/backgrounds-ut.webp';

export const CERTIFICATE_IMAGES: Record<string, string> = {
  'Csharp.webp': Csharp,
  'FSD.webp': FSD,
  'algebra.webp': algebra,
  'ethicalhacking.webp': ethicalhacking,
  'geometry.webp': geometry,
  'htmlcss.webp': htmlcss,
  'linearalgebra.webp': linearalgebra,
  'mathfundamental.webp': mathfundamental,
  'mikrotik.webp': mikrotik,
  'problemsolving.webp': problemsolving,
  'redteaming.webp': redteaming,
  'scrypto101.webp': scrypto101,
};

export const SCHOOL_BACKGROUNDS: Record<string, string> = {
  'backgrounds-baktiilham.webp': backgroundBakti,
  'backgrounds-harisenin.webp': backgroundHarisenin,
  'backgrounds-ut.webp': backgroundUt,
};
