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

  // ================= OTP & Password Reset Methods =================
  async verifyOtp(otpData) {
    const response = await this.client.post("/auth/verify-otp", otpData);
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);
    }
    return response;
  }

  async forgotPassword(email) {
    return this.client.post("/auth/forgot-password", { email });
  }

  async resetPassword(resetData) {
    return this.client.post("/auth/reset-password", resetData);
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

  // ================= Officials methods =================
  async getOfficials() {
    return this.client.get("/officials");
  }

  async getOfficialStats() {
    return this.client.get("/officials/stats");
  }

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