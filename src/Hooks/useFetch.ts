import { useEffect, useState } from "react";

export const useFetch = (url: string) => {
    const [data, setData] = useState(null)
    const [err, setErr] = useState<any>(null)
    const [loading, setloading] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchData = async () => {
            setloading(true)
            try {
                const res = await fetch(url)
                if (!res.ok) {
                    throw new Error("Error en la petición: " + res.status)
                }
                const json = await res.json()
                if (!signal.aborted) {
                    setData(json)
                    setErr(null)
                }
            } catch (err) {
                if (!signal.aborted) {
                    setData(null)
                    setErr(err)
                }
            } finally {
                setloading(false)
            }
        }
        fetchData()
        return () => abortController.abort()
    }, [url])
    return { data, err, loading }
}
