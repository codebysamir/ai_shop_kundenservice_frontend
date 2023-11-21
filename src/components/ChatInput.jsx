import { FileArrowUp, Function, PaperPlaneRight, XSquare } from '@phosphor-icons/react'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Form, useNavigation, useSubmit } from 'react-router-dom'
import { GridLoader } from 'react-spinners'
import AudioRecorder from './AudioRecorder'
import useSettingsContext from '../hooks/useSettingsContext'

export default forwardRef(function ChatInput({ prompt, setPrompt, chatHistory }, ref) {
    const [file, setFile] = useState(null)
    const [showFunctions, setShowFunctions] = useState(false)
    const [textareaHeight, setTextareaHeight] = useState('h-10')
    const formRef = useRef(null)
    const navigation = useNavigation()
    const submit = useSubmit()
    const { gender, tts, voiceLanguage } = useSettingsContext()


    console.log(chatHistory)
    console.log(ref.current?.value?.length)

    function onSubmit() {
        ref.current.blur()
        setFile(null)
        setShowFunctions(false)
        setTextareaHeight('h-10')
        // formRef.current.reset()
    }

    const onChangeInput = (e) => {
        let Elm = e.target instanceof Node ? e.target : e
        if (e.target instanceof Node) {
            setPrompt(e.target.value)
        }

        console.log(Elm.scrollHeight)
        console.log(Elm.value.length)
        let scrollHeight = heightSwitch(Elm.scrollHeight, Elm.value.length)
        if (Elm.scrollHeight < 256) {
            setTextareaHeight(scrollHeight)
        }
    }

    const handleTextareaKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            console.log('test')
            e.preventDefault();
            submit(formRef.current)
            onSubmit();
        }
    }

    // useEffect(() => {
    //     ref.current?.value = recordedText
    // }, [recordedText])
    

  return (
    <div className='fixed w-full bottom-0 bg-gradient-to-t from-slate-900 from-40% z-10 h-40'>
        <div className={`absolute bottom-5 bg-slate-800 w-full rounded-xl border-4 border-slate-800 ${navigation.state === 'submitting' ? 'opacity-5 pointer-events-none cursor-wait' : ''}`}>
            <Form ref={formRef} className='flex flex-col gap-1' method="POST" encType='multipart/form-data' onSubmit={onSubmit}>
                <fieldset className={`bg-slate-800 p-8 border-b-2 border-dotted ${!showFunctions && 'hidden'}`}>
                    <legend className='pt-4 font-bold uppercase underline'>functions</legend>
                    <div>
                        <input type="checkbox" id='wikipedia-api' name="functions" value="wikipedia-api" />
                        <label className='ml-4' htmlFor="wikipedia-api">Wikipedia Query</label>
                    </div>
                    <div>
                        <input type="checkbox" id='search' name="functions" value="search" />
                        <label className='ml-4' htmlFor="search">Search Query</label>
                    </div>
                    <div>
                        <input type="checkbox" id='web-browser' name="functions" value="web-browser" />
                        <label className='ml-4' htmlFor="web-browser">Webbrowser</label>
                    </div>
                    <div>
                        <input type="checkbox" id='askPinecone' name="functions" value="askPinecone" />
                        <label className='ml-4' htmlFor="askPinecone">Pinecone VectorDB query</label>
                    </div>
                    <div>
                        <input type="checkbox" id='fetchCryptoPrice' name="functions" value="fetchCryptoPrice" />
                        <label className='ml-4' htmlFor="fetchCryptoPrice">Fetch latest Crypto Price</label>
                    </div>
                    <div>
                        <input type="checkbox" id='checkSwisscomCustomer' name="functions" value="checkSwisscomCustomer" defaultChecked="true" />
                        <label className='ml-4' htmlFor="checkSwisscomCustomer">Check customer data</label>
                    </div>
                    <div>
                        <input type="checkbox" id='checkSwisscomProducts' name="functions" value="checkSwisscomProducts" defaultChecked="true" />
                        <label className='ml-4' htmlFor="checkSwisscomProducts">Check products</label>
                    </div>
                    <div>
                        <input type="checkbox" id='checkSwisscomSmartphones' name="functions" value="checkSwisscomSmartphones" defaultChecked="true" />
                        <label className='ml-4' htmlFor="checkSwisscomSmartphones">Check smartphones</label>
                    </div>
                    <div>
                        <input type="checkbox" id='submitCustomerCheckoutPhysicalProduct' name="functions" value="submitCustomerCheckoutPhysicalProduct" defaultChecked="true" />
                        <label className='ml-4' htmlFor="submitCustomerCheckoutPhysicalProduct">Submit Customer Checkout for Physical Product</label>
                    </div>
                    <div>
                        <input type="checkbox" id='submitCustomerCheckoutDigitalProduct' name="functions" value="submitCustomerCheckoutDigitalProduct" defaultChecked="true" />
                        <label className='ml-4' htmlFor="submitCustomerCheckoutDigitalProduct">Submit Customer Checkout for Digital Product</label>
                    </div>
                    <div>
                        <input type="checkbox" id='addProductToCart' name="functions" value="addProductToCart" defaultChecked="true" />
                        <label className='ml-4' htmlFor="addProductToCart">Add Product To Cart</label>
                    </div>
                    <div>
                        <input type="checkbox" id='removeProductFromCart' name="functions" value="removeProductFromCart" defaultChecked="true" />
                        <label className='ml-4' htmlFor="removeProductFromCart">Remove Products From Cart</label>
                    </div>
                    <div>
                        <input type="checkbox" id='checkCartProducts' name="functions" value="checkCartProducts" defaultChecked="true" />
                        <label className='ml-4' htmlFor="checkCartProducts">Check Cart Products</label>
                    </div>
                    <button className='mt-4 italic font-semibold hover:bg-slate-50 hover:text-black border-2 border-slate-50 p-1 px-2 rounded-2xl transition-colors' type='button' onClick={() => setShowFunctions(false)}>Save</button>
                </fieldset>
                <div className='flex gap-1'>
                    <input aria-hidden className='hidden' name='tts' value={tts} readOnly />
                    <input aria-hidden className='hidden' name='language' value={voiceLanguage} readOnly />
                    <input aria-hidden className='hidden' name='gender' value={gender} readOnly />
                    <input aria-hidden className='hidden' name='chatHistory' value={JSON.stringify(chatHistory)} readOnly />
                    <textarea className={`bg-slate-800 flex-grow p-2 rounded-xl focus:bg-slate-600 outline-none scrollbar-w resize-none whitespace-pre-line min-h-[40px] ${textareaHeight}`} type="text" ref={ref} placeholder='Starte ein Gespräch. . .' name="prompt" id="prompt" value={prompt} onChange={onChangeInput} onKeyDown={handleTextareaKeyPress} />
                    <div className='grid items-end'>
                        <div className='flex gap-2 p-2 justify-center items-center bg-slate-50 text-black font-semibold rounded-xl'>
                            <AudioRecorder setPrompt={setPrompt} onChangeInput={onChangeInput} textareaRef={ref.current} />
                            <button title='Functions' type='button' className='cursor-pointer' onClick={() => setShowFunctions(prevState => !prevState)}>
                                <Function size={24} color="#30ac20" weight="bold" />
                            </button>
                            <label title='Upload File' className='cursor-pointer' htmlFor="fileUpload">
                                <FileArrowUp size={24} color="#217416" weight="bold" />
                            </label>
                            <input className='hidden' type="file" name="fileUpload" id="fileUpload" onChange={(e) => {
                                console.log(e.target.files)
                                setFile(e.target.files)
                                }}
                            onClick={(e) => e.target.value = null}    
                            />
                            <button disabled={!file && !prompt} title='Send' type="submit">
                                <PaperPlaneRight size={24} color={!prompt && !file ? "#c2c3c4" : "#161c74"} weight="bold" className={!prompt && !file ? "cursor-not-allowed" : ""} />
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
            {file && 
                <div className='flex relative p-2 w-fit h-24 justify-center items-center font-semibold'>
                    <div className='flex items-center bg-slate-50 h-full text-black p-2 rounded-s-lg max-w-[180px] break-words justify-center'>{file[0]?.name.split('.')[0]}</div>
                    <div className='flex items-center bg-green-800 p-2 rounded-e-lg h-full'>{'.' + file[0]?.name.split('.')[1]}</div>
                    <div className='absolute top-0 right-0 cursor-pointer' onClick={() => {setFile(null);formRef.current.reset()}}>
                        <XSquare size={24} weight="duotone" />
                    </div>
                </div>
            }
        </div>
        {navigation.state === 'submitting' &&
            <div className='absolute bottom-14 left-1/2'>
                <GridLoader
                color="#fed7aa"
                loading
                margin={6}
                size={8}
                speedMultiplier={1.5}
              />
            </div>
        }
    </div>
  )
})

const heightSwitch = (height, inputLength) => {
    let textareaHeight
    switch (true) {
        case (height === 40 || inputLength <= 98):
            textareaHeight = 'h-[40px]'
            break;
        case (height === 64 || inputLength <= 196):
            textareaHeight = 'h-[64px]'
            break;
        case (height === 88 || inputLength <= 294):
            textareaHeight = 'h-[88px]'
            break;
        case (height === 112 || inputLength <= 392):
            textareaHeight = 'h-[112px]'
            break;
        case (height === 136 || inputLength <= 490):
            textareaHeight = 'h-[136px]'
            break;
        case (height === 160 || inputLength <= 588):
            textareaHeight = 'h-[160px]'
            break;
        case (height === 184 || inputLength <= 686):
            textareaHeight = 'h-[184px]'
            break;
        case (height === 208 || inputLength <= 784):
            textareaHeight = 'h-[208px]'
            break;
        case (height === 232 || inputLength <= 882):
            textareaHeight = 'h-[232px]'
            break;
        case (height === 256 && inputLength <= 980):
            textareaHeight = 'h-[256px]'
            break;
    
        default:
            break;
    }
    return textareaHeight
}