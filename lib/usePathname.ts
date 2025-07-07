import { usePathname as usePath } from "next/navigation";
export function usePathname() {
  const path = usePath();
  return path !== "/" && path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
