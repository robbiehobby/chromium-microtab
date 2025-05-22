import { Box, Button, Callout, Flex, Text } from "@radix-ui/themes";
import { useEffect, useReducer, useState } from "react";
import UiSwitch from "../../../components/switch.tsx";
import UiTooltip from "../../../components/tooltip.tsx";
import chromeApi, { defaultSettings } from "../api/chrome.ts";
import pageReducer from "./page-handler.ts";

export default function Page() {
  const [state, dispatch] = useReducer(pageReducer, { settings: structuredClone(defaultSettings), errors: {} });
  const [shortcut, setShortcut] = useState("");

  useEffect(() => {
    (async () => {
      dispatch({ type: "loadSettings", value: await chromeApi.getSettings(), dispatch });
      setShortcut(await chromeApi.getShortcut());
    })();
  }, []);

  const onChange = (type: string, value: any) => {
    dispatch({ type, value, dispatch });
  };

  return (
    <Box p="5" width="400px">
      <Callout.Root color={!shortcut ? "orange" : "gray"} mb="5">
        <Callout.Text>
          <Flex as="span" align="center" gap="4">
            <UiTooltip.Root content={chromeApi.getMessage("closeShortcutHelp")}>
              <Button size="1" variant="surface" my="-2" onClick={chromeApi.openShortcuts}>
                {!shortcut ? chromeApi.getMessage("closeConfigure") : shortcut}
              </Button>
            </UiTooltip.Root>
            <Text>{chromeApi.getMessage(!shortcut ? "closeUnassigned" : "closeShortcut")}</Text>
          </Flex>
        </Callout.Text>
      </Callout.Root>

      <Flex direction="column" gap="3">
        <UiSwitch
          label={chromeApi.getMessage("closePinned")}
          tooltip={chromeApi.getMessage("closePinnedHelp")}
          disabled={!shortcut}
          checked={state.settings.closePinned}
          onCheckedChange={(value) => onChange("setClosePinned", value)}
        />
        <UiSwitch
          label={chromeApi.getMessage("closeGrouped")}
          tooltip={chromeApi.getMessage("closeGroupedHelp")}
          disabled={!shortcut}
          checked={state.settings.closeGrouped}
          onCheckedChange={(value) => onChange("setCloseGrouped", value)}
        />
        <UiSwitch
          label={chromeApi.getMessage("closeEmpty")}
          tooltip={chromeApi.getMessage("closeEmptyHelp")}
          disabled={!shortcut}
          checked={state.settings.closeEmpty}
          onCheckedChange={(value) => onChange("setCloseEmpty", value)}
        />
      </Flex>
    </Box>
  );
}
