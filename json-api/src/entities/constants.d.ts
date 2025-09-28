export type MessagesSuccess = {
  getFileContent: string;
  inputJsonUploaded: string;
  getAllInputJsons: string;
  getInputJson: string;
  getAllOutputJsons: string;
  getOutputJson: string;
};

export type MessagesNot = {
  foundRoute: string;
  foundFile: string;
  foundInputJson: string;
  foundOutputJson: string;
  validName: string;
  validContent: string;
  validInputJsonId: string;
  validOutputJsonId: string;
};

export type MessagesError = {
  generic: string;
  jsonAlreadyExistsInDatabase: string;
};

export type CodesSuccess = {
  getFileContent: "SUCCESS_GET_FILE_CONTENT";
  inputJsonUploaded: "SUCCESS_INPUT_JSON_UPLOADED";
  getAllInputJsons: "SUCCESS_GET_ALL_INPUT_JSONS";
  getInputJson: "SUCCESS_GET_INPUT_JSON";
  getAllOutputJsons: "SUCCESS_GET_ALL_OUTPUT_JSONS";
  getOutputJson: "SUCCESS_GET_OUTPUT_JSON";
};

export type CodesNot = {
  foundRoute: "NOT_FOUND_ROUTE";
  foundFile: "NOT_FOUND_FILE";
  foundInputJson: "NOT_FOUND_INPUT_JSON";
  foundOutputJson: "NOT_FOUND_OUTPUT_JSON";
  validName: "NOT_VALID_NAME";
  validContent: "NOT_VALID_CONTENT";
  validInputJsonId: "NOT_VALID_INPUT_JSON_ID";
  validOutputJsonId: "NOT_VALID_OUTPUT_JSON_ID";
};

export type CodesError = {
  generic: "ERROR_GENERIC";
  jsonAlreadyExistsInDatabase: "ERROR_JSON_ALREADY_EXISTS_IN_DATABASE";
};
