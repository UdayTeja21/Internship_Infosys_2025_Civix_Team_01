
// // import axios from "axios";

// // class ApiClient {
// //   constructor() {
// //     this.client = axios.create({
// //       baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
// //       timeout: 10000,
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //     });

// //     this.initializeInterceptors();
// //   }

// //   initializeInterceptors() {
// //     this.client.interceptors.request.use(
// //       (config) => {
// //         const token = localStorage.getItem("token");
// //         if (token) {
// //           config.headers.Authorization = `Bearer ${token}`;
// //         }
// //         return config;
// //       },
// //       (error) => Promise.reject(error)
// //     );

// //     this.client.interceptors.response.use(
// //       (response) => response,
// //       (error) => {
// //         if (error.response?.status === 401) {
// //           this.clearAuth();
// //           if (window.location.pathname !== "/login") {
// //             window.location.href = "/login";
// //           }
// //         }
// //         return Promise.reject(error);
// //       }
// //     );
// //   }

// //   clearAuth() {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("userId");
// //     delete this.client.defaults.headers.common["Authorization"];
// //   }

// //   // ================= Auth methods =================
// //   async login(credentials) {
// //     const response = await this.client.post("/auth/login", credentials);
// //     if (response.data?.token) {
// //       localStorage.setItem("token", response.data.token);
// //       localStorage.setItem("user", JSON.stringify(response.data.user));
// //       localStorage.setItem("userId", response.data.user.id);
// //     }
// //     return response;
// //   }
// //   async register(userData) {
// //     const response = await this.client.post("/auth/signup", userData);
// //     if (response.data?.token) {
// //       this.setAuthToken(response.data.token);
// //       localStorage.setItem("user", JSON.stringify(response.data.user));
// //       localStorage.setItem("userId", response.data.user.id);
// //     }
// //     return response;
// //   }

// //   async getCurrentUser() {
// //     return this.client.get("/auth/me");
// //   }

// //   // ================= Petition methods =================
// //   async getPetitions(params = {}) {
// //     return this.client.get("/petitions", { params });
// //   }

// //   async getPetition(id) {
// //     return this.client.get(`/petitions/${id}`);
// //   }

// //   async createPetition(petitionData) {
// //     const res = await this.client.post("/petitions", petitionData);
// //     return {
// //       success: true,
// //       message: res.data.message || "Petition created successfully",
// //       data: res.data,
// //     };
// //   }

// //   async updatePetition(id, updates) {
// //     return this.client.patch(`/petitions/${id}`, updates);
// //   }

// //   async signPetition(id) {
// //      return this.client.post(`/petitions/${id}/sign`);
// //   }

// //   async deletePetition(id) {
// //     return this.client.delete(`/petitions/${id}`);
// //   }
  
// //   async respondToPetition(id, responseData) {
// //     return this.client.post(`/petitions/${id}/respond`, responseData);
// //   }

// //   // ================= Poll methods =================
// //   async getOfficialPolls() {
// //     return this.client.get('/polls/my-polls');
// //   }

// //   // ================= Dashboard methods =================
// //   async getDashboardSummary() {
// //     return this.client.get("/dashboard/summary");
// //   }

// //   async getDashboardEngagement() {
// //     return this.client.get("/dashboard/engagement");
// //   }
  
// //   async getMyPetitions() {
// //     return this.client.get("/user/my-petitions");
// //   }

// //   async getSignedPetitions() {
// //     return this.client.get("/user/signed-petitions");
// //   }

// //   async getReportsData() {
// //     return this.client.get("/dashboard/reports");
// //   }

// //   // ================= Auth Helpers =================
// //   setAuthToken(token) {
// //     localStorage.setItem("token", token);
// //     this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //   }

// //   removeAuthToken() {
// //     this.clearAuth();
// //   }

// //   isAuthenticated() {
// //     return !!localStorage.getItem("token");
// //   }

// //   getStoredUser() {
// //     const userData = localStorage.getItem("user");
// //     try {
// //       return userData ? JSON.parse(userData) : null;
// //     } catch (error) {
// //       console.error("Could not parse user data from localStorage", error);
// //       return null;
// //     }
// //   }
// // }

