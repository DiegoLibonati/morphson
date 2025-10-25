import React, { useEffect } from "react";
import axios from "axios";

import { FormDataTransformJsonPage } from "@src/entities/forms";

import { LoaderSpinner } from "@src/components/Loaders/LoaderSpinner/LoaderSpinner";
import { SelectNormal } from "@src/components/Selects/SelectNormal/SelectNormal";
import { SelectOption } from "@src/components/Selects/SelectOption/SelectOption";
import { InputCheck } from "@src/components/Inputs/InputCheck/InputCheck";
import { InputField } from "@src/components/Inputs/InputField/InputField";
import { ButtonSubmit } from "@src/components/Buttons/ButtonSubmit/ButtonSubmit";

import { FormEditorLayout } from "@src/layouts/FormEditorLayout/FormEditorLayout";

import { useForm } from "@src/hooks/useForm";
import { useEditorContext } from "@src/hooks/useEditorContext";
import { useModalContext } from "@src/hooks/useModalContext";
import { useJSONContext } from "@src/hooks/useJSONContext";

import { safeJsonParse } from "@src/helpers/safeJsonParse";
import { getContentFromBlob } from "@src/helpers/getContentFromBlob";

import { getJsonInput } from "@src/api/get/getJsonInput/getJsonInput";
import { getJsonOutput } from "@src/api/get/getJsonOutput/getJsonOutput";
import { postTransformJson } from "@src/api/post/postTransformJson/postTransformJson";
import { getJsonInputs } from "@src/api/get/getJsonInputs/getJsonInputs";
import { getJsonOutputs } from "@src/api/get/getJsonOutputs/getJsonOutputs";

