import { Box, Button, CloseButton, Drawer, Field, parseColor, Text, VisuallyHidden } from "@chakra-ui/react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import useStorage, { defaultValues } from "../hooks/storage.ts";
import Form from "../components/form/bundle.ts";
import pageHandler from "./page-handler.ts";
import color from "../components/ui/color.ts";
import getMessage from "./i18n.ts";

export interface PageState {
  values: Record<any, any>;
  setValues: SetStateAction<any>;
  errors: Record<any, any>;
  setErrors: SetStateAction<any>;
}

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const state: PageState = { values, setValues, errors, setErrors };
  const imageBox = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const process = async () => {
      const { getSettings, setSettings } = useStorage();

      if (!loaded) {
        const settings = await getSettings();
        if (Object.keys(settings).length) setValues(settings as typeof defaultValues);
        setLoaded(true);
      }

      if (values.color) document.body.style.backgroundColor = values.color;
      if (values.imageData) imageBox.current.style.backgroundImage = `url(${values.imageData})`;
      else imageBox.current.style.backgroundImage = "";

      await setSettings(values);
    };
    process();

    return () => {};
  }, [values]);

  const imageFilters: string[] = [];
  if (values.imageHue) imageFilters.push(`hue-rotate(${values.imageHue}deg)`);
  if (values.imageGrayscale) imageFilters.push(`grayscale(${values.imageGrayscale})`);
  if (values.imageBlur) imageFilters.push(`blur(${values.imageBlur}px)`);

  return (
    <>
      <Box
        id="image"
        ref={imageBox}
        position="fixed"
        inset={0}
        backgroundSize={values.imageStyle === "cover" ? "cover" : `${values.imageSize}%`}
        backgroundRepeat={values.imageStyle === "repeat" ? "repeat" : "no-repeat"}
        backgroundPosition="center"
        opacity={`${values.imageOpacity}%`}
        filter={imageFilters.join(" ")}
        transform="translateZ(0)"
      />

      <Drawer.Root size="sm">
        <Drawer.Trigger asChild position="fixed" right={10} bottom={10}>
          <Button
            colorPalette="gray"
            variant="surface"
            h="auto"
            p={3}
            rounded="4xl"
            opacity={0.4}
            _hover={{ opacity: 1 }}
            _focus={{ opacity: 1 }}
          >
            <Settings /> <VisuallyHidden>{getMessage("settings")}</VisuallyHidden>
          </Button>
        </Drawer.Trigger>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{getMessage("settings")}</Drawer.Title>
              <Drawer.CloseTrigger asChild pos="initial">
                <CloseButton aria-label={getMessage("close")} />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pb={6}>
              <form>
                <Form.ColorPicker
                  label={getMessage("color")}
                  value={values.color ? parseColor(values.color) : undefined}
                  onValueChange={(details) => pageHandler.color(details, state)}
                  mb={4}
                />

                <Field.Root invalid={!!errors.image} mb={4}>
                  <Form.FileUpload
                    label={getMessage("image")}
                    accept="image/*"
                    maxFileSize={8000000}
                    defaultValue={values.imageName}
                    onFileChange={(details) => pageHandler.image(details, state)}
                    onFileRemove={() => pageHandler.imageRemove(state)}
                  />
                  {errors.image && <Field.ErrorText>{errors.image}</Field.ErrorText>}
                </Field.Root>

                {values.imageData && (
                  <>
                    <Form.SegmentGroup
                      items={{
                        cover: getMessage("imageStyleCover"),
                        repeat: getMessage("imageStyleRepeat"),
                        center: getMessage("imageStyleCenter"),
                      }}
                      value={values.imageStyle}
                      onValueChange={(details) => pageHandler.imageStyle(details, state)}
                      mb="4"
                    />
                    <Box mb={4} px={5} pt={4} pb={1} border="sm" borderColor={color.border.primary} rounded="sm">
                      <Form.Slider
                        label={getMessage("imageSize")}
                        min={0}
                        max={200}
                        step={0.5}
                        unit="%"
                        value={[values.imageSize]}
                        onValueChange={(details) => pageHandler.imageSize(details, state)}
                        disabled={values.imageStyle === "cover"}
                      />
                      <Form.Slider
                        label={getMessage("imageOpacity")}
                        min={0}
                        max={100}
                        step={0.5}
                        unit="%"
                        value={[values.imageOpacity]}
                        onValueChange={(details) => pageHandler.imageOpacity(details, state)}
                      />
                      <Form.Slider
                        label={getMessage("imageHue")}
                        min={0}
                        max={360}
                        step={0.5}
                        unit="deg"
                        value={[values.imageHue]}
                        onValueChange={(details) => pageHandler.imageHue(details, state)}
                      />
                      <Form.Slider
                        label={getMessage("imageGrayscale")}
                        min={0}
                        max={100}
                        step={0.5}
                        unit="%"
                        value={[values.imageGrayscale * 100]}
                        onValueChange={(details) => pageHandler.imageGrayscale(details, state)}
                      />
                      <Form.Slider
                        label={getMessage("imageBlur")}
                        min={0}
                        max={100}
                        step={0.5}
                        unit="%"
                        value={[values.imageBlur]}
                        onValueChange={(details) => pageHandler.imageBlur(details, state)}
                      />
                    </Box>
                  </>
                )}

                <Box px={5} py={4} border="sm" borderColor={color.border.primary} rounded="sm">
                  <Text mb={6} pb={5} borderBottom="sm" borderBottomColor={color.border.primary} fontSize="sm">
                    {getMessage("closeTabDescription")}
                  </Text>

                  <Form.Switch
                    label={getMessage("closeTabPinned")}
                    checked={values.closeTabPinned}
                    onCheckedChange={(details) => pageHandler.closeTabPinned(details, state)}
                    mb={3}
                  />
                  <Form.Switch
                    label={getMessage("closeTabGrouped")}
                    checked={values.closeTabGrouped}
                    onCheckedChange={(details) => pageHandler.closeTabGrouped(details, state)}
                    mb={6}
                  />

                  <Button asChild variant="outline" w="100%">
                    <a
                      href="#"
                      onClick={() => {
                        try {
                          chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
                        } catch (_e) {}
                      }}
                    >
                      {getMessage("closeTabShortcut")}
                    </a>
                  </Button>
                </Box>
              </form>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}
