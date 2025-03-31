(function () {
  let color = { light: "#fafafa", dark: "#111" };

  const getSettings = () => {
    try {
      color = JSON.parse(window.localStorage.getItem("page-color") || "");
    } catch (_error) {}
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
