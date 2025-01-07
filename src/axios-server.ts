import axios from "axios";

const serverAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_WEB_APP}/api`,
});

// Function to sanitize sensitive data
function sanitizeData(data: { password: string }) {
  if (typeof data === "object" && data !== null) {
    const sanitizedData = { ...data };
    if (sanitizedData.password) {
      sanitizedData.password = "***PASSWORD***";
    }
    return sanitizedData;
  }
  return data;
}

// Log outgoing requests
serverAxios.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    const sanitizedData = sanitizeData(config.data);
    console.info(
      `axios_server_request_${new Date().toISOString()}: ${config.method?.toUpperCase()} - ${
        config.url
      }, body: ${JSON.stringify(sanitizedData)}`
    );
  }
  return config;
});

// Log incoming responses
serverAxios.interceptors.response.use(
  (response) => {
    if (typeof window === "undefined") {
      const sanitizedData = sanitizeData(response.data);

      console.info(
        `axios_server_response_${new Date().toISOString()}: ${
          response.status
        } - ${response.config.url}, body: ${JSON.stringify(sanitizedData)}`
      );
    }
    return response;
  },
  (error) => {
    if (typeof window === "undefined") {
      console.error(`axios_server_${new Date().toISOString()}:`, error.message);
      if (error.response) {
        console.error(
          `axios_server_reponse_error_${new Date().toISOString()}:`,
          error.response.status
        );
        // console.error(
        //   `axios_server_reponse_data_${new Date().toISOString()}:`,
        //   error.response.data
        // );
      }
    }
    return Promise.reject(error);
  }
);

export default serverAxios;
