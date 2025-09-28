import { useEffect } from "react";
import axios from "axios";

import { LoaderSpinner } from "@src/components/Loaders/export";
import { ButtonSubmit } from "@src/components/Buttons/export";
import { InputField, InputFile } from "@src/components/Inputs/export";

import {
  useEditorContext,
  useJSONContext,
  useModalContext,
} from "@src/contexts/export";
import { FormEditorLayout } from "@src/layouts/export";
import { useForm, useRouter } from "@src/hooks/export";
import { postGetFileContent, postUploadJson } from "@src/services/export";
import { safeJsonParse } from "@src/helpers/export";

type FormData = {
  jsonName: string;
  jsonFile: File | null;
};

export const LoadJsonPage = (): JSX.Element => {
  const {
    loading,
    inputJson,
    handleClearJson,
    handleUpdateInputJson,
    handleLoading,
  } = useJSONContext();
  const { handleSetModal } = useModalContext();
  const { text, handleSetText } = useEditorContext();

  const { handleNavigateToResolution } = useRouter();
  const { formState, onInputChange, onInputFileChange, onResetForm } =
    useForm<FormData>({
      initialValueForm: {
        jsonName: "",
        jsonFile: null,
      },
    });

  const parsedText = safeJsonParse(text) ? safeJsonParse(text) : text;

  const onSubmitForm: React.FormEventHandler<HTMLFormElement> = async (
    e
  ): Promise<void> => {
    try {
      e.preventDefault();
      handleLoading(true);
      console.log("Submit Form");

      const name = formState.jsonName.trim();
      const file = formState.jsonFile;
      const content = inputJson.content;

      if (!name || !file || !content) {
        onResetForm();
        return handleSetModal({
          message: "You must send a valid name, content and file.",
          open: true,
        });
      }

      const body = {
        name: name,
        content: JSON.stringify(content),
      };

      const response = await postUploadJson(body);

      const data = response.data.data;

      handleUpdateInputJson({
        id: data.inputJson.id,
        name: data.inputJson.name,
        content: data.inputJson.content,
        keys: data.inputJson.keys,
        keysAndValues: data.inputJson.keysAndValues,
        createdAt: data.inputJson.createdAt,
        updatedAt: data.inputJson.updatedAt,
      });
      handleLoading(false);
      return handleNavigateToResolution("uploaded", `name=${name}`);
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e) && e.response) {
        handleSetModal({ message: e.response.data.message, open: true });
      } else {
        handleSetModal({
          message: "An unexpected error occurred.",
          open: true,
        });
      }
      handleLoading(false);
    }
  };

  const updateFile = async (): Promise<void> => {
    try {
      const formData = new FormData();

      formData.append("file", formState.jsonFile!);

      const response = await postGetFileContent(formData);

      const data = await response.data;

      handleSetText(data.content);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        handleSetModal({ message: e.response.data.message, open: true });
      } else {
        handleSetModal({
          message: "An unexpected error occurred.",
          open: true,
        });
      }

      handleLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      handleClearJson();
    };
  }, []);

  useEffect(() => {
    if (!formState.jsonFile) return;

    updateFile();
  }, [formState.jsonFile]);

  return (
    <FormEditorLayout
      onSubmit={onSubmitForm}
      LoadingComponent={() => <LoaderSpinner></LoaderSpinner>}
      jsonTypeToEdit="input"
      loading={loading}
    >
      <InputField
        id="json_name"
        label="JSON Name"
        placeholder="My personal JSON"
        name="jsonName"
        value={formState.jsonName}
        className="lg:bg-primary"
        onChange={onInputChange}
      ></InputField>
      <InputFile
        id="json_file"
        label="Upload JSON"
        name="jsonFile"
        value={formState.jsonFile ? formState.jsonFile.name : ""}
        buttonLabel="Select a JSON"
        emptyLabel="No JSON selected"
        accept=".json"
        spanClassName="lg:bg-primary"
        onChange={onInputFileChange}
      ></InputFile>
      <ButtonSubmit
        ariaLabel="Submit Form Load Json"
        className="lg:bg-primary"
        disabled={
          !formState.jsonName ||
          JSON.stringify(parsedText) !== JSON.stringify(inputJson.content)
        }
      >
        Upload JSON
      </ButtonSubmit>
    </FormEditorLayout>
  );
};
