import { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Switch } from "@chakra-ui/react";

interface SwitchProps extends Switch.RootProps {
  displayLabel: string | ReactNode;
}

export default function FormSwitch(props: SwitchProps) {
  const { displayLabel, ...restProps } = props;

  return (
    <Switch.Root display="flex" justifyContent="space-between" {...restProps}>
      <Switch.Label>{displayLabel}</Switch.Label>

      <Switch.Control>
        <Switch.Thumb>
          <Switch.ThumbIndicator fallback={<X size={12} color="black" />}>
            <Check size={12} color="black" />
          </Switch.ThumbIndicator>
        </Switch.Thumb>
      </Switch.Control>

      <Switch.HiddenInput />
    </Switch.Root>
  );
}
