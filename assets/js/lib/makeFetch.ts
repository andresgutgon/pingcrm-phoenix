import { Result, TypedResult } from './Result'

function getCsrfToken(): string {
  const meta = document.querySelector('meta[name="csrf-token"]')
  return meta?.getAttribute('content') || ''
}

export async function makeRequest({
  url,
  options = {},
  signal,
  onUploadProgress,
}: {
  url: string
  options?: RequestInit
  signal?: AbortSignal
  onUploadProgress?: (progress: number) => void
}): Promise<TypedResult<Response, Error>> {
  try {
    const csrfToken = getCsrfToken()
    if (options.body && onUploadProgress) {
      return await makeRequestWithProgress({
        url,
        options,
        signal,
        onUploadProgress,
      })
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
        ...options.headers,
      },
      signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return Result.ok(response)
  } catch (error) {
    return Result.error(
      error instanceof Error ? error : new Error(String(error)),
    )
  }
}

export class AbortError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AbortError'
  }
}

async function makeRequestWithProgress({
  url,
  options,
  signal,
  onUploadProgress,
}: {
  url: string
  options: RequestInit
  signal?: AbortSignal
  onUploadProgress: (progress: number) => void
}): Promise<TypedResult<Response, Error>> {
  try {
    const body = options.body as File | Blob
    if (!(body instanceof Blob)) {
      throw new Error('Body must be a File or Blob when tracking progress')
    }

    return await new Promise<TypedResult<Response, Error>>(
      (resolve) => {
        const xhr = new XMLHttpRequest()
        xhr.open(options.method || 'PUT', url)

        if (options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            if (typeof value === 'string') {
              xhr.setRequestHeader(key, value)
            }
          })
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onUploadProgress(progress)
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(
              Result.ok(new Response(xhr.response, { status: xhr.status })),
            )
          } else {
            resolve(Result.error(new Error(`HTTP error! status: ${xhr.status}`)))
          }
        }

        xhr.onerror = () => {
          resolve(Result.error(new Error('Network error during upload')))
        }

        // Handle aborts
        if (signal) {
          signal.addEventListener('abort', () => {
            xhr.abort()
            resolve(Result.error(new AbortError('Upload aborted')))
          })
        }

        xhr.send(body)
      },
    )
  } catch (error) {
    return Result.error(
      error instanceof Error ? error : new Error(String(error)),
    )
  }
}

// Helper function to fetch JSON with CSRF headers
export async function makeJsonRequest<T = unknown>({
  url,
  options = {},
  signal,
}: {
  url: string
  options?: RequestInit
  signal?: AbortSignal
}): Promise<TypedResult<T, Error>> {
  try {
    const response = await makeRequest({ url, options, signal })

    if (!response.ok) {
      return Result.error(response.error || new Error('Unknown error'))
    }

    const data = await response.unwrap().json()
    return Result.ok(data)
  } catch (error) {
    return Result.error(
      error instanceof Error ? error : new Error(String(error)),
    )
  }
}
