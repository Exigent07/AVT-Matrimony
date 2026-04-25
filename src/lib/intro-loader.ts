export const INTRO_LOADER_STORAGE_KEY = "avt-intro-loader-v1";
export const INTRO_LOADER_ANIMATION_MS = 4200;
export const INTRO_LOADER_EXIT_MS = 360;

export function getIntroLoaderBootstrapScript() {
  return `
    try {
      document.documentElement.dataset.introLoaderSeen =
        sessionStorage.getItem(${JSON.stringify(INTRO_LOADER_STORAGE_KEY)}) === "true"
          ? "true"
          : "false";
    } catch {
      document.documentElement.dataset.introLoaderSeen = "false";
    }
  `;
}
