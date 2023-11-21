import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import useFetch from '../hooks/useFetch'
import useSettingsContext from '../hooks/useSettingsContext'

const LOCAL = import.meta.env.VITE_LOCAL_URL

export const StreamContext = createContext(null)

export function StreamProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [avatarCredits, setAvatarCredits] = useState(null)
    const [elevenlabsCredits, setElevenlabsCredits] = useState(null)
    const [peerConnectionState, setPeerConnectionState] = useState(null)
    const [streamIdState, setStreamIdState] = useState(null)
    const [sessionIdState, setSessionIdState] = useState(null)
    const [statsIntervalId, setStatsIntervalId] = useState(null)
    const [streamingStatus, setStreamingStatus] = useState(null)
    const videoRef = useRef(null)
    const { gender, tts, voiceLanguage, enableAvatar } = useSettingsContext()
    let videoIsPlaying
    let lastBytesReceived
    let peerConnectionLocal
    let iceGatheringState
    let iceConnectionState
    let connectionState
    let signalingState

    const idleVideo = gender === 'male' ? ('./src/idle_male.mp4') : (gender === 'female' && ('./src/idle8.mp4'))

    console.log(peerConnectionState)
    console.log(peerConnectionLocal)
    console.log(idleVideo)
    console.log(streamIdState)
    console.log(sessionIdState)

    
    useEffect(() => {
        const controller = new AbortController()
        if (enableAvatar) {
            console.log('Avatar enabled...')
            // stopAllStreams()
            closePC()
            startStream(gender, controller)
            getAvatarCredits()
            getElevenlabsCredits()
        } else {
            setLoading(true)
            destroyStream()
        }

        return () => {
            controller.abort()
        }
    }, [enableAvatar, gender])

    useEffect(() => {
        if (peerConnectionState){
            setLoading(false)
            setError(false)
        }
    }, [peerConnectionState])


    const startStream = async (gender, controller) => {
        console.log(peerConnectionLocal)
        if (peerConnectionState && peerConnectionState?.connectionState === 'connected') {
            return;
        }
        setError(false)
        setLoading(true)
    
        stopAllStreams();
        closePC();
        const createStream = await useFetch('POST', LOCAL + '/api/avatar/streams', {body: JSON.stringify({gender: gender}), controller})
        console.log(createStream)
        if (createStream === '429 - Too Many Requests') {
            setLoading(false)
            return setError(createStream)
        }
        const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = await createStream.data;
        const streamId = newStreamId;
        const sessionId = newSessionId;
        setStreamIdState(streamId)
        setSessionIdState(sessionId)
        
        const sessionClientAnswer = await createPeerConnection(offer, iceServers, streamId, sessionId);
        console.log('streamID: ', streamId)
        console.log('sessionID: ', sessionId)
        console.log('sessionClientAnswer: ', sessionClientAnswer)
        
        const startStream = await useFetch('POST', LOCAL + `/api/avatar/streams/sdp`, {
            body: JSON.stringify({
                streamId,
                sessionId,
                sessionClientAnswer
            }),
            // controller: controller.signal
        })
        const result = startStream
        console.log(result)
        return result
    } 

    const talkToStream = async (message, audio, controller) => {
        const formData = new FormData()
        if (tts === 'elevenlabs_tts' || tts === 'openai_tts') {
            console.log(audio)
            const fetchAudio = await fetch(audio.src)
            const audioBlob = await fetchAudio.blob()
            formData.append('fileUpload', audioBlob, 'ttsAudio.mp3')
        }
        if (tts === 'microsoft_tts') {
            formData.append('message', message)
        }
        formData.append('tts', tts)
        formData.append('gender', gender)
        formData.append('language', voiceLanguage)
        formData.append('streamId', streamIdState)
        formData.append('sessionId', sessionIdState)

        // connectionState not supported in firefox
        console.log(peerConnectionLocal)
        if (peerConnectionState?.signalingState === 'stable' || peerConnectionState?.iceConnectionState === 'connected') {
            console.log('test')
            const result = await fetch(LOCAL + '/api/avatar/streams/talks', {
                method: 'POST',
                body: formData
                // body: JSON.stringify({
                //     streamId: streamIdState,
                //     sessionId: sessionIdState,
                //     // message
                // }),
                // controller: controller.signal
            })
            console.log(result)
            return result
        }
    }

    const destroyStream = async () => {
        if (!sessionIdState || !streamIdState) return console.log('No Session ID or Stream Id')
        const result = await useFetch('POST', `${LOCAL}/api/avatar/streams/destroy`, {
          body: JSON.stringify({ sessionId: sessionIdState, streamId: streamIdState }),
        });
        console.log(result)
      
        stopAllStreams();
        closePC();
    };

    const getAvatarCredits = async (controller) => {
        const result = await useFetch('GET', `${LOCAL}/api/avatar/getCredits`,{controller})
        console.log(result)
        setAvatarCredits(result.remaining)
    }

    function onIceGatheringStateChange() {
        console.log(peerConnectionLocal)
        iceGatheringState = peerConnectionLocal?.iceGatheringState
    }

    async function onIceCandidate(streamId, sessionId, event) {
        if (event.candidate) {
            const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
        
            const iceCandidate = await useFetch('POST', LOCAL + `/api/avatar/streams/ice`, {
                body: JSON.stringify({
                candidate,
                sdpMid,
                sdpMLineIndex,
                session_id: sessionId,
                streamId
                }),
                // controller: request.signal
            })
            console.log(iceCandidate)
        }
    }

    function onIceConnectionStateChange() {
        console.log(peerConnectionLocal)
        iceConnectionState = peerConnectionLocal?.iceConnectionState
        if (peerConnectionLocal?.iceConnectionState === 'failed' || peerConnectionLocal?.iceConnectionState === 'closed') {
          stopAllStreams();
          closePC();
        }
    }
    function onConnectionStateChange() {
        // not supported in firefox
        connectionState = peerConnectionLocal?.connectionState
    }
    function onSignalingStateChange() {
        signalingState = peerConnectionLocal?.signalingState
    }

    function setVideoElement(stream) {
    if (!stream) return;
    videoRef.current.srcObject = stream;
    videoRef.current.loop = false;

    // safari hotfix
    if (videoRef.current.paused) {
        videoRef.current
        .play()
        .then((_) => {})
        .catch((e) => {});
    }
    }

    function playIdleVideo() {
        console.log(idleVideo)
        videoRef.current.srcObject = undefined;
        videoRef.current.src = idleVideo;
        videoRef.current.loop = true;
    }

    function stopAllStreams() {
        if (videoRef.current?.srcObject) {
        console.log('stopping video streams');
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        }
    }

    function onVideoStatusChange(videoIsPlaying, stream) {
        console.log(videoIsPlaying)
        let status;
        if (videoIsPlaying) {
        status = 'streaming';
        const remoteStream = stream;
        setVideoElement(remoteStream);
        } else {
        status = 'empty';
        if (videoRef.current) playIdleVideo();
        }
        setStreamingStatus(status)
        // streamingStatusLabel.innerText = status;
        // streamingStatusLabel.className = 'streamingState-' + status;
    }

    function onTrack(event, newPeerConnection) {
        /**
         * The following code is designed to provide information about wether currently there is data
         * that's being streamed - It does so by periodically looking for changes in total stream data size
         *
         * This information in our case is used in order to show idle video while no talk is streaming.
         * To create this idle video use the POST https://api.d-id.com/talks endpoint with a silent audio file or a text script with only ssml breaks 
         * https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html#break-tag
         * for seamless results use `config.fluent: true` and provide the same configuration as the streaming video
         */
    
        console.log(newPeerConnection)
        console.log(event)
        if (!event.track) return;
    
        const statsIntervalId_ = setInterval(async () => {
        const stats = await newPeerConnection.getStats(event.track)
        stats.forEach((report) => {
            if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
            const videoStatusChanged = videoIsPlaying !== report.bytesReceived > lastBytesReceived;
                // console.log(videoStatusChanged)
            if (videoStatusChanged) {
                videoIsPlaying = report.bytesReceived > lastBytesReceived;
                console.log(report.bytesReceived > lastBytesReceived)
                // setVideoIsPlaying(report.bytesReceived > lastBytesReceived);
                onVideoStatusChange(videoIsPlaying, event.streams[0]);
            }
            lastBytesReceived = report.bytesReceived;
            // setLastBytesRecieved(report.bytesReceived)
            }
        });
        }, 500);
        setStatsIntervalId(statsIntervalId_)
    }

    async function createPeerConnection(offer, iceServers, streamId, sessionId) {
        console.log(peerConnectionLocal)
        let newPeerConnection
        if (!peerConnectionLocal) {
            newPeerConnection = new RTCPeerConnection({ iceServers });
            console.log(newPeerConnection)
            newPeerConnection.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
            newPeerConnection.addEventListener('icecandidate', (event) => onIceCandidate(streamId, sessionId, event), true);
            newPeerConnection.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
            newPeerConnection.addEventListener('connectionstatechange', onConnectionStateChange, true);
            newPeerConnection.addEventListener('signalingstatechange', onSignalingStateChange, true);
            newPeerConnection.addEventListener('track', (event) => onTrack(event, newPeerConnection), true);
        }
    
        await newPeerConnection.setRemoteDescription(offer);
        console.log('set remote sdp OK');
        
        const sessionClientAnswer = await newPeerConnection.createAnswer();
        console.log('create local sdp OK');
        
        await newPeerConnection.setLocalDescription(sessionClientAnswer);
        console.log('set local sdp OK');
        
        console.log(newPeerConnection)
        setPeerConnectionState(newPeerConnection)
        peerConnectionLocal = newPeerConnection
        return sessionClientAnswer;
    }

    function closePC(pc = peerConnectionState, streamId, sessionId) {
        console.log(pc)
        if (!pc) return;
        console.log('stopping peer connection');
        pc.close();
        pc.removeEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
        pc.removeEventListener('icecandidate', (event) => onIceCandidate(streamId, sessionId, event), true);
        pc.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
        pc.removeEventListener('connectionstatechange', onConnectionStateChange, true);
        pc.removeEventListener('signalingstatechange', onSignalingStateChange, true);
        pc.removeEventListener('track', onTrack, true);
        clearInterval(statsIntervalId);
        setStreamIdState(null)
        setSessionIdState(null)
        setStreamingStatus(null)
        iceGatheringState = ''
        signalingState = ''
        iceConnectionState = ''
        connectionState = ''
        // videoRef.current.src = ''
        
        console.log(peerConnectionLocal)
        console.log(pc === peerConnectionState)
        console.log('stopped peer connection');
        if (pc === peerConnectionState) {
            setPeerConnectionState(null);
            peerConnectionLocal = null
        }
    }

    const getElevenlabsCredits = async (controller) => {
        const result = await useFetch('GET', `${LOCAL}/api/voice/elevenlabs/credits`,{controller})
        console.log(result)
        setElevenlabsCredits(result.remaining)
    }

    const contextValue = useMemo(() => ({
        peerConnection: peerConnectionState,
        startStream,
        talkToStream,
        destroyStream,
        videoRef,
        iceGatheringState,
        iceConnectionState,
        connectionState,
        signalingState,
        streamingStatus,
        avatarCredits,
        elevenlabsCredits,
        getAvatarCredits,
        stopAllStreams,
        closePC,
        loading,
        error
    }), [peerConnectionState, streamingStatus, avatarCredits, elevenlabsCredits, loading, error])

  return (
    <StreamContext.Provider value={contextValue} >
        {children}
    </StreamContext.Provider>
  )
}