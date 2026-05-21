export interface MessagesSuccess {
  getFileContent: string;
  inputJsonUploaded: string;
  getAllInputJsons: string;
  getInputJson: string;
  getAllOutputJsons: string;
  getOutputJson: string;
  healthLive: string;
  healthReady: string;
}

export interface MessagesNot {
  foundRoute: string;
  foundFile: string;
  foundInputJson: string;
  foundOutputJson: string;
  validName: string;
  validContent: string;
  validInputJsonId: string;
  validOutputJsonId: string;
}

export interface MessagesError {
  generic: string;
  jsonAlreadyExistsInDatabase: string;
  validation: string;
}

export interface CodesSuccess {
  getFileContent: "SUCCESS_GET_FILE_CONTENT";
  inputJsonUploaded: "SUCCESS_INPUT_JSON_UPLOADED";
  getAllInputJsons: "SUCCESS_GET_ALL_INPUT_JSONS";
  getInputJson: "SUCCESS_GET_INPUT_JSON";
  getAllOutputJsons: "SUCCESS_GET_ALL_OUTPUT_JSONS";
  getOutputJson: "SUCCESS_GET_OUTPUT_JSON";
  healthLive: "SUCCESS_HEALTH_LIVE";
  healthReady: "SUCCESS_HEALTH_READY";
}

export interface CodesNot {
  foundRoute: "NOT_FOUND_ROUTE";
  foundFile: "NOT_FOUND_FILE";
  foundInputJson: "NOT_FOUND_INPUT_JSON";
  foundOutputJson: "NOT_FOUND_OUTPUT_JSON";
  validName: "NOT_VALID_NAME";
  validContent: "NOT_VALID_CONTENT";
  validInputJsonId: "NOT_VALID_INPUT_JSON_ID";
  validOutputJsonId: "NOT_VALID_OUTPUT_JSON_ID";
}

export interface CodesError {
  generic: "ERROR_GENERIC";
  jsonAlreadyExistsInDatabase: "ERROR_JSON_ALREADY_EXISTS_IN_DATABASE";
  validation: "ERROR_VALIDATION";
}
