import React, { useEffect, useRef, useState } from 'react'
import useFetch from '../hooks/useFetch'
import { Form, useActionData, useFetcher, useLoaderData, useRevalidator } from 'react-router-dom'
import { Brain, FileArrowUp, Function, PaperPlaneRight, Trash, UserCircle } from '@phosphor-icons/react'
import ChatHistory from '../components/ChatHistory'
import ChatInput from '../components/ChatInput'
import AudioPlayer from '../components/AudioPlayer'
import Cart from '../components/Cart'
import { motion, AnimatePresence } from 'framer-motion'
import useLocalStorage from '../hooks/useLocalStorage'
import WaveSurfer from '../components/WaveSurfer'
import AvatarStream from '../components/AvatarStream'
import useStreamContext from '../hooks/useStreamContext'
import useSettingsContext from '../hooks/useSettingsContext'

const LOCAL_URL = import.meta.env.VITE_LOCAL_URL

export default function ChatPage() {
  const chatRef = useRef()
  const [prompt, setPrompt] = useState('')
  const [chat, setChat] = useLocalStorage('chatHistory', [])
  const [audio, setAudio] = useState(null)
  // const [cart, setCart] = useState([])
  const message = useActionData()
  const cart = useLoaderData()
  const revalidator = useRevalidator()
  const { enableAvatar, showAvatarAndChat, tts } = useSettingsContext()
  const { talkToStream, peerConnection } = useStreamContext()
  const fetcher = useFetcher()

  console.log(cart)
  console.log(tts)

  useEffect(() => {
    if (message && prompt) {
      if (prompt !== '') {
        console.log(prompt)
        console.log(message)
        console.log(peerConnection)
        const textResponse = message?.textResponse
        setChat(prevHistory => {
            return [
                ...prevHistory,
                {
                question: prompt,
                answer: textResponse instanceof Error ? textResponse.message : textResponse.output ?? textResponse.message
                }
            ]
        })
        setPrompt('')
        const audioResponse = message?.audioResponse ?? null
        if (audioResponse) setAudio(audioResponse)
        if (enableAvatar && peerConnection) {
          if (tts === 'microsoft_tts') {
            talkToStream(textResponse.output)
          } else if ((tts === 'elevenlabs_tts' || tts === 'openai_tts') && audioResponse) {
            talkToStream(textResponse.output, audioResponse)
          } 
        }
        // fetcher.load('/chat')
        revalidator.revalidate()
      }
    }
    if (message?.type === 'File') {
      setChat(prevHistory => {
          return [
              ...prevHistory,
              {
              question: `Uploaded file: ${message.filename}`,
              answer: message instanceof Error ? message : message.output ?? message.message
              }
          ]
      })
    }
    chatRef.current.focus()
  }, [message])

  async function restartChat() {
    if (cart?.cartItems?.length) {
      await useFetch('DELETE', LOCAL_URL + '/api/cart/delete')
    }
    setChat([])
    revalidator.revalidate()
    // fetcher.load('/chat')
  }

  console.log(enableAvatar && showAvatarAndChat)

  return (
    <div className=''>
      <div className='relative left-1/2 -translate-x-1/2 2xl:max-w-screen-lg max-w-[50dvw] h-screen'>
          <ChatHistory chat={chat} audio={audio} />
          <ChatInput ref={chatRef} prompt={prompt} setPrompt={setPrompt} chatHistory={chat} />
      </div>
      <AnimatePresence initial={false} mode='wait'>
      {cart?.cartItems?.length > 0 &&
        <Cart cartItems={cart?.cartItems} checkout={cart?.cartCheckoutStatus} revalidator={revalidator} />
      }
      </AnimatePresence>
      {audio &&
      <>
        {/* <WaveSurfer key={audio.src} currentAudio={audio} /> */}
        {/* <AudioPlayer key={audio.src} currentAudio={audio} /> */}
      </>
      }
      {(enableAvatar && showAvatarAndChat) && <AvatarStream message={message?.textResponse} audio={audio} />}
      <motion.button whileHover={{ scale: 1.1}} whileTap={{ scale: 0.9 }} title='Neuer Chat' className='absolute bottom-5 right-5' type="button" onClick={restartChat} >
        <Trash weight='duotone' size={32} className='text-indigo-800 hover:text-red-800' />
      </motion.button>
    </div>
  )
}

export async function loader({request}) {
  console.log(request)
  const cartResponse = await useFetch('GET', LOCAL_URL + '/api/cart/get', {controller: request.signal})
  console.log(cartResponse)

  return cartResponse
}

export async function action({ request, params }) {
  console.log(request)
  const formData = await request.formData()
  // const prompt = Object.fromEntries(formData)
  const prompts = {}
  for (const [key, value] of formData.entries()) {
    if (prompts[key] === undefined) {
      if (key === 'functions') {
        prompts[key] = [value]
      } else {
        if (key !== 'fileUpload') prompts[key] = value
      }
    } else {
      prompts[key].push(value)
    }
  }

  const fileUpload = formData.get('fileUpload')

  console.log(request)
  console.log(fileUpload.name)
  console.log(prompts)
  if (fileUpload.name === '') {
    let response
    const textResponse = await useFetch('POST', LOCAL_URL + "/api/chat", {body: JSON.stringify(prompts)})
    console.log(formData.get('language'))
    console.log(textResponse)
    response = { textResponse }
    console.log(formData.get('tts'))
    if (formData.get('tts') === 'elevenlabs_tts') {
      console.log('fetching audio from elevenlabs...')
      const audioResponse = await useFetch('POST', LOCAL_URL + "/api/voice/elevenlabs/voice", {body: JSON.stringify({
        prompt: textResponse.output,
        gender: formData.get('gender')
      })})
      response = {
        textResponse,
        audioResponse
      }
    }
    if (formData.get('tts') === 'openai_tts') {
      console.log('fetching audio from openai...')
      const audioResponse = await useFetch('POST', LOCAL_URL + "/api/voice/openai/voice", {body: JSON.stringify({
        prompt: textResponse.output,
        gender: formData.get('gender')
      })})
      console.log(audioResponse)
      response = {
        textResponse,
        audioResponse
      }
    }
    return response
  } else {
    const fileResponse = useFetch('POST', LOCAL_URL + "/api/database/create", {body: formData})
    return fileResponse
  }
  // const response = useFetch('POST', LOCAL_URL + "/api/database/query", {body: JSON.stringify(prompts)})
  // console.log(fileResponse)
}