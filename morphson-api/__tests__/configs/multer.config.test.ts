import { upload } from "@/configs/multer.config";

describe("multer.config", () => {
  it("should export a multer upload instance with single and array methods", () => {
    expect(upload).toBeDefined();
    expect(typeof upload.single).toBe("function");
    expect(typeof upload.array).toBe("function");
    expect(typeof upload.fields).toBe("function");
  });
});
