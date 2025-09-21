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
          // Redirect to login page if unauthorized
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
    const res = await this.client.patch(`/petitions/${id}`, updates);
    return {
      success: true,
      message: res.data.message || "Petition updated successfully",
      data: res.data,
    };
  }

  async signPetition(id) {
    const res = await this.client.post(`/petitions/${id}/sign`);
    return {
      success: true,
      message: res.data.message || "Petition signed successfully",
      data: res.data,
    };
  }

  async deletePetition(id) {
    const res = await this.client.delete(`/petitions/${id}`);
    return {
      success: true,
      message: res.data.message || "Petition deleted successfully",
      data: res.data,
    };
  }

  // ================= Dashboard methods =================
  async getDashboardStats() {
    return this.client.get("/dashboard/stats");
  }

  async getRecentPetitions() {
    return this.client.get("/dashboard/recent");
  }

  async getMyPetitions() {
    return this.client.get("/user/my-petitions");
  }

  async getSignedPetitions() {
    return this.client.get("/user/signed-petitions");
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
    return userData ? JSON.parse(userData) : null;
  }
}

export const API = new ApiClient();
export default API;