// // export const API = new ApiClient();
// // export default API;



// // //28/9/25
// // import axios from "axios";

// // class ApiClient {
// //   constructor() {
// //     this.client = axios.create({
// //       baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
// //       timeout: 10000,
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //     });

// //     this.initializeInterceptors();
// //   }

// //   initializeInterceptors() {
// //     this.client.interceptors.request.use(
// //       (config) => {
// //         const token = localStorage.getItem("token");
// //         if (token) {
// //           config.headers.Authorization = `Bearer ${token}`;
// //         }
// //         return config;
// //       },
// //       (error) => Promise.reject(error)
// //     );

// //     this.client.interceptors.response.use(
// //       (response) => response,
// //       (error) => {
// //         if (error.response?.status === 401) {
// //           this.clearAuth();
// //           if (window.location.pathname !== "/login") {
// //             window.location.href = "/login";
// //           }
// //         }
// //         return Promise.reject(error);
// //       }
// //     );
// //   }

// //   clearAuth() {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("userId");
// //     localStorage.removeItem("userRole");
// //     delete this.client.defaults.headers.common["Authorization"];
// //   }

// //   // ================= Auth methods =================
// //   async login(credentials) {
// //     return this.client.post("/auth/login", credentials);
// //   }

// //   async register(userData) {
// //     return this.client.post("/auth/signup", userData);
// //   }
  
// //   // ================= Petition methods =================
// //   async getPetitions(params = {}) {
// //     return this.client.get("/petitions", { params });
// //   }

// //   async createPetition(petitionData) {
// //     return this.client.post("/petitions", petitionData);
// //   }

// //   async updatePetition(id, updates) {
// //     return this.client.patch(`/petitions/${id}`, updates);
// //   }

// //   async deletePetition(id) {
// //     return this.client.delete(`/petitions/${id}`);
// //   }
  
// //   async signPetition(id) {
// //     return this.client.post(`/petitions/${id}/sign`);
// //   }

// //   async respondToPetition(id, responseData) {
// //     return this.client.post(`/petitions/${id}/respond`, responseData);
// //   }

// //   // ================= Poll methods =================
// //   async getPolls() {
// //     return this.client.get("/polls");
// //   }

// //   async createPoll(pollData) {
// //     return this.client.post("/polls", pollData);
// //   }

// //   async voteOnPoll(id, voteData) {
// //     return this.client.post(`/polls/${id}/vote`, voteData);
// //   }

// //   async updatePoll(id, updates) {
// //     return this.client.put(`/polls/${id}`, updates);
// //   }

// //   async deletePoll(id) {
// //     return this.client.delete(`/polls/${id}`);
// //   }

// //   // ================= Helper methods =================
  
// //   // ✅ ADD THIS FUNCTION BACK
// //   getStoredUser() {
// //     const userData = localStorage.getItem("user");
// //     return userData ? JSON.parse(userData) : null;
// //   }
// // }

// // export const API = new ApiClient();
// // export default API;


// import axios from "axios";

// class ApiClient {
//   constructor() {
//     this.client = axios.create({
//       baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
//       timeout: 10000,
//       headers: { "Content-Type": "application/json" },
//     });
//     this.initializeInterceptors();
//   }

//   initializeInterceptors() {
//     this.client.interceptors.request.use((config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     }, (error) => Promise.reject(error));

//     this.client.interceptors.response.use((response) => response, (error) => {
//       if (error.response?.status === 401) {
//         this.clearAuth();
//         if (window.location.pathname !== "/login") {
//           window.location.href = "/login";
//         }
//       }
//       return Promise.reject(error);
//     });
//   }

//   clearAuth() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userRole");
//   }

//   // Auth methods
//   async login(credentials) { return this.client.post("/auth/login", credentials); }
//   async register(userData) { return this.client.post("/auth/signup", userData); }
  
//   // Petition methods
//   async getPetitions(params = {}) { return this.client.get("/petitions", { params }); }
//   async createPetition(petitionData) { return this.client.post("/petitions", petitionData); }
//   async updatePetition(id, updates) { return this.client.patch(`/petitions/${id}`, updates); }
//   async deletePetition(id) { return this.client.delete(`/petitions/${id}`); }
//   async signPetition(id) { return this.client.post(`/petitions/${id}/sign`); }
//   async respondToPetition(id, responseData) { return this.client.post(`/petitions/${id}/respond`, responseData); }

