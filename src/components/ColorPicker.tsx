import { memo, ReactNode } from "react";
import {
  ColorPicker as ChakraColorPicker,
  Portal,
  VisuallyHidden,
  InputGroup,
  Stack,
  HStack,
  parseColor,
} from "@chakra-ui/react";

interface ColorPickerProps extends ChakraColorPicker.RootProps {
  fieldLabel: string | ReactNode;
  icon: ReactNode;
  hex: string;
}

const ColorPicker = (props: ColorPickerProps) => {
  const { fieldLabel, icon, hex, ...restProps } = props;

  if (hex) restProps.value = parseColor(hex);

  return (
    <ChakraColorPicker.Root format="hsla" gap={4} {...restProps}>
      <VisuallyHidden asChild>
        <ChakraColorPicker.Label>{fieldLabel}</ChakraColorPicker.Label>
      </VisuallyHidden>

      <ChakraColorPicker.Control>
        <InputGroup
          w="full"
          startElement={icon}
          endElementProps={{ px: 1 }}
          endElement={
            <ChakraColorPicker.Trigger border={0} outlineWidth={2} outlineOffset={-9} rounded="full">
              <Stack p={0.5} border="subtle" rounded="full">
                <ChakraColorPicker.ValueSwatch boxSize="4.5" shadow="none" rounded="full" />
              </Stack>
            </ChakraColorPicker.Trigger>
          }
        >
          <ChakraColorPicker.Input />
        </InputGroup>
      </ChakraColorPicker.Control>

      <Portal>
        <ChakraColorPicker.Positioner>
          <ChakraColorPicker.Content zIndex={99999}>
            <ChakraColorPicker.Area />
            <HStack>
              <ChakraColorPicker.EyeDropper colorPalette="gray" size="xs" variant="outline" />
              <ChakraColorPicker.Sliders />
            </HStack>
          </ChakraColorPicker.Content>
        </ChakraColorPicker.Positioner>
      </Portal>

      <ChakraColorPicker.HiddenInput />
    </ChakraColorPicker.Root>
  );
};

export default memo(ColorPicker, (prevProps, nextProps) => {
  return prevProps.hex === nextProps.hex;
});
