import React from 'react'


export default async function useFetch(method, url, body, promiseAll) {

    const controller = new AbortController()
    let options

    if (url.includes('/chat')) {
        options = {
            method: method,
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: body
        }
    } else {
        options = {
            method: method,
            signal: controller.signal,
            body: body
        }
    }

    console.log(body)

    try {
        if (promiseAll) {
            const response = fetch(url, options)
            console.log(response)
            return response
        } else if (url.includes('speech')) {
            console.log(options.body)
            const response = await fetch(url, options)
            if (!response.ok) return response || `${response.status} - ${response.statusText}`
            const audioResult = await response.blob()
            console.log(audioResult.type)
            const audioUrl = URL.createObjectURL(audioResult) 
            const audio = new Audio(audioUrl)
            return audio
        } else {
            const response = await fetch(url, options)
            console.log(response)
            if (!response.ok) return response || `${response.status} - ${response.statusText}`
            const responseData = await response.json()
            console.log(responseData)
            if (!response.ok) return responseData || `${response.status} - ${response.statusText}`
            return responseData
        }
    } catch (err) {
        console.log(err)
        return 'useFetch Error: Oops try again.'
    }
}
