// Date utility functions

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Format a date string to a time format
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Format a date string to a relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) {
    return "just now"
  }

  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60)

  if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`
  }

  // Convert to hours
  const diffHour = Math.floor(diffMin / 60)

  if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`
  }

  // Convert to days
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`
  }

  // If more than a week, return the formatted date
  return formatDate(dateString)
}

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString)
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Get the current date as an ISO string (YYYY-MM-DD)
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0]
}

/**
 * Get the start of the current week as a Date object
 */
export const getStartOfWeek = (): Date => {
  const date = new Date()
  const day = date.getDay() // 0 = Sunday, 1 = Monday, etc.
  const diff = date.getDate() - day

  return new Date(date.setDate(diff))
}

/**
 * Get an array of the last n days as ISO strings
 */
export const getLastNDays = (n: number): string[] => {
  const result: string[] = []
  const today = new Date()

  for (let i = 0; i < n; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    result.push(date.toISOString().split("T")[0])
  }

  return result
}
