import { memo, RefObject, useEffect, useReducer, useRef } from "react";
import { Bleed, Box, Button, CloseButton, Drawer, HStack, Separator, Span, Text } from "@chakra-ui/react";
import { Expand, Fullscreen, Keyboard, LayoutGrid, Moon, Settings, Sun, TriangleAlert } from "lucide-react";
import chromeApi, { defaultSettings } from "../apis/chrome.ts";
import pageReducer from "./page-handler.ts";
import Form from "../components/form/bundle.ts";
import Ui from "../components/ui/bundle.ts";
import getMessage from "../i18n.ts";

const render = {
  drawer: {
    title: (
      <Text as="h2" textStyle="lg" fontWeight="semibold">
        {getMessage("settings")}
      </Text>
    ),
  },
  closeTab: {
    text: (
      <Text mb={5} fontSize="sm">
        {getMessage("closeTab")}
      </Text>
    ),
    button: (
      <Button asChild size="sm" variant="outline" w="full" mt={4}>
        <a href="#" onClick={() => chromeApi.openShortcuts()}>
          <Keyboard /> {getMessage("closeTabShortcut")}
        </a>
      </Button>
    ),
  },
  seperator: {
    bleed: (
      <Bleed inline={5}>
        <Separator size="xs" my={6} />
      </Bleed>
    ),
  },
};

type ImageBoxProps = {
  overlay: RefObject<HTMLDivElement | null>;
  style: string;
  size: number;
  opacity: number;
  filters: string;
};

const ImageBox = memo(
  (props: ImageBoxProps) => (
    <Box
      id="image"
      ref={props.overlay}
      position="fixed"
      inset={0}
      backgroundSize={props.style === "cover" ? "cover" : `${props.size}%`}
      backgroundRepeat={props.style === "repeat" ? "repeat" : "no-repeat"}
      backgroundPosition="center"
      opacity={`${props.opacity}%`}
      filter={props.filters}
      transform="translateZ(0)"
    />
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.style === nextProps.style &&
      prevProps.size === nextProps.size &&
      prevProps.opacity === nextProps.opacity &&
      prevProps.filters === nextProps.filters
    );
  },
);

export default function Page() {
  const [state, dispatch] = useReducer(pageReducer, { settings: structuredClone(defaultSettings), errors: {} });
  const { settings, errors } = state;

  useEffect(() => {
    (async () => {
      dispatch({ type: "loadSettings", details: await chromeApi.getSettings(), dispatch });
    })();
  }, []);

  const onChange = (type: string, details: any) => {
    dispatch({ type, details, dispatch });
  };

  const ResetButton = memo(
    () => (
      <Button
        size="2xs"
        variant="ghost"
        colorPalette="gray"
        onClick={() => window.confirm(getMessage("resetConfirm")) && onChange("reset", {})}
      >
        <Span color="fg.warning">
          <TriangleAlert size={8} />
        </Span>
        {getMessage("reset")}
      </Button>
    ),
    () => true,
  );

  if (document.body.classList.contains("light")) document.body.style.backgroundColor = settings.color.light;
  else document.body.style.backgroundColor = settings.color.dark;

  const overlay = useRef<HTMLDivElement>(null);
  const filters: string[] = [];

  if (overlay.current) {
    if (settings.image.data) {
      overlay.current.style.backgroundImage = `url(${settings.image.data})`;
      if (settings.image.hue) filters.push(`hue-rotate(${settings.image.hue}deg)`);
      if (settings.image.grayscale) filters.push(`grayscale(${settings.image.grayscale})`);
      if (settings.image.blur) filters.push(`blur(${settings.image.blur}px)`);
    } else overlay.current.style.backgroundImage = "";
  }

  return (
    <>
      <ImageBox
        overlay={overlay}
        style={settings.image.style}
        size={settings.image.size}
        opacity={settings.image.opacity}
        filters={filters.join(" ")}
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
          <Drawer.Content overflowX="hidden">
            <Drawer.Header pb={2} shadow="0 10px 10px 0 var(--shadow-color)" shadowColor="bg.panel" zIndex={1}>
              <Drawer.CloseTrigger asChild pos="initial">
                <CloseButton size="2xs" aria-label={getMessage("close")} />
              </Drawer.CloseTrigger>
              {render.drawer.title}
            </Drawer.Header>

            <Drawer.Body pt={4} pb={6}>
              <form>
                <Form.ColorPicker
                  displayLabel={getMessage("colorLight")}
                  icon={<Sun size={16} strokeWidth={2.5} />}
                  hex={settings.color.light}
                  mb={3}
                  onValueChange={(details) => onChange("setLightColor", details)}
                />
                <Form.ColorPicker
                  displayLabel={getMessage("colorDark")}
                  icon={<Moon size={16} />}
                  hex={settings.color.dark}
                  onValueChange={(details) => onChange("setDarkColor", details)}
                />

                {render.seperator.bleed}

                <Form.FileUpload
                  displayLabel={getMessage("image")}
                  accept="image/*"
                  maxFileSize={8000000}
                  filename={settings.image.filename}
                  onFileReject={(details) => onChange("setImageError", details)}
                  onFileAccept={(details) => onChange("setImage", details)}
                  error={errors.image}
                  removeLabel={getMessage("imageRemove")}
                  onFileRemove={() => onChange("removeImage", {})}
                />

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
                      onValueChange={(details) => onChange("setImageStyle", details)}
                    />

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
                      onValueChange={(details) => onChange("setImageSize", details)}
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
                      onValueChange={(details) => onChange("setImageOpacity", details)}
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
                      onValueChange={(details) => onChange("setImageHue", details)}
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
                      onValueChange={(details) => onChange("setImageGrayscale", details)}
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
                      onValueChange={(details) => onChange("setImageBlur", details)}
                    />
                  </>
                )}

                {render.seperator.bleed}
                {render.closeTab.text}

                <Form.Switch
                  displayLabel={getMessage("closeTabPinned")}
                  tooltip={getMessage("closeTabPinnedHelp")}
                  checked={settings.closeTab.pinned}
                  onCheckedChange={(details) => onChange("setCloseTabPinned", details)}
                />
                <Form.Switch
                  displayLabel={getMessage("closeTabGrouped")}
                  tooltip={getMessage("closeTabGroupedHelp")}
                  checked={settings.closeTab.grouped}
                  onCheckedChange={(details) => onChange("setCloseTabGrouped", details)}
                />

                {render.closeTab.button}
              </form>
            </Drawer.Body>

            <Drawer.Footer pb={2} shadow="0 -10px 10px 0 var(--shadow-color)" shadowColor="bg.panel" zIndex={1}>
              <ResetButton />
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}
