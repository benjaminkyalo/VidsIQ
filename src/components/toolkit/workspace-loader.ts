export const loadToolWorkspace = () => import('./tool-workspace').then(module => ({ default: module.ToolWorkspace }));
// Download code only when the visitor interacts, never query YouTube speculatively.
export function warmToolWorkspace() { void loadToolWorkspace().catch(() => {}); }