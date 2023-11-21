import React, { createContext, useState } from 'react'

export const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
    const [enableAvatar, setEnableAvatar] = useState(false)
    const [showAvatarDetails, setShowAvatarDetails] = useState(false)
    const [showAvatarAndChat, setShowAvatarAndChat] = useState(false)
    const [tts, setTts] = useState('microsoft_tts')
    const [gender, setGender] = useState('female')
    const [voiceLanguage, setVoiceLanguage] = useState('german')

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
