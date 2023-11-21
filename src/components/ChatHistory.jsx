import { ArrowDown, Brain, UserCircle } from '@phosphor-icons/react'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useActionData, useNavigation } from 'react-router-dom'
import AudioPlayer from './AudioPlayer'
import useSettingsContext from '../hooks/useSettingsContext'
import AvatarStream from './AvatarStream'

export default function ChatHistory({ chat }) {
    // const message = useActionData()
    const chatContainerRef = useRef(null)
    const { enableAvatar, showAvatarAndChat } = useSettingsContext()

    // console.log(question ? question.value : question)

    console.log(chat)
    const lastMessage = chat.at(-1)
    

    useEffect(() => {
        if (chat && chatContainerRef.current) {
            // chatContainerRef.current.scrollIntoView({behavior: 'smooth' , block: "end", inline: 'nearest' })
            chatContainerRef.current.scrollTo({top: chatContainerRef.current.scrollHeight ,behavior: 'smooth'})
            // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [chat])

  return (
    <div ref={chatContainerRef} className={`flex flex-col gap-4 overflow-x-auto h-full no-scrollbar ${enableAvatar && !showAvatarAndChat ? 'pb-24' : 'py-24'}`}>
        {chat.length ?
            ((enableAvatar && !showAvatarAndChat) ?
                <div className='flex flex-col gap-4'>
                    <AvatarStream message={lastMessage.answer} />
                    <div className='flex self-end items-center gap-4'>
                        <div className='bg-orange-200 text-black font-semibold p-8 rounded-xl'>{lastMessage.question}</div>
                        <UserCircle size={48} color="#fed7aa" weight='duotone' />
                    </div>
                    <div className='flex  self-start items-center gap-4'>
                        <Brain size={48} color="#224c7c" weight="duotone" className='min-w-[48px]' />
                        <div className={`bg-blue-950 p-8 rounded-xl whitespace-pre-wrap ${lastMessage.answer instanceof Error && 'border-4 border-red-600'}`}>{lastMessage.answer}</div>
                    </div>
                </div>
                :
                chat.map((chat, index) => (
                <div key={index} className='flex flex-col gap-4'>
                    <div className='flex self-end items-center gap-4'>
                        <div className='bg-orange-200 text-black font-semibold p-8 rounded-xl'>{chat.question}</div>
                        <UserCircle size={48} color="#fed7aa" weight='duotone' />
                    </div>
                    <div className='flex  self-start items-center gap-4'>
                        <Brain size={48} color="#224c7c" weight="duotone" className='min-w-[48px]' />
                        <div className={`bg-blue-950 p-8 rounded-xl whitespace-pre-wrap ${chat.answer instanceof Error && 'border-4 border-red-600'}`}>{chat.answer}</div>
                    </div>
                </div>
                ))
            )
            :
           ( <div className='flex flex-col gap-4 justify-center items-center h-full'>
                {(enableAvatar && !showAvatarAndChat) && <AvatarStream />}
                <h1 className='text-2xl font-bold'>Kein Chatverlauf</h1>
                <span>Starte das Gespräch</span>
                <ArrowDown size={32} className='animate-bounce' />
            </div>)
        }
    </div>
  )
}


function parseAndRenderLinks(inputString) {
    const parsedString = inputString.replace(/<a\b[^>]*>(.*?)<\/a>/g, (match, linkText) => {
      const linkUrl = match.match(/href=["'](.*?)["']/)[1];
      return <a href={linkUrl}>{linkText}</a>;
    });

    return <div dangerouslySetInnerHTML={{ __html: parsedString }} />;
}

function getUrl(inputString) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    if (inputString.includes(urlRegex)) {
        const split = inputString.split(urlRegex)
        console.log(split)
        split.map(part => part.match(urlRegex))

        return inputString
    } else {
        return inputString
    }
}