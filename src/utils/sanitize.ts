/**
 * Sanitize text input to prevent XSS attacks
 */
export function sanitizeText(value: string | undefined, maxLength = 280): string {
  if (!value) {
    return ''
  }

  // Trim and limit length
  const trimmed = value.trim().slice(0, maxLength)

  // Remove potentially dangerous characters/patterns
  // This is a basic sanitization - for production, consider using a library like DOMPurify
  return trimmed
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
}

/**
 * Validate and sanitize URL input
 */
export function sanitizeUrl(value: string | undefined, maxLength = 240): string {
  if (!value) {
    return ''
  }

  const trimmed = value.trim().slice(0, maxLength)

  // Must be https or http protocol
  try {
    const url = new URL(trimmed)

    // Only allow http and https protocols
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return ''
    }

    return url.toString()
  } catch {
    // Invalid URL
    return ''
  }
}

/**
 * Validate that a URL points to an image
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false

  try {
    const parsed = new URL(url)

    // Check protocol
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false
    }

    // Check if it looks like an image URL (basic check)
    const pathname = parsed.pathname.toLowerCase()
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

    // Either has image extension or is from known image hosting services
    const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext))
    const isImageHost = ['covers.openlibrary.org', 'images.unsplash.com', 'i.imgur.com'].some(
      host => parsed.hostname.includes(host)
    )

    return hasImageExtension || isImageHost
  } catch {
    return false
  }
}