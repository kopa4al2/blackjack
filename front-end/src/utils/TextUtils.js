const DEFAULT_TRUNCATE = 50
export const truncate =
  (text, value = DEFAULT_TRUNCATE) => text.length > value ? `${text.substring(0, value)}...` : text