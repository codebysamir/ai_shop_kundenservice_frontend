import React, { createContext, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

export const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
    const [enableAvatar, setEnableAvatar] = useState(false)
    const [showAvatarDetails, setShowAvatarDetails] = useState(false)
    const [showAvatarAndChat, setShowAvatarAndChat] = useState(false)
    const [tts, setTts] = useLocalStorage('tts', 'microsoft_tts')
    const [gender, setGender] = useLocalStorage('avatarGender', 'female')
    const [voiceLanguage, setVoiceLanguage] = useLocalStorage('voiceLanguage', 'german')

    console.log(tts)
    console.log(gender)
    console.log(showAvatarAndChat)

    const settingsValue = {
        enableAvatar,
        setEnableAvatar,
        showAvatarDetails,
        setShowAvatarDetails,
        showAvatarAndChat,
        setShowAvatarAndChat,
        tts,
        setTts,
        gender,
        setGender,
        voiceLanguage,
        setVoiceLanguage
    }

  return (
    <SettingsContext.Provider value={settingsValue}>
        {children}
    </SettingsContext.Provider>
  )
}
