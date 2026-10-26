export interface SectionApi {
  destroy(): void;
  readonly state?: Readonly<Record<string, unknown>>;
}

export type MountSection = (root: HTMLElement) => SectionApi;
