export const ensureDefined = <T>(
  value: T | undefined | null,
  message = "Value is not defined"
): T => {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
  return value;
};
