import { Image } from "lucide-react";
import { Box, CloseButton, FileUpload, Input, InputGroup, VisuallyHidden } from "@chakra-ui/react";
import { FormProps } from "../bundle.ts";
import getMessage from "../../../app/i18n.ts";

interface FileUploadProps extends FileUpload.RootProps, FormProps {
  label: string;
  defaultValue?: string;
  onFileRemove: Function;
}

export default function FileUploadElement(props: FileUploadProps) {
  const { label, defaultValue, onFileRemove, ...restProps } = props;

  const Icon = () => {
    return (
      <Box color={{ base: "gray.500", _dark: "gray.400" }}>
        <Image size={16} />
      </Box>
    );
  };

  return (
    <FileUpload.Root gap="3" {...restProps}>
      <FileUpload.HiddenInput />
      <VisuallyHidden>
        <FileUpload.Label>{label}</FileUpload.Label>
      </VisuallyHidden>

      {!defaultValue && (
        <InputGroup startElement={<Icon />}>
          <Input asChild>
            <FileUpload.Trigger>
              <FileUpload.FileText fallback={label} lineClamp={1} />
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
                me="-2"
                size="xs"
                variant="plain"
                focusVisibleRing="inside"
                pointerEvents="auto"
                hidden={false}
                aria-label={getMessage("imageRemove")}
                onClick={() => onFileRemove()}
              />
            </FileUpload.ClearTrigger>
          }
        >
          <Input asChild>
            <input value={defaultValue} readOnly={true} />
          </Input>
        </InputGroup>
      )}
    </FileUpload.Root>
  );
}
