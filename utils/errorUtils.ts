function getErrorText(error: unknown): string {
  if (!error) return ""

  if (typeof error === "string") return error

  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause
    return `${error.name} ${error.message} ${getErrorText(cause)}`.trim()
  }

  if (typeof error === "object") {
    const err = error as {
      code?: unknown
      message?: unknown
      name?: unknown
      cause?: unknown
      errors?: unknown
    }

    const nestedErrors = Array.isArray(err.errors) ? err.errors : []
    return [
      typeof err.name === "string" ? err.name : "",
      typeof err.code === "string" ? err.code : "",
      typeof err.message === "string" ? err.message : "",
      getErrorText(err.cause),
      ...nestedErrors.map((nested) => getErrorText(nested)),
    ]
      .filter(Boolean)
      .join(" ")
  }

  return String(error)
}

function isDbConnectionError(error: unknown) {
  const message = getErrorText(error)
  return (
    message.includes("ETIMEDOUT") ||
    message.includes("P1001") ||
    message.includes("Can't reach database server") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ECONNRESET") ||
    message.includes("ErrorEvent")
  )
}


export { getErrorText, isDbConnectionError }