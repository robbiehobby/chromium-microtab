import { memo, ReactNode } from "react";
import { ColorPicker, Portal, VisuallyHidden, InputGroup, Stack, HStack, parseColor } from "@chakra-ui/react";

interface ColorPickerProps extends ColorPicker.RootProps {
  displayLabel: string | ReactNode;
  icon: ReactNode;
  hex: string;
}

const FormColorPicker = (props: ColorPickerProps) => {
  const { displayLabel, icon, hex, ...restProps } = props;

  if (hex) restProps.value = parseColor(hex);

  return (
    <ColorPicker.Root format="hsla" gap="4" {...restProps}>
      <VisuallyHidden>
        <ColorPicker.Label>{displayLabel}</ColorPicker.Label>
      </VisuallyHidden>

      <ColorPicker.Control>
        <InputGroup
          w="full"
          startElement={icon}
          endElementProps={{ px: 1 }}
          endElement={
            <ColorPicker.Trigger border={0} outlineWidth={2} outlineOffset={-9} rounded="full">
              <Stack p={0.5} border="subtle" rounded="full">
                <ColorPicker.ValueSwatch boxSize="4.5" shadow="none" rounded="full" />
              </Stack>
            </ColorPicker.Trigger>
          }
        >
          <ColorPicker.Input />
        </InputGroup>
      </ColorPicker.Control>

      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content zIndex={99999}>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper colorPalette="gray" size="xs" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>

      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  );
};

export default memo(FormColorPicker, (prevProps, nextProps) => {
  return prevProps.hex === nextProps.hex;
});
