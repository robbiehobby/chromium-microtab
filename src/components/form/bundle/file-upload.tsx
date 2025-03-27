import { CloseButton, FileUpload, Input, InputGroup, Span, VisuallyHidden } from "@chakra-ui/react";
import { Image } from "lucide-react";

interface FileUploadProps extends FileUpload.RootProps {
  displayLabel: string;
  removeLabel: string;
  defaultValue?: string;
  onFileRemove: Function;
}

export default function FormFileUpload(props: FileUploadProps) {
  const { displayLabel, removeLabel, defaultValue, onFileRemove, ...restProps } = props;

  const Icon = () => {
    return (
      <Span color="fg.muted">
        <Image size={16} />
      </Span>
    );
  };

  return (
    <FileUpload.Root gap="3" {...restProps}>
      <VisuallyHidden>
        <FileUpload.Label>{displayLabel}</FileUpload.Label>
      </VisuallyHidden>

      {!defaultValue && (
        <InputGroup startElement={<Icon />}>
          <Input asChild>
            <FileUpload.Trigger>
              <FileUpload.FileText fallback={displayLabel} lineClamp={1} />
            </FileUpload.Trigger>
          </Input>
        </InputGroup>
      )}

      {defaultValue && (
        <InputGroup
          startElement={<Icon />}
          endElement={
            <FileUpload.ClearTrigger asChild>
              <CloseButton
                size="xs"
                variant="plain"
                focusVisibleRing="inside"
                pointerEvents="auto"
                hidden={false}
                aria-label={removeLabel}
                onClick={() => onFileRemove()}
              />
            </FileUpload.ClearTrigger>
          }
          endElementProps={{ px: 1 }}
        >
          <Input asChild>
            <input value={defaultValue} readOnly={true} />
          </Input>
        </InputGroup>
      )}

      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
}
