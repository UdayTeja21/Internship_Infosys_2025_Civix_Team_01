// export const debugAPI = {
//   logRequest: (config) => {
//     console.log("📤 API Request:", {
//       url: config.url,
//       method: config.method,
//       data: config.data,
//       baseURL: config.baseURL,
//       headers: config.headers
//     });
//     return config;
//   },

//   logResponse: (response) => {
//     console.log("✅ API Response:", {
//       status: response.status,
//       data: response.data,
//       url: response.config.url
//     });
//     return response;
//   },

//   logError: (error) => {
//     console.error("❌ API Error:", {
//       message: error.message,
//       response: error.response ? {
//         status: error.response.status,
//         data: error.response.data,
//         headers: error.response.headers
//       } : 'No response',
//       request: error.request ? 'Request made but no response' : 'No request made'
//     });
//     return Promise.reject(error);
//   }
// };