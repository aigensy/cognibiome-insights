import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Suppress React Router v6 → v7 migration warnings that fire on every
// MemoryRouter/BrowserRouter instantiation when the future flags are absent.
// These are expected noise in a v6 project and do not indicate test failures.
const SUPPRESSED_WARNINGS = [
  "v7_startTransition",
  "v7_relativeSplatPath",
];

const _consoleWarn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  const msg = typeof args[0] === "string" ? args[0] : "";
  if (SUPPRESSED_WARNINGS.some((flag) => msg.includes(flag))) return;
  _consoleWarn(...args);
};
