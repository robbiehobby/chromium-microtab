import { memo, ReactNode, useEffect, useState } from "react";
import { Box, SegmentGroup, VisuallyHidden } from "@chakra-ui/react";

interface SegmentGroupProps extends SegmentGroup.RootProps {
  displayLabel: string | ReactNode;
  items: { [key: string]: string | ReactNode };
  value: string;
}

const FormSegmentGroup = (props: SegmentGroupProps) => {
  const { displayLabel, items, value, ...restProps } = props;
  const [currentValue, setCurrentValue] = useState<string | null>(null);

  useEffect(() => {
    // Wait until the next animation frame to set the current value, ensuring
    // that the indicator is rendered when it is initially hidden.
    const requestId = requestAnimationFrame(() => setCurrentValue(value));
    return () => cancelAnimationFrame(requestId);
  }, [value]);

  return (
    <SegmentGroup.Root asChild w="full" value={currentValue ?? undefined} {...restProps}>
      <Box>
        <VisuallyHidden>{displayLabel}</VisuallyHidden>
        <SegmentGroup.Indicator backgroundColor="colorPalette.subtle" />

        {Object.entries(items).map(([key, value]) => (
          <SegmentGroup.Item key={key} value={key} w="full" justifyContent="center">
            <SegmentGroup.ItemText>{value}</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        ))}
      </Box>
    </SegmentGroup.Root>
  );
};

export default memo(FormSegmentGroup, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
