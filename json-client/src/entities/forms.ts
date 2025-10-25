export type FormDataLoadJsonPage = {
  jsonName: string;
  jsonFile: File | null;
};

export type FormDataTransformJsonPage = {
  idInputJson: string | "not_selected";
  idOutputJson: string | "not_selected";
  saveOutputJson: boolean;
  outputJsonNameToSave: string;
};
