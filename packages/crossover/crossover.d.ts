/** Which edge of the page the visitor pulls past. */
export type Edge = 'bottom' | 'top';
/** Down to the Underground, or up to the Surface. */
export type Direction = 'down' | 'up';

export interface CrossoverOptions {
  /** The other site's URL. Called only when the pull completes. */
  getUrl: () => string;
  /** `bottom` (the default) crosses down; `top` crosses up. */
  edge?: Edge;
  /** 0 to 1, as the pull grows and resets. */
  onProgress?: (progress: number) => void;
  /** What happens at 1. Defaults to `crossTo` in the edge's direction. */
  onCross?: (url: string) => void;
}
export declare function attachCrossover(options: CrossoverOptions): () => void;
export declare function crossTo(url: string, options?: { direction?: Direction }): void;
export declare const arriveScript: string;
