import { ReactNode } from "react";
import { SegmentGroup, VisuallyHidden } from "@chakra-ui/react";

interface SegmentGroupProps extends SegmentGroup.RootProps {
  displayLabel: string | ReactNode;
  items: { [key: string]: string | ReactNode };
}

export default function FormSegmentGroup(props: SegmentGroupProps) {
  const { displayLabel, items, ...restProps } = props;

  return (
    <SegmentGroup.Root w="full" {...restProps}>
      <VisuallyHidden>{displayLabel}</VisuallyHidden>
      <SegmentGroup.Indicator backgroundColor="colorPalette.subtle" />

      {Object.entries(items).map(([key, value]) => (
        <SegmentGroup.Item key={key} value={key} w="full" justifyContent="center">
          <SegmentGroup.ItemText>{value}</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
