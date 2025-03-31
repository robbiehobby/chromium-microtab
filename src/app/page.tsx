import { memo, useEffect, useReducer, useState } from "react";
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

const Image = memo(
  (props: { url: string | null; settings: Settings }) => {
    if (!props.url) return null;
    const { url, settings } = props;

    const filters: string[] = [];
    if (settings.image.hue) filters.push(`hue-rotate(${settings.image.hue}deg)`);
    if (settings.image.grayscale) filters.push(`grayscale(${settings.image.grayscale})`);
    if (settings.image.blur) filters.push(`blur(${settings.image.blur}px)`);

    return (
      <Box
        id="image"
        position="fixed"
        inset={0}
        opacity={`${settings.image.opacity}%`}
        filter={filters.join(" ")}
        backgroundImage={`url(${url})`}
        backgroundSize={settings.image.style === "cover" ? "cover" : `${settings.image.size}%`}
        backgroundRepeat={settings.image.style === "repeat" ? "repeat" : "no-repeat"}
        backgroundPosition="center"
        transform="translateZ(0)"
        willChange="transform"
        backfaceVisibility="hidden"
      />
    );
  },
  (prevProps, nextProps) => {
    const { blob: prevBlob, ...prevImage } = prevProps.settings.image;
    const { blob: nextBlob, ...nextImage } = nextProps.settings.image;
    return prevProps.url === nextProps.url && JSON.stringify(prevImage) === JSON.stringify(nextImage);
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

  if (document.body.classList.contains("light")) {
    document.body.style.backgroundColor = settings.color.light || "";
  } else {
    document.body.style.backgroundColor = settings.color.dark || "";
  }

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string = "";
    if (settings.image.blob) {
      url = URL.createObjectURL(new Blob([settings.image.blob], { type: settings.image.blob.type }));
    }
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [settings.image.blob]);

  const onChange = (type: string, details: any) => {
    dispatch({ type, details, dispatch });
  };

  const ResetButton = memo(
    () => (
      <Button
        size="2xs"
        variant="ghost"
        colorPalette="orange"
        onClick={() => window.confirm(getMessage("resetConfirm")) && onChange("reset", {})}
      >
        <Span>
          <TriangleAlert size={8} />
        </Span>
        {getMessage("reset")}
      </Button>
    ),
    () => true,
  );

  return (
    <>
      <Image url={imageUrl} settings={structuredClone(settings)} />

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
            _hover={{ opacity: 1, color: { base: "blue.600", _dark: "blue.400" } }}
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
                  icon={
                    <Span color="orange.400">
                      <Sun size={16} strokeWidth={2.5} />
                    </Span>
                  }
                  hex={settings.color.light || "#fafafa"}
                  mb={3}
                  onValueChange={(details) => onChange("setLightColor", details)}
                />
                <Form.ColorPicker
                  displayLabel={getMessage("colorDark")}
                  icon={
                    <Span color="purple.400">
                      <Moon size={16} />
                    </Span>
                  }
                  hex={settings.color.dark || "#111"}
                  onValueChange={(details) => onChange("setDarkColor", details)}
                />

                {render.seperator.bleed}

                <Form.FileUpload
                  displayLabel={getMessage("image")}
                  accept="image/*"
                  maxFileSize={8000000}
                  file={settings.image.blob}
                  onFileReject={(details) => onChange("setImageError", details)}
                  onFileAccept={(details) => onChange("setImage", details)}
                  error={errors.image}
                  removeLabel={getMessage("imageRemove")}
                  onFileRemove={() => onChange("removeImage", {})}
                />

                {settings.image.blob && (
                  <>
                    <Form.SegmentGroup
                      displayLabel={getMessage("imageStyle")}
                      size="sm"
                      mb={4}
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
                      value={settings.image.style}
                      onValueChange={(details) => onChange("setImageStyle", details)}
                    />

                    <Form.Slider
                      displayLabel={getMessage("imageSize")}
                      tooltip={
                        settings.image.style === "cover"
                          ? getMessage("imageSizeDisabledHelp")
                          : getMessage("imageSizeHelp")
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
                      displayLabel={getMessage("imageOpacity")}
                      tooltip={getMessage("imageOpacityHelp")}
                      size="sm"
                      unit="%"
                      step={0.5}
                      min={0}
                      max={100}
                      value={[settings.image.opacity]}
                      onValueChange={(details) => onChange("setImageOpacity", details)}
                    />
                    <Form.Slider
                      displayLabel={getMessage("imageHue")}
                      tooltip={getMessage("imageHueHelp")}
                      size="sm"
                      unit="deg"
                      step={0.5}
                      min={0}
                      max={360}
                      value={[settings.image.hue]}
                      onValueChange={(details) => onChange("setImageHue", details)}
                    />
                    <Form.Slider
                      displayLabel={getMessage("imageGrayscale")}
                      tooltip={getMessage("imageGrayscaleHelp")}
                      size="sm"
                      unit="%"
                      step={0.5}
                      min={0}
                      max={100}
                      value={[settings.image.grayscale * 100]}
                      onValueChange={(details) => onChange("setImageGrayscale", details)}
                    />
                    <Form.Slider
                      displayLabel={getMessage("imageBlur")}
                      tooltip={getMessage("imageBlurHelp")}
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
