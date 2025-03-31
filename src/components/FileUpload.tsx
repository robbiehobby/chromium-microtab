import { memo } from "react";
import {
  CloseButton,
  Field,
  FileUpload as ChakraFileUpload,
  Input,
  InputGroup,
  Span,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Image } from "lucide-react";

interface FileUploadProps extends ChakraFileUpload.RootProps {
  fieldLabel: string;
  file?: File;
  error?: string;
  removeLabel: string;
  onFileRemove: Function;
}

const icon = (
  <Span color="subtle">
    <Image size={16} />
  </Span>
);

const FileUpload = (props: FileUploadProps) => {
  const { fieldLabel, file, error, removeLabel, onFileRemove, ...restProps } = props;

  return (
    <Field.Root invalid={!!error}>
      <ChakraFileUpload.Root gap={3} {...restProps}>
        <VisuallyHidden asChild>
          <ChakraFileUpload.Label>{fieldLabel}</ChakraFileUpload.Label>
        </VisuallyHidden>

        {!file && (
          <InputGroup startElement={icon}>
            <Input asChild>
              <ChakraFileUpload.Trigger>
                <ChakraFileUpload.FileText fallback={fieldLabel} lineClamp={1} />
              </ChakraFileUpload.Trigger>
            </Input>
          </InputGroup>
        )}

        {file && (
          <InputGroup
            startElement={icon}
            endElement={
              <ChakraFileUpload.ClearTrigger asChild>
                <CloseButton
                  colorPalette="red"
                  size="xs"
                  variant="plain"
                  focusVisibleRing="inside"
                  hidden={false}
                  aria-label={removeLabel}
                  onClick={() => onFileRemove()}
                  data-clear
                />
              </ChakraFileUpload.ClearTrigger>
            }
            endElementProps={{ px: 1 }}
          >
            <Input asChild>
              <input value={file.name} readOnly={true} />
            </Input>
          </InputGroup>
        )}

        <ChakraFileUpload.HiddenInput />
      </ChakraFileUpload.Root>

      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
};

export default memo(FileUpload, (prevProps, nextProps) => {
  if (prevProps.error !== nextProps.error) return false;
  return prevProps.file?.name === nextProps.file?.name;
});
