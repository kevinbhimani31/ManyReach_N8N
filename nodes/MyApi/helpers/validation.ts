/**
 * Helper function to extract resource ID from resource locator
 */
export function extractResourceId(resourceLocator: any): string | number {
  if (typeof resourceLocator === 'string' || typeof resourceLocator === 'number') {
    return resourceLocator;
  }

  if (resourceLocator && typeof resourceLocator === 'object') {
    return resourceLocator.value || resourceLocator.id;
  }

  throw new Error('Invalid resource locator format');
}

/**
 * Extract numeric ID from resource locator
 */
export function extractNumericId(resourceLocator: any): number {
  const id = extractResourceId(resourceLocator);
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  if (isNaN(numericId)) {
    throw new Error(`Invalid numeric ID: ${id}`);
  }

  return numericId;
}

/**
 * Ensure ID is valid
 */
export function ensureId(id: any): void {
  if (!id || (typeof id === 'string' && id.trim() === '')) {
    throw new Error('ID is required');
  }
}

/**
 * Validate pagination parameters
 */
export function ensurePagination(page: number, limit: number): void {
  if (page < 1) {
    throw new Error('Page must be greater than 0');
  }

  if (limit < 1 || limit > 1000) {
    throw new Error('Limit must be between 1 and 1000');
  }
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}