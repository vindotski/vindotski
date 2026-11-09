export interface CrossoverOptions {
  /** The other site's URL. Called only when the pull completes. */
  getUrl: () => string;
  /** 0 to 1, as the pull grows and eases back. */
  onProgress?: (progress: number) => void;
  /** What happens at 1. Defaults to `crossTo`. */
  onCross?: (url: string) => void;
}
export declare function attachCrossover(options: CrossoverOptions): () => void;
export declare function crossTo(url: string): void;
export declare const arriveScript: string;
