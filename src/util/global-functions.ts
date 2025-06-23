export const getEmailPattern = () =>
  "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
export const getUUUIDPattern = () =>
  '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

export function filterMatchingProperties<T extends object>(
  target: T,
  source: Record<string, any>,
): T {
  const result: Partial<T> = {};
  const modelDefinition = (target as any).constructor.definition;
  if (modelDefinition && modelDefinition.properties) {
    const keys = Object.keys(modelDefinition.properties);
    keys.forEach(key => {
      if (source.hasOwnProperty(key)) {
        (result as any)[key] = source[key];
      } else {
        (result as any)[key] = (target as any)[key];
      }
    });
  }
  return result as T;
}
