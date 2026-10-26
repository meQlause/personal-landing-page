// Decorative SVG art, imported as text. Vite resolves the ?raw suffix; the lint resolver cannot, so the imports are kept here,
// in one place, under a paired disable.
/* eslint-disable import/no-unresolved -- Vite resolves the ?raw suffix; eslint's resolver cannot read it */
import closingFoldsSvg from './hero/closing-folds.svg?raw';
import headlineFoldsSvg from './hero/headline-folds.svg?raw';
import infraArtSvg from './hero/infra-art.svg?raw';
import interfaceArtSvg from './hero/interface-art.svg?raw';
import journeyArtSvg from './hero/journey-art.svg?raw';
import logicArtSvg from './hero/logic-art.svg?raw';
import prismSvg from './hero/prism.svg?raw';
import wordmarkSvg from './hero/wordmark.svg?raw';
import markAgaroSvg from './work/mark-agaro.svg?raw';
import markMnemoSvg from './work/mark-mnemo.svg?raw';
import markQswapSvg from './work/mark-qswap.svg?raw';
import markSimpulSvg from './work/mark-simpul.svg?raw';
import markTreecordSvg from './work/mark-treecord.svg?raw';
import workArtSvg from './work/work-art.svg?raw';
import markExpNetworksSvg from './experience/mark-networks.svg?raw';
import markExpKoreaSvg from './experience/mark-korea.svg?raw';
import markExpArcaneSvg from './experience/mark-arcane.svg?raw';
import markExpMentorSvg from './experience/mark-mentor.svg?raw';
import markExpTeknoSvg from './experience/mark-tekno.svg?raw';
import markExpPolarisSvg from './experience/mark-polaris.svg?raw';
import markExpIvetSvg from './experience/mark-ivet.svg?raw';
import experienceArtSvg from './experience/x-art.svg?raw';
import educationArtSvg from './education/c-art.svg?raw';
import contactWireSvg from './contact/k-wire.svg?raw';
/* eslint-enable import/no-unresolved */

export const markArt: Record<string, string> = {
  agaro: markAgaroSvg,
  mnemo: markMnemoSvg,
  qswap: markQswapSvg,
  simpul: markSimpulSvg,
  treecord: markTreecordSvg,
};

export const experienceMarkArt: Record<string, string> = {
  networks: markExpNetworksSvg,
  korea: markExpKoreaSvg,
  arcane: markExpArcaneSvg,
  mentor: markExpMentorSvg,
  tekno: markExpTeknoSvg,
  polaris: markExpPolarisSvg,
  ivet: markExpIvetSvg,
};

export {
  contactWireSvg as contactWire,
  educationArtSvg as educationArt,
  experienceArtSvg as experienceArt,
  workArtSvg as workArt,
  closingFoldsSvg as closingFolds,
  headlineFoldsSvg as headlineFolds,
  infraArtSvg as infraArt,
  interfaceArtSvg as interfaceArt,
  journeyArtSvg as journeyArt,
  logicArtSvg as logicArt,
  prismSvg,
  wordmarkSvg,
};
