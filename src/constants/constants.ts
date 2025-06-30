import type { ColorPalettes } from "../types/OrganicSphere.types";

export const colorPalettes: ColorPalettes = {
  pastel: [
    { main: [0.9, 0.8, 1.0], accent: [0.8, 0.6, 1.0] },
    { main: [1.0, 0.9, 0.8], accent: [1.0, 0.7, 0.6] },
    { main: [0.8, 1.0, 0.9], accent: [0.6, 1.0, 0.8] },
  ],
  vibrant: [
    { main: [0.8, 0.4, 1.0], accent: [1.0, 0.2, 0.8] },
    { main: [0.4, 0.8, 1.0], accent: [0.2, 1.0, 0.6] },
    { main: [1.0, 0.6, 0.4], accent: [1.0, 0.2, 0.4] },
  ],
  monochrome: [
    { main: [0.9, 0.9, 0.95], accent: [0.7, 0.7, 0.8] },
    { main: [0.8, 0.8, 0.85], accent: [0.6, 0.6, 0.7] },
  ],
  rainbow: [
    { main: [1.0, 0.6, 0.8], accent: [0.8, 0.4, 1.0] },
    { main: [0.6, 1.0, 0.8], accent: [0.4, 0.8, 1.0] },
    { main: [1.0, 0.8, 0.6], accent: [1.0, 0.6, 0.4] },
  ],
};
