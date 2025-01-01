export const getContentFromBlob = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = function (event) {
        const target = event.target as FileReader;
        const result = target.result as string;

        resolve(result);
      };

      reader.readAsText(blob);
    } catch (e) {
      reject(e);
    }
  });
};
