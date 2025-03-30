(function () {
  const color = { light: "#fafafa", dark: "#111" };

  const getSettings = () => {
    try {
      const settings = JSON.parse(window.localStorage.getItem("page") || "");
      if (settings.color.light) color.light = settings.color.light;
      if (settings.color.dark) color.dark = settings.color.dark;
    } catch (_e) {}
  };
  getSettings();

  // Add styles early to help reduce flickering.
  const style = document.createElement("style");
  style.textContent = `
  body { background-color: ${color.light}; }
  @media (prefers-color-scheme: dark) { body { background-color: ${color.dark}; } }
  `;
  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", () => {
    const mode = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMode = () => {
      getSettings();
      if (mode.matches) {
        document.body.className = "dark";
        document.body.style.backgroundColor = color.dark;
      } else {
        document.body.className = "light";
        document.body.style.backgroundColor = color.light;
      }
    };
    handleMode();
    mode.addEventListener("change", () => handleMode());
  });
})();
