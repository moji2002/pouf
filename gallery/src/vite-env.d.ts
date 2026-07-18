/// <reference types="vite/client" />

// Fontsource ships CSS-only packages with no type declarations; this repo's
// tsconfig disallows implicit `any` module resolution, so give the
// side-effect import an explicit (empty) shape.
declare module '@fontsource-variable/nunito'
