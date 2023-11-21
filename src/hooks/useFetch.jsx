import React from 'react'


export default async function useFetch(method, url, options = {}) {

    let requestOptions = {
        method: method,
        signal: options?.controller?.signal ?? null,
        body: options?.body ?? null,
        promiseAll: options?.promiseAll ?? null
    }

    if (url.includes('/chat') || url.includes('/streams') || url.includes('cart') || url.includes('voice')) {
        requestOptions.headers = { "Content-Type": "application/json" }
    }

    console.log(requestOptions)
    console.log(requestOptions.body)

    try {
        if (requestOptions.promiseAll) {
            const response = fetch(url, requestOptions)
            if (!response.ok) return response || `${response.status} - ${response.statusText}`
            console.log(response)
            return response
        } else {
            const response = await fetch(url, requestOptions)
            console.log(response)
            if (!response.ok) {
                const responseError = await response.json()
                return responseError.message ? 
                    (`${response?.status} - ${response?.statusText}\n${responseError.message}`)
                    :
                    (`${response?.status} - ${response?.statusText}`)
            }
            if (url.includes('elevenlabs/voice') || url.includes('openai/voice')) {
                const audioResult = await response.blob()
                console.log(audioResult.type)
                const audioUrl = URL.createObjectURL(audioResult) 
                const audio = new Audio(audioUrl)
                return audio
            } else {
                console.log(response)
                const responseData = await response.json()
                console.log(responseData)
                if (!response.ok) return responseData || `${response.status} - ${response.statusText}`
                return responseData
            }
        }
    } catch (err) {
        if (err.name === 'AbortError') {
            console.log('AbortError: The user aborted a request.')
        } else {
            console.log(err)
            return 'useFetch Error: Oops try again.'
        }
    }
}
