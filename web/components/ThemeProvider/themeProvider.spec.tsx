import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { useTheme } from "next-themes";
import { ThemeProvider } from "./theme-provider";

type ThemeProviderPropsSnapshot = {
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  themes?: string[];
};

type ThemeProviderPropsRef = {
  readonly current: ThemeProviderPropsSnapshot;
};

type ThemeTestGlobal = {
  __lastThemeProviderProps?: ThemeProviderPropsRef;
  __lastSetThemeCall?: string;
};

declare global {
  var __themeTestGlobal: ThemeTestGlobal | undefined;
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
}));

type ThemeContextValue = {
  setTheme: (_t: string) => void;
  theme?: string;
  resolvedTheme?: string;
  themes: string[];
  systemTheme?: string;
};

vi.mock("next-themes", async () => {
  const actual =
    await vi.importActual<typeof import("next-themes")>("next-themes");
  const ctx = React.createContext<ThemeContextValue>({
    setTheme: () => {},
    theme: undefined,
    resolvedTheme: undefined,
    themes: ["light", "dark", "system"],
    systemTheme: "light",
  });

  return {
    ...actual,
    ThemeProvider: ({
      children,
      ...props
    }: React.PropsWithChildren<ThemeProviderPropsSnapshot>) => {
      const ref = React.useRef<ThemeProviderPropsSnapshot>(props);
      ref.current = props;
      if (!globalThis.__themeTestGlobal) {
        globalThis.__themeTestGlobal = {};
      }
      globalThis.__themeTestGlobal.__lastThemeProviderProps = ref;
      return (
        <ctx.Provider
          value={{
            setTheme: (t: string) => {
              if (!globalThis.__themeTestGlobal) {
                globalThis.__themeTestGlobal = {};
              }
              globalThis.__themeTestGlobal.__lastSetThemeCall = t;
            },
            theme: props.defaultTheme || "system",
            resolvedTheme: props.defaultTheme || "system",
            themes: props.themes || ["light", "dark", "system"],
            systemTheme: "light",
          }}
        >
          {children}
        </ctx.Provider>
      );
    },
    useTheme: () => React.useContext(ctx),
  };
});

describe("ThemeProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.__themeTestGlobal = undefined;
  });

  it("renders children and forwards theme props", () => {
    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <p data-testid="child">Hello from ThemeProvider</p>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();

    const props =
      globalThis.__themeTestGlobal?.__lastThemeProviderProps?.current;
    expect(props).toBeDefined();
    expect(props?.attribute).toBe("class");
    expect(props?.defaultTheme).toBe("dark");
    expect(props?.enableSystem).toBe(true);
    expect(props?.disableTransitionOnChange).toBe(true);
  });

  it("allows inner consumers to read theme context via useTheme", () => {
    const Consumer = () => {
      const { theme, setTheme } = useTheme();
      return (
        <div>
          <span data-testid="current-theme">{theme}</span>
          <button
            type="button"
            data-testid="set-light"
            onClick={() => setTheme("light")}
          >
            Set Light
          </button>
        </div>
      );
    };

    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Consumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");

    const btn = screen.getByTestId("set-light");
    btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(globalThis.__themeTestGlobal?.__lastSetThemeCall).toBe("light");
  });
});
