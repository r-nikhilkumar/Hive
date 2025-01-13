const getCookie = (name) => {
  const cookies = document.cookie;
  if (!cookies) {
    console.log("No cookies found");
    return null;
  }
  console.log("All cookies: ", cookies); // Log all cookies
  const cookieArr = cookies.split("; "); // Split cookies into key-value pairs
  for (const cookie of cookieArr) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value); // Decode the cookie value
    }
  }
  return null;
}

export const getTokenFromCookies = () => {
  const name = "token";
  return getCookie(name)
};

// Get all cookies as a single string



// Usage
// const token = getCookie("token");
// console.log("Token from cookie:", token);
