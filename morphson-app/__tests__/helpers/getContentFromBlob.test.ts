import { getContentFromBlob } from "@/helpers/getContentFromBlob";

describe("getContentFromBlob", () => {
  it("should return the text content of a blob", async () => {
    const blob = new Blob(["hello world"]);

    const result = await getContentFromBlob(blob);

    expect(result).toBe("hello world");
  });

  it("should return an empty string for an empty blob", async () => {
    const blob = new Blob([""]);

    const result = await getContentFromBlob(blob);

    expect(result).toBe("");
  });

  it("should return the json string content of a blob", async () => {
    const jsonContent = JSON.stringify({ key: "value" });
    const blob = new Blob([jsonContent]);

    const result = await getContentFromBlob(blob);

    expect(result).toBe(jsonContent);
  });

  it("should concatenate multiple parts of a blob", async () => {
    const blob = new Blob(["part1-", "part2"]);

    const result = await getContentFromBlob(blob);

    expect(result).toBe("part1-part2");
  });
});
