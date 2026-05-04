export interface FormDataLoadJsonPage {
  jsonName: string;
  jsonFile: File | null;
}

export interface FormDataTransformJsonPage {
  idInputJson: string;
  idOutputJson: string;
  saveOutputJson: boolean;
  outputJsonNameToSave: string;
}
