import { Microphone, Record } from '@phosphor-icons/react';
import React, { useRef, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const LOCAL_URL = import.meta.env.VITE_LOCAL_URL
const mimeType = 'audio/mp3'

export default function AudioRecorder({ onChangeInput, setPrompt, textareaRef }) {
    const [permission, setPermission] = useState(false)
    const [stream, setStream] = useState(null)
    const [recording, setRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const mediaRecorderRef = useRef(null);


    const getMicrophonePermission = async () => {
      if ("MediaRecorder" in window) {
        try {
          let browser = browserDetector()
          console.log(browser)
          if (browser !== 'Firefox') {
            const checkPermission = await navigator.permissions.query({name: 'microphone'})
            console.log(`Microphone Permission State: ${checkPermission.state}`)
            if (checkPermission.state === 'prompt' || checkPermission.state === 'granted') {
              const streamData = await navigator.mediaDevices.getUserMedia({
                  audio: true,
                  video: false,
              });
              setStream(streamData);
              setPermission(true);
              return streamData
            } else {
              setPermission(false);
              setStream(null)
              alert(checkPermission.state)
              return null
            }
          } else {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            setPermission(true);
            setStream(streamData);
            return streamData
          }
        } catch (err) {
            alert(err.message);
            setPermission(false)
        }
      } else {
        alert("The MediaRecorder API is not supported in your browser.");
      }
    }

  
    const startRecording = async () => {
      const localStream = await getMicrophonePermission()
      console.log(localStream)
      if (!localStream) return console.log('No Streamdata')
      if (!permission && !localStream) return console.log('No Permission')
      
      mediaRecorderRef.current = new MediaRecorder(stream || localStream);

      mediaRecorderRef.current.start();
      setRecording(true);
      let localAudioChunks = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return
        if (event.data.size === 0) return 
        console.log(event.data)
        localAudioChunks.push(event.data)
      }
      setAudioChunks(localAudioChunks)
    };
  
    const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = () => {
          setRecording(false);
          console.log(audioChunks)
    
          const audioBlob = new Blob(audioChunks, { type: mimeType });
          console.log(audioBlob)
          setAudioChunks(false)
          // Send the audioBlob to your backend using Axios or Fetch
          uploadAudioBlob(audioBlob);
        }
      }
    };
  
    const uploadAudioBlob = async (audioBlob) => {
      const formData = new FormData()
      formData.append('fileUpload', audioBlob, 'recordingText.mp3')

      try {
        const response = await fetch(LOCAL_URL + '/api/chat/speech-to-text', {
          method: 'POST',
          // headers: {
          //     'Content-Type': 'multipart/form-data'
          // },
          body: formData
        })
  
        console.log(response)
        const audioAsText = await response.json()
        console.log(audioAsText.message)
        console.log(textareaRef)
        
        if (textareaRef) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set
          const event = new Event('input', { bubbles: true })
          nativeInputValueSetter.call(textareaRef, textareaRef ? `${textareaRef?.value} ${audioAsText.message}` : audioAsText.message)
          textareaRef.dispatchEvent(event)
          
          onChangeInput(textareaRef)
        } else {
          setPrompt(prevPrompt => `${prevPrompt} ${audioAsText.message}`)
        }
      } catch (error) {
        console.log(error)  
        return 'AudioRecording couldnt be send to the Backend.'
      }
    };
  
    return (
      <>
        {!recording ?
        (<button title='Start recording' onClick={startRecording} type="button">
          <Microphone weight='bold' size={24} color='#6366F1' />
        </button>)
        :
        (<button className='animate-pulse' title='Stop recording' onClick={stopRecording} type="button">
          <Record size={32} weight='duotone' color='red' />
        </button>)
        }
      </>
    );
}

function browserDetector() {
  const browserArray = ['Edg', 'Opr', 'Chrome', 'Firefox', 'Safari']
  let browser
  let userAgent = navigator.userAgent

  if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox' 
  } else {
    browser = 'Other browser'
  }
  return browser
}
