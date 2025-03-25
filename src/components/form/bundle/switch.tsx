import { Check, X } from "lucide-react";
import { Switch } from "@chakra-ui/react";
import { FormProps } from "../bundle.ts";

interface SwitchProps extends Switch.RootProps, FormProps {
  label: string;
}

export default function SwitchElement(props: SwitchProps) {
  const { label, ...restProps } = props;

  return (
    <Switch.Root w="100%" justifyContent="space-between" gap="3" size="lg" {...restProps}>
      <Switch.HiddenInput />
      <Switch.Label>{label}</Switch.Label>
      <Switch.Control>
        <Switch.Thumb>
          <Switch.ThumbIndicator fallback={<X size={14} color="black" />}>
            <Check size={14} color="black" />
          </Switch.ThumbIndicator>
        </Switch.Thumb>
      </Switch.Control>
    </Switch.Root>
  );
}
