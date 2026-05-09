import React, { useEffect } from "react";
import axios from "axios";

import type { JSX } from "react";
import type { FormDataTransformJsonPage } from "@/types/forms";

import LoaderSpinner from "@/components/Loaders/LoaderSpinner/LoaderSpinner";
import SelectNormal from "@/components/Selects/SelectNormal/SelectNormal";
import SelectOption from "@/components/Selects/SelectOption/SelectOption";
import InputCheck from "@/components/Inputs/InputCheck/InputCheck";
import InputField from "@/components/Inputs/InputField/InputField";
import ButtonSubmit from "@/components/Buttons/ButtonSubmit/ButtonSubmit";

import FormEditorLayout from "@/layouts/FormEditorLayout/FormEditorLayout";

import { useForm } from "@/hooks/useForm";
import { useEditorContext } from "@/hooks/useEditorContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useJSONContext } from "@/hooks/useJSONContext";

import { safeJsonParse } from "@/helpers/safeJsonParse";
import { getContentFromBlob } from "@/helpers/getContentFromBlob";

import inputService from "@/services/inputService";
import outputService from "@/services/outputService";
import transformService from "@/services/transformService";

const TransformJsonPage = (): JSX.Element => {
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
        inputService.getAll(),
        outputService.getAll(),
      ]);

      const inputJsons = responseInputJsons.data;
      const outputJsons = responseOutputJsons.data;

      jsonDispatch({
        type: "LOADING",
        payload: { loading: false },
      });
      jsonDispatch({
        type: "OUTPUT_AND_INPUT_JSONS",
        payload: { inputJsons: inputJsons, outputJsons: outputJsons },
      });
      return;
    } catch (e) {
      // console.log(e);
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

  const handleGetInputJson = async (idInputJson: string): Promise<void> => {
    try {
      jsonDispatch({
        type: "LOADING",
        payload: { loading: true },
      });
      const response = await inputService.getById(idInputJson);

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

      jsonDispatch({
        type: "INPUT_JSON_UPDATE",
        payload: {
          id: response.data.inputJson.id,
          name: response.data.inputJson.name,
          content: response.data.inputJson.content,
          keys: response.data.inputJson.keys,
        },
      });
      return;
    } catch (e) {
      // console.log(e);
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

  const handleGetOutputJson = async (idOutputJson: string): Promise<void> => {
    try {
      jsonDispatch({
        type: "LOADING",
        payload: { loading: true },
      });
      const response = await outputService.getById(idOutputJson);

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
          text: JSON.stringify(response.data.outputJson.transformationModel, null, 2),
        },
      });

      jsonDispatch({
        type: "OUTPUT_JSON_UPDATE",
        payload: {
          id: response.data.outputJson.id,
          name: response.data.outputJson.name,
          transformationModel: response.data.outputJson.transformationModel,
        },
      });
      return;
    } catch (e) {
      // console.log(e);
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

  const handleSubmitForm = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
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

      const response = await transformService.transform(body);

      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a");

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
      // console.log(e);
      if (axios.isAxiosError(e) && e.response) {
        const blob = e.response.data as Blob;
        const parsed = JSON.parse(await getContentFromBlob(blob)) as { message: string };

        modalDispatch({
          type: "SET_MODAL",
          payload: { message: parsed.message, open: true },
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
    void handleGetJsons();

    return (): void => {
      jsonDispatch({
        type: "CONTEXT_CLEAR",
        payload: null,
      });
    };
  }, []);

  useEffect(() => {
    if (formState.idInputJson === "not_selected" && formState.idOutputJson === "not_selected")
      return;

    if (
      String(jsonState.inputJson.id) !== formState.idInputJson &&
      formState.idInputJson !== "not_selected"
    ) {
      void handleGetInputJson(formState.idInputJson);
      return;
    }

    if (
      String(jsonState.outputJson.id) !== formState.idOutputJson &&
      formState.idOutputJson !== "not_selected"
    ) {
      void handleGetOutputJson(formState.idOutputJson);
      return;
    }
  }, [formState.idInputJson, formState.idOutputJson]);

  return (
    <FormEditorLayout
      onSubmit={(e) => {
        void handleSubmitForm(e);
      }}
      loading={jsonState.loading}
      LoadingComponent={(): JSX.Element => <LoaderSpinner></LoaderSpinner>}
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
          <SelectOption value="not_selected">Select an Output Json</SelectOption>
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
          (formState.idInputJson === "not_selected" && !jsonState.outputJson.transformationModel) ||
          (formState.saveOutputJson &&
            (!formState.outputJsonNameToSave || !jsonState.outputJson.transformationModel)) ||
          JSON.stringify(parsedText) !== JSON.stringify(jsonState.outputJson.transformationModel)
        }
        className="lg:bg-primary"
      >
        Transform JSON
      </ButtonSubmit>
    </FormEditorLayout>
  );
};

export default TransformJsonPage;
