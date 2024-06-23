const API_DOMAIN = process.env.AUTH0_ISSUER_BASE_URL

const DEFAULT_TIMEOUT_MS = 60000

export async function submitGetRequest(path: string, headers: Record<string, string>, query?: Record<string, string>, timeoutMs?: number) {
  return submitRequest('GET', path, headers, null, query, timeoutMs)
}

export async function submitPostRequest<B>(path: string, headers: Record<string, string>, body: B, query?: Record<string, string>, timeoutMs?: number) {
  return submitRequest('POST', path, headers, body, query, timeoutMs)
}

async function submitRequest<B>(
  method: string,
  path: string,
  headers: Record<string, string>,
  body: B | null,
  query?: Record<string, string>,
  timeoutMs?: number
) {
  const apiUrl = new URL(`${API_DOMAIN}${path}`)

  if (query) {
    Object.keys(query).forEach((key) => apiUrl.searchParams.append(key, query[key]))
  }

  const init: RequestInit = {
    // headers: {
    //   'content-type': 'application/json',
    // },
    headers: headers,
    method: method,
  }

  if (body) {
    if (headers['content-type'] === 'application/x-www-form-urlencoded') {
      init.body = new URLSearchParams(body as Record<string, string>).toString();
    } else {
      init.body = JSON.stringify(body);
    }
  }

  const response = await withTimeout(fetch(apiUrl.toString(), init), timeoutMs)
  const json = await response.json()
  return json
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'))
    }, timeoutMs)

    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}