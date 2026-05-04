import { getContentFromBlob } from "@/helpers/getContentFromBlob";

const makeBlobWithText = (text: string): Blob => {
  const blob = new Blob([text]);
  blob.text = jest.fn().mockResolvedValue(text);
  return blob;
};

describe("getContentFromBlob", () => {
  it("should return the text content of a blob", async () => {
    const blob = makeBlobWithText("hello world");
    const result = await getContentFromBlob(blob);
    expect(result).toBe("hello world");
  });

  it("should return empty string for an empty blob", async () => {
    const blob = makeBlobWithText("");
    const result = await getContentFromBlob(blob);
    expect(result).toBe("");
  });

  it("should return json string content", async () => {
    const jsonContent = JSON.stringify({ key: "value" });
    const blob = makeBlobWithText(jsonContent);
    const result = await getContentFromBlob(blob);
    expect(result).toBe(jsonContent);
  });
});
