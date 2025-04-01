import { memo, useEffect, useReducer, useState } from "react";
import { Bleed, Box, Button, CloseButton, Drawer, HStack, Separator, Span, Stack, Text } from "@chakra-ui/react";
import { Expand, Fullscreen, Keyboard, LayoutGrid, Moon, Settings, Sun, TriangleAlert } from "lucide-react";
import ColorPicker from "../../../components/ColorPicker.tsx";
import FileUpload from "../../../components/FileUpload.tsx";
import SegmentGroup from "../../../components/SegmentGroup.tsx";
import Slider from "../../../components/Slider.tsx";
import Switch from "../../../components/Switch.tsx";
import Tooltip from "../../../components/Tooltip.tsx";
import chromeApi, { defaultSettings } from "../api/chrome.ts";
import pageReducer from "./page-handler.ts";

const render = {
  drawer: {
    title: (
      <Text as="h2" textStyle="lg" fontWeight="semibold">
        {chromeApi.getMessage("settings")}
      </Text>
    ),
  },
  close: {
    text: (
      <Text mb={3} fontSize="sm">
        {chromeApi.getMessage("closeDescription")}
      </Text>
    ),
    button: (
      <Button asChild size="sm" variant="outline" w="full" mt={4}>
        <a href="#" onClick={() => chromeApi.openShortcuts()}>
          <Keyboard /> {chromeApi.getMessage("closeShortcut")}
        </a>
      </Button>
    ),
  },
  seperator: {
    bleed: (
      <Bleed inline={5}>
        <Separator size="xs" my={2} />
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
        onClick={() => window.confirm(chromeApi.getMessage("resetConfirm")) && onChange("reset", {})}
      >
        <Span>
          <TriangleAlert size={8} />
        </Span>
        {chromeApi.getMessage("reset")}
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
            _hover={{ opacity: 1, color: "focus" }}
            _focus={{ opacity: 1 }}
            _focusVisible={{ outlineColor: "focus", color: "focus" }}
            aria-label={chromeApi.getMessage("settings")}
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
                <CloseButton size="2xs" aria-label={chromeApi.getMessage("close")} />
              </Drawer.CloseTrigger>
              {render.drawer.title}
            </Drawer.Header>

            <Drawer.Body pt={4} pb={6}>
              <Stack as="form" gap={3}>
                <ColorPicker
                  fieldLabel={chromeApi.getMessage("colorLight")}
                  icon={
                    <Span color="orange.400">
                      <Sun size={16} strokeWidth={2.5} />
                    </Span>
                  }
                  hex={settings.color.light || "#fafafa"}
                  onValueChange={(details) => onChange("setLightColor", details)}
                />
                <ColorPicker
                  fieldLabel={chromeApi.getMessage("colorDark")}
                  icon={
                    <Span color="purple.400">
                      <Moon size={16} />
                    </Span>
                  }
                  hex={settings.color.dark || "#111"}
                  onValueChange={(details) => onChange("setDarkColor", details)}
                />

                {render.seperator.bleed}

                <FileUpload
                  fieldLabel={chromeApi.getMessage("image")}
                  accept="image/*"
                  maxFileSize={8000000}
                  file={settings.image.blob}
                  onFileReject={(details) => onChange("setImageError", details)}
                  onFileAccept={(details) => onChange("setImage", details)}
                  error={errors.image}
                  removeLabel={chromeApi.getMessage("imageRemove")}
                  onFileRemove={() => onChange("removeImage", {})}
                />

                {settings.image.blob && (
                  <>
                    <SegmentGroup
                      fieldLabel={chromeApi.getMessage("imageStyle")}
                      size="sm"
                      mb={3}
                      items={{
                        cover: (
                          <Tooltip.Root content={chromeApi.getMessage("imageStyleCoverHelp")}>
                            <HStack>
                              <Expand size={13} /> {chromeApi.getMessage("imageStyleCover")}
                            </HStack>
                          </Tooltip.Root>
                        ),
                        repeat: (
                          <Tooltip.Root content={chromeApi.getMessage("imageStyleRepeatHelp")}>
                            <HStack>
                              <LayoutGrid size={13} /> {chromeApi.getMessage("imageStyleRepeat")}
                            </HStack>
                          </Tooltip.Root>
                        ),
                        center: (
                          <Tooltip.Root content={chromeApi.getMessage("imageStyleCenterHelp")}>
                            <HStack>
                              <Fullscreen size={13} /> {chromeApi.getMessage("imageStyleCenter")}
                            </HStack>
                          </Tooltip.Root>
                        ),
                      }}
                      value={settings.image.style}
                      onValueChange={(details) => onChange("setImageStyle", details)}
                    />

                    <Slider
                      fieldLabel={chromeApi.getMessage("imageSize")}
                      tooltip={
                        settings.image.style === "cover"
                          ? chromeApi.getMessage("imageSizeDisabledHelp")
                          : chromeApi.getMessage("imageSizeHelp")
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
                    <Slider
                      fieldLabel={chromeApi.getMessage("imageOpacity")}
                      tooltip={chromeApi.getMessage("imageOpacityHelp")}
                      size="sm"
                      unit="%"
                      step={0.5}
                      min={0}
                      max={100}
                      value={[settings.image.opacity]}
                      onValueChange={(details) => onChange("setImageOpacity", details)}
                    />
                    <Slider
                      fieldLabel={chromeApi.getMessage("imageHue")}
                      tooltip={chromeApi.getMessage("imageHueHelp")}
                      size="sm"
                      unit="deg"
                      step={0.5}
                      min={0}
                      max={360}
                      value={[settings.image.hue]}
                      onValueChange={(details) => onChange("setImageHue", details)}
                    />
                    <Slider
                      fieldLabel={chromeApi.getMessage("imageGrayscale")}
                      tooltip={chromeApi.getMessage("imageGrayscaleHelp")}
                      size="sm"
                      unit="%"
                      step={0.5}
                      min={0}
                      max={100}
                      value={[settings.image.grayscale * 100]}
                      onValueChange={(details) => onChange("setImageGrayscale", details)}
                    />
                    <Slider
                      fieldLabel={chromeApi.getMessage("imageBlur")}
                      tooltip={chromeApi.getMessage("imageBlurHelp")}
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
                {render.close.text}

                <Switch
                  fieldLabel={chromeApi.getMessage("closePinned")}
                  tooltip={chromeApi.getMessage("closePinnedHelp")}
                  checked={settings.close.pinned}
                  onCheckedChange={(details) => onChange("setClosePinned", details)}
                />
                <Switch
                  fieldLabel={chromeApi.getMessage("closeGrouped")}
                  tooltip={chromeApi.getMessage("closeGroupedHelp")}
                  checked={settings.close.grouped}
                  onCheckedChange={(details) => onChange("setCloseGrouped", details)}
                />
                <Switch
                  fieldLabel={chromeApi.getMessage("closeEmpty")}
                  tooltip={chromeApi.getMessage("closeEmptyHelp")}
                  checked={settings.close.empty}
                  onCheckedChange={(details) => onChange("setCloseEmpty", details)}
                />

                {render.close.button}
              </Stack>
            </Drawer.Body>

            <Drawer.Footer pt={3} py={5} shadow="0 -10px 10px 0 var(--shadow-color)" shadowColor="bg.panel" zIndex={1}>
              <ResetButton />
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}
