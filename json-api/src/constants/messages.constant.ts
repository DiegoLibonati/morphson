import {
  MessagesSuccess,
  MessagesError,
  MessagesNot,
} from "@src/entities/constants";

export const MESSAGES_SUCCESS: MessagesSuccess = {
  getFileContent: "¡Successfully obtained the contents of the file!",
  inputJsonUploaded: "¡JSON Uploaded!",
  getAllInputJsons: "¡Input jsons successfully delivered!",
  getInputJson: "¡Input json successfully delivered!",
  getAllOutputJsons: "¡Output jsons successfully delivered!",
  getOutputJson: "¡Output json successfully delivered!",
};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "Route not found.",
  foundFile: "File not found.",
  foundInputJson: "Input json not found.",
  foundOutputJson: "Output json not found.",
  validName: "You must send a valid name!",
  validContent: "You must send a JSON with content to be able to transform!",
  validInputJsonId: "You must send a Valid Json Input ID!",
  validOutputJsonId: "You must send a Valid Json Output ID!",
};

export const MESSAGES_ERROR: MessagesError = {
  generic: "Something went wrong!",
  jsonAlreadyExistsInDatabase:
    "A JSON with the specified name already exists in the database!",
};
