import useStreamContext from '../hooks/useStreamContext'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import useSettingsContext from '../hooks/useSettingsContext'
import Button from './Button'
import { GridLoader } from 'react-spinners'


export default function AvatarStream({ message, audio }) {
  const {
    peerConnection, 
    streamingStatus, 
    startStream, 
    destroyStream, 
    talkToStream,
    videoRef,
    error,
    loading
  } = useStreamContext()
  const { showAvatarDetails, showAvatarAndChat, gender } = useSettingsContext()
  const controls = useAnimation()
  const idleVideo = gender === 'male' ? ('./src/idle_male.mp4') : (gender === 'female' && ('./src/idle8.mp4'))

  console.log(peerConnection)
  console.log(streamingStatus)
  console.log(loading)
  console.log(error)
  console.log(videoRef.current)
  console.log(videoRef.current?.src)
    
  async function handleTalkToStream() {
    console.log('test')
    const talkResults = await talkToStream(message, audio)
    console.log(talkResults)
    if (talkResults.ok) {
      console.log('talking to stream...')
      controls.start('fadeIn')
    }
  } 

  async function handleGetStream() {
    startStream(gender)
  } 

  async function handleDestroyStream() {
    destroyStream()
  } 

  const onVideoEnd = (e) => {
    if (e.target.srcObject) {
      controls.start('fadeOut')
    }
  };

  // const onAnimationComplete = () => {
  //   if (controls.current === 'fadeOut') {
  //     controls.start('hidden');
  //   }
  // }

  return (
    <div className={showAvatarAndChat ? AvatarAndChatClass : `${AvatarOnlyClass} bg-gradient-to-b from-transparent from-40% via-slate-900 via-70% to-transparent`}>
      <div className='flex'>
        {showAvatarDetails &&
        <div className='flex flex-col'>
          <span>{`Streaming Status: ${streamingStatus}`}</span>
          <span>{`ICE Gathering State Status: ${peerConnection?.iceGatheringState}`}</span>
          <span>{`ICE Connection State: ${peerConnection?.iceConnectionState}`}</span>
          <span>{`Connection State: ${peerConnection?.connectionState}`}</span>
          <span>{`Signaling State: ${peerConnection?.signalingState}`}</span>
          <div className='flex gap-4 justify-center bg-indigo-800 rounded-2xl w-fit p-2 mt-4'>
            <button type="button" onClick={handleGetStream}>Start</button>
            <button type="button" onClick={handleTalkToStream}>Click</button>
            <button type="button" onClick={handleDestroyStream}>End</button>
          </div>
        </div>
        }
        <AnimatePresence mode='wait'>
          {
          !loading ?
            !error ?
              <motion.video ref={videoRef} playsInline width={showAvatarAndChat ? "50%" : "700"} height="700" autoPlay className='rounded-full' initial={'fadeIn'} animate={controls} variants={fadeInOut} onEnded={onVideoEnd} src={peerConnection && idleVideo} ></motion.video>
              :
              <div className='h-[30vh] grid place-content-center gap-4'>
                <span>Something went wrong, try again.</span>
                <Button onClick={handleGetStream}>Reload Avatar</Button>
              </div>
          :
            <div className='h-[30vh] grid place-content-center'>
              <GridLoader 
              color="#fed7aa"
              loading
              margin={6}
              size={8}
              speedMultiplier={1.5}
              />
            </div>
          }
          {/* <motion.video
            // key={streamingStatus ? streamingStatus : 'empty'}
            // variants={fadeIn}
            ref={videoRef}
            playsInline
            width="30%"
            height="100%"
            autoPlay
            className='rounded-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // transition={{ duration: 1 }}
          >
          </motion.video> */}
      </AnimatePresence>
      </div>
    </div>
  )
}


const fadeInOut = {
  fadeIn: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  }
}

// const AvatarAndChatClass = 'absolute top-0 left-1/2 -translate-x-1/2 flex flex-col'
const AvatarAndChatClass = 'absolute bottom-10 left-15 flex flex-col'
const AvatarOnlyClass = 'sticky top-0 flex flex-col items-center'