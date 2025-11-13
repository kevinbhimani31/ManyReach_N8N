export function ensureGuid(value: string | undefined) {
  if (!value) {
    throw new Error('ID must be provided');
  }
  // simple GUID check
  const guidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[1-5][0-9a-fA-F]{3}\b-[89abAB][0-9a-fA-F]{3}\b-[0-9a-fA-F]{12}$/;
  if (!guidRegex.test(value)) {
    throw new Error('ID must be a valid GUID');
  }
}

export function ensurePagination(page: number, limit: number) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error('Page must be an integer greater than or equal to 1');
  }
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('Limit must be an integer greater than 0');
  }
}

export function ensureId(id: number) {
  if (id === undefined || id === null || isNaN(id) || id <= 0) {
    throw new Error(`Invalid ID received: ${id}. Please provide a valid numeric ID.`);
  }
}