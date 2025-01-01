import React, { useEffect } from "react";
import axios from "axios";

import { LoaderSpinner } from "@/src/components/Loaders/export";
import { SelectNormal, SelectOption } from "@/src/components/Selects/export";
import { InputCheck, InputField } from "@/src/components/Inputs/export";
import { ButtonSubmit } from "@/src/components/Buttons/export";

import { useJSONContext, useModalContext } from "@/src/contexts/export";
import {
  getJsonInput,
  getJsonInputs,
  getJsonOutput,
  getJsonOutputs,
  postTransformJson,
} from "@/src/services/export";
import { FormEditorLayout } from "@/src/layouts/export";
import { useForm } from "@/src/hooks/export";
import { getContentFromBlob } from "@/src/helpers/export";

type FormData = {
  idInputJson: string | "not_selected";
  idOutputJson: string | "not_selected";
  saveOutputJson: boolean;
  outputJsonNameToSave: string;
};

export const TransformJsonPage = (): JSX.Element => {
  const {
    loading,
    inputJson,
    outputJson,
    jsons,
    handleLoading,
    handleFillJsons,
    handleClearJson,
    handleUpdateInputJson,
    handleUpdateOutputJson,
  } = useJSONContext();
  const { handleSetModal } = useModalContext();

  const { formState, onInputChange, onSelectChange, onCheckboxChange } =
    useForm<FormData>({
      initialValueForm: {
        idInputJson: "not_selected",
        idOutputJson: "not_selected",
        saveOutputJson: false,
        outputJsonNameToSave: "",
      },
    });

  const handleGetJsons = async (): Promise<void> => {
    try {
      handleLoading(true);

      const [responseInputJsons, responseOutputJsons] = await Promise.all([
        getJsonInputs(),
        getJsonOutputs(),
      ]);

      const inputJsons = responseInputJsons.data.data;
      const outputJsons = responseOutputJsons.data.data;

      handleLoading(false);
      return handleFillJsons(inputJsons, outputJsons);
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

  const handleGetInputJson = async (idInputJson: string): Promise<void> => {
    try {
      handleLoading(true);
      const response = await getJsonInput(idInputJson);
      const data = response.data.data;

      handleLoading(false);
      handleSetModal({
        open: true,
        message:
          "Now you can use the key: input followed by a dot to get the keys from the json input and then transform them into values of those keys.",
      });

      return handleUpdateInputJson({
        id: data.inputJson.id,
        name: data.inputJson.name,
        content: data.inputJson.content,
        keys: data.inputJson.keys,
        file: null,
      });
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

  const handleGetOutputJson = async (idOutputJson: string): Promise<void> => {
    try {
      handleLoading(true);
      const response = await getJsonOutput(idOutputJson);
      const data = response.data.data;

      handleLoading(false);
      handleSetModal({
        open: true,
        message: "Successfully loaded the output json!",
      });

      return handleUpdateOutputJson({
        id: data.outputJson.id,
        name: data.outputJson.name,
        model: data.outputJson.model,
      });
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

  const handleSubmitForm: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      handleLoading(true);

      const idInputJson = formState.idInputJson;
      const saveOutputJson = formState.saveOutputJson;
      const outputJsonNameToSave = formState.outputJsonNameToSave.trim();
      const contentJsonToTransform = outputJson.model.trim();

      const body = {
        idInputJson: idInputJson === "not_selected" ? "" : idInputJson,
        saveOutputJson: saveOutputJson,
        outputJsonNameToSave: outputJsonNameToSave,
        contentJsonToTransform: contentJsonToTransform,
      };

      const response = await postTransformJson(body);

      const data = response.data;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a") as HTMLAnchorElement;

      a.style.display = "none";
      a.href = url;
      a.download = `${inputJson.name}_transformed.json`;

      document.body.append(a);

      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      handleLoading(false);
      handleSetModal({
        message: !saveOutputJson
          ? "The json was successfully transformed!"
          : "The json was successfully transformed and the output model was successfully saved!",
        open: true,
      });
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e) && e.response) {
        const response = JSON.parse(
          await getContentFromBlob(e.response.data as Blob)
        );

        handleSetModal({ message: response.message, open: true });
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
    handleGetJsons();

    return () => {
      handleClearJson();
    };
  }, []);

  useEffect(() => {
    if (
      formState.idInputJson === "not_selected" &&
      formState.idOutputJson === "not_selected"
    )
      return;

    if (
      inputJson.id != formState.idInputJson &&
      formState.idInputJson !== "not_selected"
    ) {
      handleGetInputJson(formState.idInputJson);
      return;
    }

    if (
      outputJson.id != formState.idOutputJson &&
      formState.idOutputJson !== "not_selected"
    ) {
      handleGetOutputJson(formState.idOutputJson);
      return;
    }
  }, [formState.idInputJson, formState.idOutputJson]);

  return (
    <FormEditorLayout
      onSubmit={handleSubmitForm}
      loading={loading}
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
        {jsons.inputJsons.map((inputJson) => {
          return (
            <SelectOption key={inputJson.id} value={inputJson.id}>
              {inputJson.name}
            </SelectOption>
          );
        })}
      </SelectNormal>

      {jsons.outputJsons.length > 0 && (
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
          {jsons.outputJsons.map((outputJson) => {
            return (
              <SelectOption key={outputJson.id} value={outputJson.id}>
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
          (formState.idInputJson === "not_selected" && !outputJson.model) ||
          (formState.saveOutputJson &&
            (!formState.outputJsonNameToSave || !outputJson.model))
        }
        className="lg:bg-primary"
      >
        Transform JSON
      </ButtonSubmit>
    </FormEditorLayout>
  );
};
