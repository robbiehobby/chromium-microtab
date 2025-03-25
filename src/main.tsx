import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, Theme, defaultSystem, LocaleProvider } from "@chakra-ui/react";
import App from "./app/page.tsx";
import color from "./components/ui/color.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Theme colorPalette={color.palette.primary}>
        <LocaleProvider locale={Intl.DateTimeFormat().resolvedOptions().locale}>
          <App />
        </LocaleProvider>
      </Theme>
    </ChakraProvider>
  </StrictMode>,
);
