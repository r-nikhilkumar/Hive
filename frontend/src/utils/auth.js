const getCookie = (name) => {
  const cookies = document.cookie;
  if (!cookies) {
    console.log("No cookies found");
    return null;
  }
  const cookieArr = cookies.split("; "); // Split cookies into key-value pairs
  for (const cookie of cookieArr) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value); // Decode the cookie value
    }
  }
  return null;
}

export const getUserIdFromCookies = () => {
  const name = "userId";
  const userId = getCookie(name);
  // console.log("User ID from cookies: ", decodeURIComponent(userId));
  if (userId) {
    const cleanedUserId = userId.replace(/^j:"|"$|"/g, ''); // Remove j:" prefix and " suffix
    // console.log("Cleaned user ID: ", cleanedUserId);
    return decodeURIComponent(cleanedUserId); // Decode the user ID
  }
  return null;
};

