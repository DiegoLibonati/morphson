import { useEffect } from "react";
import axios from "axios";

import type { JSX } from "react";
import type { FormDataLoadJsonPage } from "@/types/forms";

import LoaderSpinner from "@/components/Loaders/LoaderSpinner/LoaderSpinner";
import InputField from "@/components/Inputs/InputField/InputField";
import InputFile from "@/components/Inputs/InputFile/InputFile";
import ButtonSubmit from "@/components/Buttons/ButtonSubmit/ButtonSubmit";

import FormEditorLayout from "@/layouts/FormEditorLayout/FormEditorLayout";

import { useForm } from "@/hooks/useForm";
import { useRouter } from "@/hooks/useRouter";
import { useEditorContext } from "@/hooks/useEditorContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useJSONContext } from "@/hooks/useJSONContext";

import { safeJsonParse } from "@/helpers/safeJsonParse";

import inputService from "@/services/inputService";
import fileService from "@/services/fileService";

const LoadJsonPage = (): JSX.Element => {
  const { state: jsonState, dispatch: jsonDispatch } = useJSONContext();
  const { dispatch: modalDispatch } = useModalContext();
  const { state: editorState, dispatch: editorDispatch } = useEditorContext();

  const { handleNavigateToResolution } = useRouter();
  const { formState, onInputChange, onInputFileChange, onResetForm } =
    useForm<FormDataLoadJsonPage>({
      initialValueForm: {
        jsonName: "",
        jsonFile: null,
      },
    });

  const parsedText = safeJsonParse(editorState.text)
    ? safeJsonParse(editorState.text)
    : editorState.text;

  const onSubmitForm = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    try {
      e.preventDefault();
      jsonDispatch({
        type: "LOADING",
        payload: { loading: true },
      });

      const name = formState.jsonName.trim();
      const file = formState.jsonFile;
      const content = jsonState.inputJson.content;

      if (!name || !file || !content) {
        onResetForm();
        modalDispatch({
          type: "SET_MODAL",
          payload: {
            message: "You must send a valid name, content and file.",
            open: true,
          },
        });
        return;
      }

      const body = {
        name: name,
        content: JSON.stringify(content),
      };

      const response = await inputService.upload(body);

      jsonDispatch({
        type: "INPUT_JSON_UPDATE",
        payload: {
          id: response.data.inputJson.id,
          name: response.data.inputJson.name,
          content: response.data.inputJson.content,
          keys: response.data.inputJson.keys,
        },
      });
      jsonDispatch({
        type: "LOADING",
        payload: { loading: false },
      });
      handleNavigateToResolution("uploaded", `name=${name}`);
      return;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        modalDispatch({
          type: "SET_MODAL",
          payload: { message: (e.response.data as { message: string }).message, open: true },
        });
      } else {
        modalDispatch({
          type: "SET_MODAL",
          payload: { message: "An unexpected error occurred.", open: true },
        });
      }
      jsonDispatch({
        type: "LOADING",
        payload: { loading: false },
      });
    }
  };

  const updateFile = async (): Promise<void> => {
    try {
      const formData = new FormData();

      formData.append("file", formState.jsonFile!);

      const response = await fileService.getContent(formData);

      editorDispatch({
        type: "SET_TEXT",
        payload: { text: response.data },
      });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        modalDispatch({
          type: "SET_MODAL",
          payload: { message: (e.response.data as { message: string }).message, open: true },
        });
      } else {
        modalDispatch({
          type: "SET_MODAL",
          payload: { message: "An unexpected error occurred.", open: true },
        });
      }

      jsonDispatch({
        type: "LOADING",
        payload: { loading: false },
      });
    }
  };

  useEffect(() => {
    return (): void => {
      jsonDispatch({
        type: "CONTEXT_CLEAR",
        payload: null,
      });
    };
  }, []);

  useEffect(() => {
    if (!formState.jsonFile) return;

    void updateFile();
  }, [formState.jsonFile]);

  return (
    <FormEditorLayout
      onSubmit={(e) => {
        void onSubmitForm(e);
      }}
      LoadingComponent={(): JSX.Element => <LoaderSpinner></LoaderSpinner>}
      jsonTypeToEdit="input"
      loading={jsonState.loading}
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
          JSON.stringify(parsedText) !== JSON.stringify(jsonState.inputJson.content)
        }
      >
        Upload JSON
      </ButtonSubmit>
    </FormEditorLayout>
  );
};

export default LoadJsonPage;
