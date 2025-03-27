import { Box, Button, CloseButton, Drawer, Field, Group, HStack, parseColor, Span, Text } from "@chakra-ui/react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Expand, Fullscreen, Keyboard, LayoutGrid, Settings, TriangleAlert } from "lucide-react";
import { defaultSettings, useChrome } from "../hooks/chrome.ts";
import Form from "../components/form/bundle.ts";
import pageHandler from "./page-handler.ts";
import getMessage from "../i18n.ts";
import Ui from "../components/ui/bundle.ts";

export interface PageState {
  settings: typeof defaultSettings;
  setSettings: SetStateAction<any>;
  errors: Record<any, any>;
  setErrors: SetStateAction<any>;
}

export default function Page() {
  const [settings, setSettings] = useState(defaultSettings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const state: PageState = { settings, setSettings, errors, setErrors };

  useEffect(() => {
    useChrome()
      .getSettings()
      .then((settings) => setSettings(settings));
    return () => {};
  }, []);

  const overlay = useRef<HTMLDivElement>(null);

  if (settings.color) document.body.style.backgroundColor = settings.color;
  else document.body.style.backgroundColor = "";
  if (overlay.current) {
    if (settings.image.data) overlay.current.style.backgroundImage = `url(${settings.image.data})`;
    else overlay.current.style.backgroundImage = "";
  }

  const filters: string[] = [];
  if (settings.image.hue) filters.push(`hue-rotate(${settings.image.hue}deg)`);
  if (settings.image.grayscale) filters.push(`grayscale(${settings.image.grayscale})`);
  if (settings.image.blur) filters.push(`blur(${settings.image.blur}px)`);

  return (
    <>
      <Box
        id="image"
        ref={overlay}
        position="fixed"
        inset={0}
        backgroundSize={settings.image.style === "cover" ? "cover" : `${settings.image.size}%`}
        backgroundRepeat={settings.image.style === "repeat" ? "repeat" : "no-repeat"}
        backgroundPosition="center"
        opacity={`${settings.image.opacity}%`}
        filter={filters.join(" ")}
        transform="translateZ(0)"
      />

      <Drawer.Root size="sm">
        <Drawer.Trigger asChild position="fixed" right={10} bottom={10}>
          <Button
            variant="surface"
            colorPalette="gray"
            className="group"
            h="auto"
            p={3}
            rounded="full"
            opacity={0.4}
            _hover={{ opacity: 1 }}
            _focus={{ opacity: 1 }}
            aria-label={getMessage("settings")}
          >
            <Span _groupHover={{ animation: "spin 1.5s infinite" }}>
              <Settings />
            </Span>
          </Button>
        </Drawer.Trigger>

        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.CloseTrigger asChild pos="initial">
                <CloseButton size="2xs" aria-label={getMessage("close")} />
              </Drawer.CloseTrigger>
              <Drawer.Title>{getMessage("settings")}</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body pb={6}>
              <form>
                <Form.ColorPicker
                  displayLabel={getMessage("color")}
                  mb={4}
                  value={settings.color ? parseColor(settings.color) : parseColor("#000")}
                  onValueChange={(details) => pageHandler.color(details, state)}
                />

                <Field.Root invalid={!!errors.image} mb={4}>
                  <Form.FileUpload
                    displayLabel={getMessage("image")}
                    removeLabel={getMessage("imageRemove")}
                    accept="image/*"
                    maxFileSize={8000000}
                    defaultValue={settings.image.filename}
                    onFileChange={(details) => pageHandler.image(details, state)}
                    onFileRemove={() => pageHandler.imageRemove(state)}
                  />
                  {errors.image && <Field.ErrorText>{errors.image}</Field.ErrorText>}
                </Field.Root>

                {settings.image.data && (
                  <>
                    <Form.SegmentGroup
                      displayLabel={getMessage("imageStyle")}
                      items={{
                        cover: (
                          <Ui.Tooltip.Root content={getMessage("imageStyleCoverHelp")}>
                            <HStack>
                              <Expand size={13} /> {getMessage("imageStyleCover")}
                            </HStack>
                          </Ui.Tooltip.Root>
                        ),
                        repeat: (
                          <Ui.Tooltip.Root content={getMessage("imageStyleRepeatHelp")}>
                            <HStack>
                              <LayoutGrid size={13} /> {getMessage("imageStyleRepeat")}
                            </HStack>
                          </Ui.Tooltip.Root>
                        ),
                        center: (
                          <Ui.Tooltip.Root content={getMessage("imageStyleCenterHelp")}>
                            <HStack>
                              <Fullscreen size={13} /> {getMessage("imageStyleCenter")}
                            </HStack>
                          </Ui.Tooltip.Root>
                        ),
                      }}
                      size="sm"
                      mb="4"
                      value={settings.image.style}
                      onValueChange={(details) => pageHandler.imageStyle(details, state)}
                    />

                    <Box css={{ mb: 3, px: 3, pt: 2.5 }} border="subtle" rounded="sm">
                      <Form.Slider
                        displayLabel={
                          <HStack>
                            <Ui.Tooltip.Info
                              content={
                                settings.image.style === "cover"
                                  ? getMessage("imageSizeDisabledHelp")
                                  : getMessage("imageSizeHelp")
                              }
                            />
                            {getMessage("imageSize")}
                          </HStack>
                        }
                        size="sm"
                        unit="%"
                        step={0.5}
                        min={0}
                        max={200}
                        value={[settings.image.size]}
                        onValueChange={(details) => pageHandler.imageSize(details, state)}
                        disabled={settings.image.style === "cover"}
                      />
                      <Form.Slider
                        displayLabel={
                          <HStack>
                            <Ui.Tooltip.Info content={getMessage("imageOpacityHelp")} /> {getMessage("imageOpacity")}
                          </HStack>
                        }
                        size="sm"
                        unit="%"
                        step={0.5}
                        min={0}
                        max={100}
                        value={[settings.image.opacity]}
                        onValueChange={(details) => pageHandler.imageOpacity(details, state)}
                      />
                      <Form.Slider
                        displayLabel={
                          <HStack>
                            <Ui.Tooltip.Info content={getMessage("imageHueHelp")} /> {getMessage("imageHue")}
                          </HStack>
                        }
                        size="sm"
                        unit="deg"
                        step={0.5}
                        min={0}
                        max={360}
                        value={[settings.image.hue]}
                        onValueChange={(details) => pageHandler.imageHue(details, state)}
                      />
                      <Form.Slider
                        displayLabel={
                          <HStack>
                            <Ui.Tooltip.Info content={getMessage("imageGrayscaleHelp")} />
                            {getMessage("imageGrayscale")}
                          </HStack>
                        }
                        size="sm"
                        unit="%"
                        step={0.5}
                        min={0}
                        max={100}
                        value={[settings.image.grayscale * 100]}
                        onValueChange={(details) => pageHandler.imageGrayscale(details, state)}
                      />
                      <Form.Slider
                        displayLabel={
                          <HStack>
                            <Ui.Tooltip.Info content={getMessage("imageBlurHelp")} /> {getMessage("imageBlur")}
                          </HStack>
                        }
                        size="sm"
                        unit="%"
                        step={0.5}
                        min={0}
                        max={100}
                        value={[settings.image.blur]}
                        onValueChange={(details) => pageHandler.imageBlur(details, state)}
                      />
                    </Box>
                  </>
                )}

                <Box p={3} border="subtle" rounded="sm">
                  <Text mb={4} fontSize="sm">
                    {getMessage("closeTab")}
                  </Text>

                  <Group display="flex" mb={3}>
                    <Ui.Tooltip.Info content={getMessage("closeTabPinnedHelp")} />
                    <Form.Switch
                      displayLabel={getMessage("closeTabPinned")}
                      flexGrow={1}
                      checked={settings.closeTab.pinned}
                      onCheckedChange={(details) => pageHandler.closeTabPinned(details, state)}
                    />
                  </Group>

                  <Group display="flex" mb={5}>
                    <Ui.Tooltip.Info content={getMessage("closeTabGroupedHelp")} />
                    <Form.Switch
                      displayLabel={getMessage("closeTabGrouped")}
                      flexGrow={1}
                      checked={settings.closeTab.grouped}
                      onCheckedChange={(details) => pageHandler.closeTabGrouped(details, state)}
                    />
                  </Group>

                  <Button asChild size="sm" variant="outline" w="full">
                    <a href="#" onClick={() => useChrome().openShortcuts()}>
                      <Keyboard /> {getMessage("closeTabShortcut")}
                    </a>
                  </Button>
                </Box>
              </form>
            </Drawer.Body>

            <Drawer.Footer>
              <Button size="2xs" variant="ghost" colorPalette="gray" onClick={() => pageHandler.reset(state)}>
                <Span color="fg.warning">
                  <TriangleAlert size={8} />
                </Span>
                {getMessage("reset")}
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}
