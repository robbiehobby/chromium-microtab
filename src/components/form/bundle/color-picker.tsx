import { Palette } from "lucide-react";
import { ColorPicker, HStack, Portal, VisuallyHidden, Box } from "@chakra-ui/react";
import { FormProps } from "../bundle.ts";
import color from "../../ui/color.ts";

interface ColorPickerProps extends ColorPicker.RootProps, FormProps {
  label: string;
}

export default function ColorPickerElement(props: ColorPickerProps) {
  const { label, ...restProps } = props;

  return (
    <ColorPicker.Root gap="4" {...restProps}>
      <ColorPicker.HiddenInput />
      <VisuallyHidden>
        <ColorPicker.Label>{label}</ColorPicker.Label>
      </VisuallyHidden>
      <ColorPicker.Control border="sm" rounded="sm" borderColor={{ base: "gray.200", _dark: "gray.800" }}>
        <Box
          position="absolute"
          h="100%"
          display="flex"
          alignItems="center"
          paddingInline="3"
          color={{ base: "gray.500", _dark: "gray.400" }}
        >
          <Palette size={16} />
        </Box>
        <ColorPicker.Input border="0" paddingInline="10" />
        <ColorPicker.Trigger border="0" />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content zIndex={99999}>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper colorPalette={color.palette.primary} variant="outline" size="xs" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}
