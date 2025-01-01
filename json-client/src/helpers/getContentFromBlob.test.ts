import { getContentFromBlob } from "./getContentFromBlob";

test("it should resolve with the content of the blob as a string", async () => {
  const content = "Hello, world!";
  const blob = new Blob([content], { type: "text/plain" });

  const result = await getContentFromBlob(blob);
  expect(result).toBe(content);
});
