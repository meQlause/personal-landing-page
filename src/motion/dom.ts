// Query helper for the motion modules: `need` is for elements a section cannot work without.
export function need<T extends Element>(root: ParentNode, selector: string): T {
  const found = root.querySelector<T>(selector);
  if (!found) {
    throw new Error(`Missing ${selector}`);
  }
  return found;
}
