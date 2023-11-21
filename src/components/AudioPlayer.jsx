import { PauseCircle, PlayCircle, SpinnerGap } from '@phosphor-icons/react'
import React, { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({ currentAudio, audioCount, audioIndex }) {
    const [duration, setDuration] = useState(0)
    const [isReady, setIsReady] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause()
            setIsPlaying(false)
        } else {
            audioRef.current?.play()
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        togglePlayPause()
    }, [currentAudio])

  return (
    <div className='fixed bottom-[2.5vh] right-[22rem]'>
        <audio 
            ref={audioRef} 
            preload='metadata'
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
            onCanPlay={e => setIsReady(true)}
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
        >
            <source type='audio/mpeg' src={currentAudio.src} />
        </audio>
        <div>
            <div className="flex items-center gap-3 justify-self-center cursor-pointer" onClick={togglePlayPause}>
                {!isReady && currentAudio ? (
                    <SpinnerGap size={40} className='animate-spin' />
                ) : isPlaying ? (
                    <PauseCircle size={40} />
                ) : (
                    <PlayCircle size={40} />
                )}
            </div>
        </div>
        {/* {isReady &&
        } */}
        {/* {currentAudio &&
        } */}
    </div>
  )
}
