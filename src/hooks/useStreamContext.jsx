import React, { useContext, useEffect, useState } from 'react'
import { StreamContext } from '../context/StreamContext'

export default function useStreamContext() {
    const contextValue = useContext(StreamContext)

    console.log(contextValue)

    if (!contextValue) {
        throw new Error('This Context has no value')
    }

    return contextValue
}
