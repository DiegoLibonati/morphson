import { useEffect } from "react";
import axios from "axios";

import { FormDataLoadJsonPage } from "@src/entities/forms";

import { LoaderSpinner } from "@src/components/Loaders/LoaderSpinner/LoaderSpinner";
import { InputField } from "@src/components/Inputs/InputField/InputField";
import { InputFile } from "@src/components/Inputs/InputFile/InputFile";
import { ButtonSubmit } from "@src/components/Buttons/ButtonSubmit/ButtonSubmit";

import { FormEditorLayout } from "@src/layouts/FormEditorLayout/FormEditorLayout";

import { useForm } from "@src/hooks/useForm";
import { useRouter } from "@src/hooks/useRouter";
import { useEditorContext } from "@src/hooks/useEditorContext";
import { useModalContext } from "@src/hooks/useModalContext";
import { useJSONContext } from "@src/hooks/useJSONContext";

import { safeJsonParse } from "@src/helpers/safeJsonParse";

import { postUploadJson } from "@src/api/post/postUploadJson/postUploadJson";
import { postGetFileContent } from "@src/api/post/postGetFileContent/postGetFileContent";

export const LoadJsonPage = (): JSX.Element => {
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

  const onSubmitForm: React.FormEventHandler<HTMLFormElement> = async (
    e
  ): Promise<void> => {
    try {
      e.preventDefault();
      jsonDispatch({
        type: "LOADING",
        payload: { loading: true },
      });
      console.log("Submit Form");

      const name = formState.jsonName.trim();
      const file = formState.jsonFile;
      const content = jsonState.inputJson.content;

      if (!name || !file || !content) {
        onResetForm();
        return modalDispatch({
          type: "SET_MODAL",
          payload: {
            message: "You must send a valid name, content and file.",
            open: true,
          },
        });
      }

      const body = {
        name: name,
        content: JSON.stringify(content),
      };

      const response = await postUploadJson(body);

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
      return handleNavigateToResolution("uploaded", `name=${name}`);
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e) && e.response) {
        modalDispatch({
          type: "SET_MODAL",
          payload: { message: e.response.data.message, open: true },
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

      const response = await postGetFileContent(formData);

      editorDispatch({
        type: "SET_TEXT",
        payload: { text: response.content },
      });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        modalDispatch({
          type: "SET_MODAL",
          payload: { message: e.response.data.message, open: true },
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
    return () => {
      jsonDispatch({
        type: "CONTEXT_CLEAR",
        payload: null,
      });
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
          JSON.stringify(parsedText) !==
            JSON.stringify(jsonState.inputJson.content)
        }
      >
        Upload JSON
      </ButtonSubmit>
    </FormEditorLayout>
  );
};
