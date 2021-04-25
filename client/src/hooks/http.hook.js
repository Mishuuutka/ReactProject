import {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}, typefile = false, dowlfile = false) => {
        setLoading(true)
        try {
            if (body && !typefile) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {method, body, headers})
            console.log(response)


            if (!dowlfile) {
                const data = await response.json()
                setLoading(false)
                return data
            } else {
                const data = await response
                setLoading(false)
                return data
            }

        }catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return { loading, request, error, clearError }
}