import { memo } from "react";
import { CloseButton, Field, FileUpload, Input, InputGroup, Span, VisuallyHidden } from "@chakra-ui/react";
import { Image } from "lucide-react";

interface FileUploadProps extends FileUpload.RootProps {
  displayLabel: string;
  file?: File;
  error?: string;
  removeLabel: string;
  onFileRemove: Function;
}

const icon = (
  <Span color="fg.info">
    <Image size={16} />
  </Span>
);

const FormFileUpload = (props: FileUploadProps) => {
  const { displayLabel, file, error, removeLabel, onFileRemove, ...restProps } = props;

  return (
    <Field.Root invalid={!!error} mb={4}>
      <FileUpload.Root gap="3" {...restProps}>
        <VisuallyHidden>
          <FileUpload.Label>{displayLabel}</FileUpload.Label>
        </VisuallyHidden>

        {!file && (
          <InputGroup startElement={icon}>
            <Input asChild>
              <FileUpload.Trigger>
                <FileUpload.FileText fallback={displayLabel} lineClamp={1} />
              </FileUpload.Trigger>
            </Input>
          </InputGroup>
        )}

        {file && (
          <InputGroup
            startElement={icon}
            endElement={
              <FileUpload.ClearTrigger asChild>
                <CloseButton
                  colorPalette="orange"
                  size="xs"
                  variant="plain"
                  focusVisibleRing="inside"
                  hidden={false}
                  aria-label={removeLabel}
                  onClick={() => onFileRemove()}
                  data-clear
                />
              </FileUpload.ClearTrigger>
            }
            endElementProps={{ px: 1 }}
          >
            <Input asChild>
              <input value={file.name} readOnly={true} />
            </Input>
          </InputGroup>
        )}

        <FileUpload.HiddenInput />
      </FileUpload.Root>

      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
};

export default memo(FormFileUpload, (prevProps, nextProps) => {
  if (prevProps.error !== nextProps.error) return false;
  return prevProps.file?.name === nextProps.file?.name;
});
