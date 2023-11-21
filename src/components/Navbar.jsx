import React, { useState } from 'react'
import { ArrowFatLinesLeft, ArrowFatLinesRight } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence, easeInOut } from 'framer-motion'
import useSettingsContext from '../hooks/useSettingsContext'
import useStreamContext from '../hooks/useStreamContext'

export default function Navbar() {
  const [showNav, setShowNav] = useState(false)
  const {enableAvatar, setEnableAvatar, showAvatarDetails, setShowAvatarDetails, showAvatarAndChat, setShowAvatarAndChat, setTts, setGender, setVoiceLanguage} = useSettingsContext()
  const { avatarCredits, elevenlabsCredits } = useStreamContext()

  return (
    <AnimatePresence initial={false} mode='wait'>
        {showNav ?
        <motion.div key={'navIn'} variants={dropIn} transition={transition} initial={'hidden'} animate={'visible'} exit={'exit'} className='bg-slate-950 border-r-2 text-slate-50 p-8 h-full w-full flex flex-col gap-8'>
        <h1 className='text-3xl font-bold'>AI Kundenservice</h1>
        <ul>
            <li className='mb-4'>
                <NavLink to={'/chat'} className={({ isActive, isPending }) => isActive ? isActiveClass : isPending ? isPendingClass : 'hover:bg-slate-400 p-2 rounded-md cursor-pointer uppercase'}>Chat</NavLink>
            </li>
            <li className='mb-4'>
                <NavLink to={'/dashboard'} className={({ isActive, isPending }) => isActive ? isActiveClass : isPending ? isPendingClass : 'hover:bg-slate-400 p-2 rounded-md cursor-pointer uppercase'}>
                    Dashboard
                </NavLink>
            </li>
        </ul>
        <div className='flex flex-col gap-4 mt-auto' >
            <fieldset className='flex flex-col gap-3'>
                <legend className='pt-4 font-bold uppercase text-lg'>Options </legend>
                <span className='mt-6 font-bold text-neutral-400'>Enable Avatar</span>
                <div className='flex gap-4'>
                    <input type="checkbox" name="settingsAvatar" id="avatar" checked={enableAvatar} className='bg-indigo-200' onChange={() => setEnableAvatar(!enableAvatar)} />
                    <label htmlFor="avatar">Avatar</label>
                </div>
                {avatarCredits > 0 ? 
                <span className='text-neutral-500 font-semibold text-sm'>Available Credits: <span className='text-indigo-500'>
                {avatarCredits}</span>
                </span>
                :
                <span className='text-neutral-500 font-semibold text-sm'>No available Credits left</span>
                }
                <div className={`flex flex-col gap-3 rounded-md p-4 overflow-y-auto max-h-96 ${!enableAvatar && 'bg-neutral-600 opacity-10 pointer-events-none'}`}>
                    <span className='font-bold text-neutral-400'>Avatar Settings</span>
                    <div className='flex flex-col pl-4 gap-2'>
                        <div className='flex gap-2'>
                            <input type="checkbox" name="avatarDetails" id="avatarDetails" checked={showAvatarDetails} className='bg-indigo-200' onChange={() => setShowAvatarDetails(!showAvatarDetails)} />
                            <label htmlFor="avatarDetails">Avatar Details</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" name="avatarWithChat" id="avatarAndChathistory" checked={showAvatarAndChat} className='bg-indigo-200' onChange={() => setShowAvatarAndChat(!showAvatarAndChat)} />
                            <label htmlFor="avatarAndChathistory">Show Avatar and Chathistory</label>
                        </div>
                    </div>
                    <span className='mt-4 font-bold text-neutral-400'>Text-To-Speech Provider</span>
                    <div className='flex flex-col pl-4 gap-2'>
                        <div className='flex gap-2'>
                            <input onChange={(e) => setTts(e.target.id)} type="radio" name="settingsTTS" id="microsoft_tts" defaultChecked className='bg-indigo-200' />
                            <label htmlFor="microsoft_tts">Microsoft TTS</label>
                        </div>
                        <div className='flex gap-2'>
                            <input onChange={(e) => setTts(e.target.id)} type="radio" name="settingsTTS" id="openai_tts" className='bg-indigo-200' />
                            <label htmlFor="openai_tts">Open AI TTS</label>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input onChange={(e) => setTts(e.target.id)} type="radio" name="settingsTTS" id="elevenlabs_tts" className='bg-indigo-200' />
                            <label htmlFor="elevenlabs_tts">Elevenlabs TTS</label>
                            {elevenlabsCredits && <span className='text-neutral-500 font-semibold text-sm'>Available Credits: <span className='text-indigo-500'>
                            {elevenlabsCredits}</span></span>
                            }
                        </div>
                    </div>
                    <span className='mt-4 font-bold text-neutral-400'>Gender</span>
                    <div className='flex flex-col pl-4 gap-2'>
                        <div className='flex gap-2'>
                            <input onChange={(e) => setGender(e.target.id)} type="radio" name="settingsVoiceGender" id="female" defaultChecked className='bg-indigo-200' />
                            <label htmlFor="female">Female</label>
                        </div>
                        <div className='flex gap-2'>
                            <input onChange={(e) => setGender(e.target.id)} type="radio" name="settingsVoiceGender" id="male" className='bg-indigo-200' />
                            <label htmlFor="male">Male</label>
                        </div>
                    </div>
                    <span className='mt-4 font-bold text-neutral-400'>Voice Language</span>
                    <div className='flex flex-col pl-4 gap-2'>
                        <div className='flex gap-2'>
                            <input onChange={(e) => setVoiceLanguage(e.target.id)} type="radio" name="settingsVoiceLanguage" id="german" defaultChecked className='bg-indigo-200' />
                            <label htmlFor="german">German</label>
                        </div>
                        <div className='flex gap-2'>
                            <input onChange={(e) => setVoiceLanguage(e.target.id)} type="radio" name="settingsVoiceLanguage" id="swissgerman" className='bg-indigo-200' />
                            <label htmlFor="swissgerman">Swissgerman (only MS TTS)</label>
                        </div>
                        <div className='flex gap-2'>
                            <input onChange={(e) => setVoiceLanguage(e.target.id)} type="radio" name="settingsVoiceLanguage" id="english" className='bg-indigo-200' />
                            <label htmlFor="english">English</label>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
        <div className='flex flex-col gap-4 mt-auto' >
            <motion.button whileHover={{ scale: 1.1}} whileTap={{ scale: 0.9 }} type="button" onClick={() => setShowNav(false)} className='mr-auto' >
                <ArrowFatLinesLeft size={32} className='text-primary-500' weight="duotone" />
            </motion.button>
        </div>
        </motion.div>
        :
        <motion.div key={'navOut'} variants={dropIn} transition={transition} initial={'hidden'} animate={'visible'} exit={'exit'} className='flex justify-center items-center h-full'>
            <motion.button whileHover={{ scale: 1.1}} whileTap={{ scale: 0.9 }} className='mr-auto pl-4' type='button' onClick={() => setShowNav(true)}>
                <ArrowFatLinesRight size={32} className='text-primary-500' weight="duotone" />
            </motion.button>
        </motion.div>
        }
    </AnimatePresence>
  )
}

const dropIn = {
    hidden: {
      x: '-20vw',
      // width: 0,
      // opacity: 0,
    },
    visible: {
      x: 0,
      // opacity: 1,
    },
    exit: {
      x: '-20vw',
      // opacity: 0,
    },
  }
  
  const transition = {
    duration: 0.250,
    // type: ''
    ease: easeInOut,
  }
  
  const isActiveClass = 'bg-indigo-800 p-2 rounded-md cursor-pointer uppercase'
  const isPendingClass = 'bg-red-400 p-2 rounded-md cursor-pointer uppercase'