export const TransformJsonPage = (): JSX.Element => {
  const { state: jsonState, dispatch: jsonDispatch } = useJSONContext();
  const { dispatch: modalDispatch } = useModalContext();
  const { state: editorState, dispatch: editorDispatch } = useEditorContext();

  const { formState, onInputChange, onSelectChange, onCheckboxChange } =
    useForm<FormDataTransformJsonPage>({
      initialValueForm: {
        idInputJson: "not_selected",
        idOutputJson: "not_selected",
        saveOutputJson: false,
        outputJsonNameToSave: "",
      },
    });

  const parsedText = safeJsonParse(editorState.text)
    ? safeJsonParse(editorState.text)
    : editorState.text;

  const handleGetJsons = async (): Promise<void> => {
    try {
      jsonDispatch({
        type: "LOADING",
        payload: { loading: true },
      });

      const [responseInputJsons, responseOutputJsons] = await Promise.all([
        getJsonInputs(),
        getJsonOutputs(),
      ]);

      const inputJsons = responseInputJsons.data;
      const outputJsons = responseOutputJsons.data;

      jsonDispatch({
        type: "LOADING",
        payload: { loading: false },
      });
      return jsonDispatch({
        type: "OUTPUT_AND_INPUT_JSONS",
        payload: { inputJsons: inputJsons, outputJsons: outputJsons },
      });
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

  const handleGetInputJson = async (idInputJson: string): Promise<void> => {
    try {
      jsonDispatch({
        type: "LOADING",
        payload: { loading: true },
      });
      const response = await getJsonInput(idInputJson);

      jsonDispatch({
        type: "LOADING",
        payload: { loading: false },
      });
      modalDispatch({
        type: "SET_MODAL",
        payload: {
          message:
            "Now you can use the key: input followed by a dot to get the keys from the json input and then transform them into values of those keys.",
          open: true,
        },
      });

      return jsonDispatch({
        type: "INPUT_JSON_UPDATE",
        payload: {
          id: response.data.inputJson.id,
          name: response.data.inputJson.name,
          content: response.data.inputJson.content,
          keys: response.data.inputJson.keys,
        },
      });
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

  const handleGetOutputJson = async (idOutputJson: string): Promise<void> => {
    try {
      jsonDispatch({
        type: "LOADING",
        payload: { loading: true },
      });
      const response = await getJsonOutput(idOutputJson);

      jsonDispatch({
        type: "LOADING",
        payload: { loading: false },
      });

      modalDispatch({
        type: "SET_MODAL",
        payload: {
          message: "Successfully loaded the output json!",
          open: true,
        },
      });

      editorDispatch({
        type: "SET_TEXT",
        payload: {
          text: JSON.stringify(
            response.data.outputJson.transformationModel,
            null,
            2
          ),
        },
      });

      return jsonDispatch({
        type: "OUTPUT_JSON_UPDATE",
        payload: {
          id: response.data.outputJson.id,
          name: response.data.outputJson.name,
          transformationModel: response.data.outputJson.transformationModel,
        },
      });
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

  const handleSubmitForm: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      jsonDispatch({
        type: "LOADING",
        payload: { loading: true },
      });

      const idInputJson = formState.idInputJson;
      const saveOutputJson = formState.saveOutputJson;
      const outputJsonNameToSave = formState.outputJsonNameToSave.trim();
      const contentJsonToTransform = jsonState.outputJson.transformationModel;

      const body = {
        idInputJson: idInputJson === "not_selected" ? "" : idInputJson,
        saveOutputJson: saveOutputJson,
        outputJsonNameToSave: outputJsonNameToSave,
        contentJsonToTransform: JSON.stringify(contentJsonToTransform),
      };

      const response = await postTransformJson(body);

      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a") as HTMLAnchorElement;

      a.style.display = "none";
      a.href = url;
      a.download = `${jsonState.inputJson.name}_transformed.json`;

      document.body.append(a);

      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      jsonDispatch({
        type: "LOADING",
        payload: { loading: false },
      });

      modalDispatch({
        type: "SET_MODAL",
        payload: {
          message: !saveOutputJson
            ? "The json was successfully transformed!"
            : "The json was successfully transformed and the output model was successfully saved!",
          open: true,
        },
      });
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e) && e.response) {
        const response = JSON.parse(
          await getContentFromBlob(e.response.data as Blob)
        );

        modalDispatch({
          type: "SET_MODAL",
          payload: { message: response.message, open: true },
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
    handleGetJsons();

    return () => {
      jsonDispatch({
        type: "CONTEXT_CLEAR",
        payload: null,
      });
    };
  }, []);

  useEffect(() => {
    if (
      formState.idInputJson === "not_selected" &&
      formState.idOutputJson === "not_selected"
    )
      return;

    if (
      String(jsonState.inputJson.id) !== formState.idInputJson &&
      formState.idInputJson !== "not_selected"
    ) {
      handleGetInputJson(formState.idInputJson);
      return;
    }

    if (
      String(jsonState.outputJson.id) !== formState.idOutputJson &&
      formState.idOutputJson !== "not_selected"
    ) {
      handleGetOutputJson(formState.idOutputJson);
      return;
    }
  }, [formState.idInputJson, formState.idOutputJson]);

  return (
    <FormEditorLayout
      onSubmit={handleSubmitForm}
      loading={jsonState.loading}
      LoadingComponent={() => <LoaderSpinner></LoaderSpinner>}
      jsonTypeToEdit="outputWithInput"
    >
      <SelectNormal
        id="json_input_select"
        label="Select an Input JSON"
        name="idInputJson"
        value={formState.idInputJson}
        className="lg:bg-primary"
        onChange={onSelectChange}
      >
        <SelectOption value="not_selected">Select an Input Json</SelectOption>
        {jsonState.jsons.inputJsons.map((inputJson) => {
          return (
            <SelectOption key={inputJson.id} value={String(inputJson.id)}>
              {inputJson.name}
            </SelectOption>
          );
        })}
      </SelectNormal>

      {jsonState.jsons.outputJsons.length > 0 && (
        <SelectNormal
          id="json_output_select"
          label="Select an Output JSON"
          name="idOutputJson"
          className="lg:bg-primary"
          value={formState.idOutputJson}
          onChange={onSelectChange}
        >
          <SelectOption value="not_selected">
            Select an Output Json
          </SelectOption>
          {jsonState.jsons.outputJsons.map((outputJson) => {
            return (
              <SelectOption key={outputJson.id} value={String(outputJson.id)}>
                {outputJson.name}
              </SelectOption>
            );
          })}
        </SelectNormal>
      )}

      <InputCheck
        id="json_save_output"
        label="Do you want to save the json output for future transformations?"
        name="saveOutputJson"
        value="saveOutputJson"
        onChange={onCheckboxChange}
      ></InputCheck>

      {formState.saveOutputJson && (
        <InputField
          id="json_save_output_name"
          name="outputJsonNameToSave"
          label="Output Json Name"
          value={formState.outputJsonNameToSave}
          placeholder="My personal Output Json"
          className="lg:bg-primary"
          onChange={onInputChange}
        ></InputField>
      )}

      <ButtonSubmit
        ariaLabel="Submit Form Transform Json"
        disabled={
          (formState.idInputJson === "not_selected" &&
            !jsonState.outputJson.transformationModel) ||
          (formState.saveOutputJson &&
            (!formState.outputJsonNameToSave ||
              !jsonState.outputJson.transformationModel)) ||
          JSON.stringify(parsedText) !==
            JSON.stringify(jsonState.outputJson.transformationModel)
        }
        className="lg:bg-primary"
      >
        Transform JSON
      </ButtonSubmit>
    </FormEditorLayout>
  );
};
