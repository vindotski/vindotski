export type ColorMode = 'system' | 'light' | 'dark';
export declare const COLOR_MODES: readonly ColorMode[];
export declare function getColorMode(fallback: ColorMode): ColorMode;
export declare function setColorMode(mode: ColorMode): void;
export declare function nextColorMode(mode: ColorMode): ColorMode;
export declare function colorModeScript(fallback: ColorMode): string;
