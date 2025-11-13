export function handleExecutionError(error: any) {
  // Normalize error into JSON-friendly object that the node returns as an item
  const message = error?.message || 'Unknown error';
  const status = error?.statusCode || error?.status || 500;
  const stack = error?.stack;

  return {
    error: {
      message,
      status,
      stack,
    },
  };
}
