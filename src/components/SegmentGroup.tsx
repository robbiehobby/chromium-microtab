import { memo, ReactNode, useEffect, useState } from "react";
import { Box, FieldLabel, SegmentGroup as ChakraSegmentGroup, VisuallyHidden, Field } from "@chakra-ui/react";

interface SegmentGroupProps extends ChakraSegmentGroup.RootProps {
  fieldLabel: string | ReactNode;
  items: { [key: string]: string | ReactNode };
  value: string;
}

const SegmentGroup = (props: SegmentGroupProps) => {
  const { fieldLabel, items, value, ...restProps } = props;
  const [currentValue, setCurrentValue] = useState<string | null>(null);

  useEffect(() => {
    // Wait until the next animation frame to set the current value, ensuring
    // that the indicator is rendered when it is initially hidden.
    const requestId = requestAnimationFrame(() => setCurrentValue(value));
    return () => cancelAnimationFrame(requestId);
  }, [value]);

  return (
    <Field.Root>
      <ChakraSegmentGroup.Root asChild w="full" value={currentValue ?? undefined} {...restProps}>
        <Box>
          <VisuallyHidden asChild>
            <FieldLabel>{fieldLabel}</FieldLabel>
          </VisuallyHidden>
          <ChakraSegmentGroup.Indicator backgroundColor="colorPalette.subtle" />

          {Object.entries(items).map(([key, value]) => (
            <ChakraSegmentGroup.Item key={key} value={key} w="full" justifyContent="center">
              <ChakraSegmentGroup.ItemText>{value}</ChakraSegmentGroup.ItemText>
              <ChakraSegmentGroup.ItemHiddenInput />
            </ChakraSegmentGroup.Item>
          ))}
        </Box>
      </ChakraSegmentGroup.Root>
    </Field.Root>
  );
};

export default memo(SegmentGroup, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
