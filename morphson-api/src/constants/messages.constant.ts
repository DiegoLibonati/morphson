import type { MessagesSuccess, MessagesError, MessagesNot } from "@/types/constants";

export const MESSAGES_SUCCESS: MessagesSuccess = {
  getFileContent: "File content retrieved successfully.",
  inputJsonUploaded: "Input JSON uploaded successfully.",
  getAllInputJsons: "Input JSONs retrieved successfully.",
  getInputJson: "Input JSON retrieved successfully.",
  getAllOutputJsons: "Output JSONs retrieved successfully.",
  getOutputJson: "Output JSON retrieved successfully.",
  healthLive: "Service is alive.",
  healthReady: "Service is ready.",
};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "Route not found.",
  foundFile: "File not found.",
  foundInputJson: "Input JSON not found.",
  foundOutputJson: "Output JSON not found.",
  validName: "A valid name is required.",
  validContent: "A JSON with content is required to perform the transformation.",
  validInputJsonId: "A valid input JSON ID is required.",
  validOutputJsonId: "A valid output JSON ID is required.",
};

export const MESSAGES_ERROR: MessagesError = {
  generic: "Something went wrong.",
  jsonAlreadyExistsInDatabase: "A JSON with this name already exists.",
  validation: "Validation failed.",
};
