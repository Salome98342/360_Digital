export const getCookie = (name) => {
  if (!document.cookie) return null;
  const cookies = document.cookie.split(';');
  for (const cookieStr of cookies) {
    const cookie = cookieStr.trim();
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
};