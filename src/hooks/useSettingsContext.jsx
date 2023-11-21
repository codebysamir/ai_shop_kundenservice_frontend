import { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'

export default function useSettingsContext() {
    const contextValue = useContext(SettingsContext)

    console.log(contextValue)

    if (!contextValue) {
        throw new Error('This Context has no value')
    }

    return contextValue
}
