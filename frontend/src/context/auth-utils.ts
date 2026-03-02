export const tokenUtils = {
  setToken: (token: string) => {
    localStorage.setItem("authToken", token);
  },

  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  removeToken: () => {
    localStorage.removeItem("authToken");
  },
};