//   // Poll methods
//   async getPolls() { return this.client.get("/polls"); }
//   async createPoll(pollData) { return this.client.post("/polls", pollData); }
//   async voteOnPoll(id, voteData) { return this.client.post(`/polls/${id}/vote`, voteData); }
//   async updatePoll(id, updates) { return this.client.put(`/polls/${id}`, updates); }
//   async deletePoll(id) { return this.client.delete(`/polls/${id}`); }
  
//   // ✅ ADDED METHODS FOR OFFICIAL DASHBOARD
//   async getOfficialPolls() { return this.client.get("/polls/my-polls"); }
//   async getDashboardSummary() { return this.client.get("/dashboard/summary"); }
//   async getDashboardEngagement() { return this.client.get("/dashboard/engagement"); }
//   async getReportsData() { return this.client.get("/dashboard/reports"); }

//   // ================= Officials methods =================
// async getOfficialStats() {
//   return this.client.get("/officials/stats");
// }

// async getOfficials() {
//   return this.client.get("/officials");
// }
//   // Helper methods
//   getStoredUser() {
//     const userData = localStorage.getItem("user");
//     return userData ? JSON.parse(userData) : null;
//   }
// }

// export const API = new ApiClient();
// export default API;






import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.initializeInterceptors();
  }

  initializeInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    delete this.client.defaults.headers.common["Authorization"];
  }

  // ================= Auth methods =================
  async login(credentials) {
    const response = await this.client.post("/auth/login", credentials);
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);
    }
    return response;
  }
  async register(userData) {
    const response = await this.client.post("/auth/signup", userData);
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);
    }
    return response;
  }

  async getCurrentUser() {
    return this.client.get("/auth/me");
  }

  // ================= Petition methods =================
  async getPetitions(params = {}) {
    return this.client.get("/petitions", { params });
  }

  async getPetition(id) {
    return this.client.get(`/petitions/${id}`);
  }

  async createPetition(petitionData) {
    const res = await this.client.post("/petitions", petitionData);
    return {
      success: true,
      message: res.data.message || "Petition created successfully",
      data: res.data,
    };
  }

  async updatePetition(id, updates) {
    return this.client.patch(`/petitions/${id}`, updates);
  }

  async signPetition(id) {
     return this.client.post(`/petitions/${id}/sign`);
  }

  async deletePetition(id) {
    return this.client.delete(`/petitions/${id}`);
  }
  
  async respondToPetition(id, responseData) {
    return this.client.post(`/petitions/${id}/respond`, responseData);
  }

  // ================= Poll methods =================
  async getOfficialPolls() {
    return this.client.get('/polls/my-polls');
  }
  

  /* new buddy 5 */

async getAllPolls() {
  return this.client.get('/polls');
}

  async createPoll(pollData) {
    return this.client.post('/polls', pollData);
}
 


async updatePoll(id, pollData) {
    return this.client.put(`/polls/${id}`, pollData);
}

async deletePoll(id) {
    return this.client.delete(`/polls/${id}`);
}

  /* new buddy 5 */

  // ================= Dashboard methods =================
  async getDashboardSummary() {
    return this.client.get("/dashboard/summary");
  }

  async getDashboardEngagement() {
    return this.client.get("/dashboard/engagement");
  }
  
  async getMyPetitions() {
    return this.client.get("/user/my-petitions");
  }

  async getSignedPetitions() {
    return this.client.get("/user/signed-petitions");
  }

  async getReportsData() {
    return this.client.get("/dashboard/reports");
  }

  // ================= Auth Helpers =================
  setAuthToken(token) {
    localStorage.setItem("token", token);
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  removeAuthToken() {
    this.clearAuth();
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  getStoredUser() {
    const userData = localStorage.getItem("user");
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Could not parse user data from localStorage", error);
      return null;
    }
  }
}

export const API = new ApiClient();
export default API;

