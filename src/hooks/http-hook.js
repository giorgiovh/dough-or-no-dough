import { useState, useCallback, useRef, useEffect } from 'react'

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const activeHttpRequests = useRef([])

  // we wrap the function below in a useCallback so that the function never gets re-created when the component that uses this hook re-renders
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true)
      const httpAbortCntrl = new AbortController()
      activeHttpRequests.current.push(httpAbortCntrl)

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          // this links the abort controller to this request
          signal: httpAbortCntrl.signal
        })

        const responseData = await response.json()

        // clear the abort controllers that belong to the request which just completed
        activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCntrl)

        // this is to check whether or not the response was code 400 or 500 and if it was, throw an error
        if (!response.ok) {
          throw new Error(responseData.message)
        }
        
        setIsLoading(false)
        return responseData
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
        throw err
      }
    },
    []
  )

  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
    }
  }, [])

  return { isLoading, error, sendRequest, clearError }
}