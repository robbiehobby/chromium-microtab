import { createSystem, defaultConfig } from "@chakra-ui/react";

const themeSystem = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      bg: "{colors.bg.subtle}",
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        focus: {
          value: { base: "{colors.blue.600}", _dark: "{colors.blue.400}" },
        },
      },
      borders: {
        subtle: {
          value: "1px solid {colors.border}",
        },
      },
    },
  },
});

export default themeSystem;
