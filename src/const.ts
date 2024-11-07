export const ERROR_MESSAGE = {
  invalidDto: (keys: string[]) =>
    `Either the required keys (${keys.join(
      ', ',
    )}) are missing or Values format is invalid`,
  invalidUuid: 'Invalid UUID format',
  notFound: (resource: string, id: string) =>
    `${resource} with id ${id} is not found`,
  permissionDenied: 'You do not have permission to perform this request',
};
