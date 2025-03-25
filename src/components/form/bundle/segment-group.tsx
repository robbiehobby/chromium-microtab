import { SegmentGroup } from "@chakra-ui/react";

interface SegmentGroupProps extends SegmentGroup.RootProps {
  items: { [key: string]: string };
}

export default function SegmentGroupElement(props: SegmentGroupProps) {
  const { items, ...restProps } = props;

  return (
    <SegmentGroup.Root w="100%" {...restProps}>
      <SegmentGroup.Indicator />
      {Object.entries(items).map(([key, value]) => (
        <SegmentGroup.Item key={key} value={key} w="100%" justifyContent="center">
          <SegmentGroup.ItemText>{value}</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
