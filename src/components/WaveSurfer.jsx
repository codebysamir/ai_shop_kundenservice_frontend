import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWavesurfer } from '../hooks/useWavesurfer'
import { PauseCircle, PlayCircle } from '@phosphor-icons/react'
// import Timeline from 'wavesurfer.js/dist/plugins/timeline.cjs'





export default function WaveSurfer({ currentAudio }) {
    const containerRef = useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const wavesurfer = useWavesurfer(containerRef, currentAudio)

    const onPlayClick = useCallback(() => {
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
      }, [wavesurfer])

    useEffect(() => {
      if (!wavesurfer) return
  
      setCurrentTime(0)
      setIsPlaying(false)
  
      const subscriptions = [
        wavesurfer.on('play', () => setIsPlaying(true)),
        wavesurfer.on('pause', () => setIsPlaying(false)),
        wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
      ]

  
      return () => {
        subscriptions.forEach((unsub) => unsub())
      }
    }, [wavesurfer])


    
  return (
    <div className='absolute bottom-1 left-48 flex gap-4 items-center'>
      <button onClick={onPlayClick}>
      {isPlaying ? 
        (<PauseCircle size={40} className='hover: text-primary-500 transition-colors' />) 
        : 
        (<PlayCircle size={40} className='hover:text-primary-500 transition-colors' />)
      }
      </button>
      <div className='cursor-pointer' ref={containerRef} />
    </div>
  )
}
