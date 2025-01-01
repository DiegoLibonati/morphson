import app from "@/src/app";

import { API_CONFIG } from "@/src/config";

const onInit = () => {
  console.log(`Server running on ${API_CONFIG.PORT}.`);
};

app.listen(API_CONFIG.PORT, onInit);
