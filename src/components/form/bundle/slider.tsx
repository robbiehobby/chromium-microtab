import { HStack, Slider } from "@chakra-ui/react";
import { FormProps } from "../bundle.ts";

interface SliderProps extends Slider.RootProps, FormProps {
  label: string;
  min: number;
  max: number;
  unit: string;
}

export default function SliderElement(props: SliderProps) {
  const { label, unit, ...restProps } = props;
  const marks = [{ value: restProps.max / 2, label: "" }];

  return (
    <Slider.Root size="sm" gap="2" {...restProps}>
      <HStack justify="space-between">
        <Slider.Label>{props.label}</Slider.Label>
        <HStack gap="0" color={{ base: "gray.500", _dark: "gray.400" }}>
          <Slider.ValueText />
          {unit}
        </HStack>
      </HStack>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
        <Slider.Marks marks={marks} mb="0" />
      </Slider.Control>
    </Slider.Root>
  );
}
