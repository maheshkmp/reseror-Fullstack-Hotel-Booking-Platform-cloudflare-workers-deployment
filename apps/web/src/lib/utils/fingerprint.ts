export const getBrowserFingerprint = () => {
  if (typeof window === "undefined") return "server-side";

  const data = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width,
    screen.height,
    screen.colorDepth,
  ].join("||");

  const hash = Array.from(data).reduce(
    (acc, char) => (acc << 5) - acc + char.charCodeAt(0),
    0
  );

  return Math.abs(hash).toString(36);
};
