export const fetchFileFromURL = async (url) => {
  const normalizedUrl = url.replace(/([^:]\/)\/+/g, "$1");
  const response = await fetch(normalizedUrl);
  const blob = await response.blob();
  const fileName = normalizedUrl.split("/").pop();
  return new File([blob], fileName, { type: blob.type });
};
