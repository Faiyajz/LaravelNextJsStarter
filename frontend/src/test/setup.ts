import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("@/modules/shared", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/modules/shared")>();

  return {
    ...actual,
    notify: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      loading: vi.fn(),
      dismiss: vi.fn(),
    },
  };
});

if (!("matchMedia" in window)) {
  Object.defineProperty(window, "matchMedia", {
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!("ResizeObserver" in window)) {
  Object.defineProperty(window, "ResizeObserver", {
    value: ResizeObserver,
  });
}
