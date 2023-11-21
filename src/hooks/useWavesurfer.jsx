import { useEffect, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import Timeline from 'wavesurfer.js'


const url = 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3'

const props = {
    barWidth: 3,
    barGap: 4,
    cursorWidth: 1,
    // container: '#waveform',
    // backend: 'WebAudio',
    height: 80,
    width: 200,
    progressColor: '#6366f1',
    responsive: true,
    waveColor: '#EFEFEF',
    cursorColor: 'transparent',
    autoplay: true,
    // url: url,
    // plugins: {[Timeline.create()]}
}

export const useWavesurfer = (containerRef, currentAudio) => {
  const [wavesurfer, setWavesurfer] = useState(null)

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      ...props,
      url: currentAudio.src,
      container: containerRef.current,
    })

    setWavesurfer(ws)

    return () => {
      ws.destroy()
    }
  }, [props, containerRef, currentAudio])

  return wavesurfer
}