import { useLocation, useParams as useWouterParams } from "wouter";

export function useRouter() {
  const [, setLocation] = useLocation();
  return {
    push: (path: string) => setLocation(path),
    replace: (path: string) => setLocation(path, { replace: true }),
    refresh: () => window.location.reload(),
    back: () => window.history.back(),
  };
}

export function useParams<T extends Record<string, string>>(): T {
  return useWouterParams() as T;
}

export function useSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return [searchParams] as const;
}

export function usePathname() {
  const [location] = useLocation();
  return location;
}

export function redirect(path: string) {
  window.location.href = path;
}
