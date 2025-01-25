const getCookie = (name:any) => {
  const cookies = document.cookie;
  if (!cookies) {
    console.log("No cookies found");
    return null;
  }
  console.log("Cookies: ", cookies);
  const cookieArr = cookies.split("; ");
  console.log("Cookies: ", cookieArr);
  for (const cookie of cookieArr) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value); // Decode the cookie value
    }
  }
  return null;
};

export const getUserIdFromCookies = () => {
  const name = "userId";
  const userId = getCookie(name);
  // console.log("User ID from cookies: ", decodeURIComponent(userId));
  if (userId) {
    const cleanedUserId = userId.replace(/^j:"|"$|"/g, ""); // Remove j:" prefix and " suffix
    // console.log("Cleaned user ID: ", cleanedUserId);
    return decodeURIComponent(cleanedUserId); // Decode the user ID
  }
  return null;
};

export const setUserIdToLocalStorage = (userId:any, expirationMinutes = 60) => {
  const expirationTime = new Date().getTime() + 72 * expirationMinutes * 60 * 1000;
  const userData = { userId, expirationTime };
  localStorage.setItem("userId", JSON.stringify(userData));
};

export const getUserIdFromLocalStorage = () => {
  const userIdString = localStorage.getItem("userId");
  const userData = userIdString ? JSON.parse(userIdString) : null;
  if (!userData) return null;

  const currentTime = new Date().getTime();
  if (currentTime > userData.expirationTime) {
    localStorage.removeItem("userId");
    return null;
  }

  return userData.userId;
};

export const setTokenToLocalStorage = (token:any, expirationMinutes = 60) => {
  const expirationTime = new Date().getTime() + 72 * expirationMinutes * 60 * 1000;
  const tokenData = { token, expirationTime };
  localStorage.setItem("token", JSON.stringify(tokenData));
};

export const getTokenFromLocalStorage = () => {
  const tokenString = localStorage.getItem("token");
  const tokenData = tokenString ? JSON.parse(tokenString) : null;
  if (!tokenData) return null;

  const currentTime = new Date().getTime();
  if (currentTime > tokenData.expirationTime) {
    localStorage.removeItem("token");
    return null;
  }

  return tokenData.token;
};

export const setRefreshTokenToLocalStorage = (refreshToken:any, expirationMinutes = 60) => {
  const expirationTime = new Date().getTime() + 7 * 24 * expirationMinutes * 60 * 1000;
  const refreshTokenData = { refreshToken, expirationTime };
  localStorage.setItem("refreshToken", JSON.stringify(refreshTokenData));
};

export const getRefreshTokenFromLocalStorage = () => {
  const refreshTokenString = localStorage.getItem("refreshToken");
  const refreshTokenData = refreshTokenString ? JSON.parse(refreshTokenString) : null;
  if (!refreshTokenData) return null;

  const currentTime = new Date().getTime();
  if (currentTime > refreshTokenData.expirationTime) {
    localStorage.removeItem("refreshToken");
    return null;
  }

  return refreshTokenData.refreshToken;
};
