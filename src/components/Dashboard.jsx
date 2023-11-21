import { FileArrowUp, PlusCircle, Upload, XCircle, XSquare } from '@phosphor-icons/react'
import React, { useEffect, useRef, useState } from 'react'
import { Form, useActionData, useNavigation } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { GridLoader } from 'react-spinners'
import toast, { Toaster } from 'react-hot-toast'
import Button from './button'

const LOCAL_URL = import.meta.env.VITE_LOCAL_URL

const notifySuccess = () => toast.success(`Request was successfull!`)
const notifyError = (operation, message) => toast.error(`${operation} Request failed!\n${message}`)

export default function Dashboard() {
    const [createFile, setCreateFile] = useState(null)
    const [updateFile, setUpdateFile] = useState(null)
    const [updateIDsArray, setUpdateIDsArray] = useState([])
    const [deleteIDsArray, setDeleteIDsArray] = useState([])
    const [showResult, setShowResult] = useState(false)
    const formRef = useRef(null)
    const updateIDInputRef = useRef(null)
    const deleteIDInputRef = useRef(null)
    const navigation = useNavigation()
    const result = useActionData()

    console.log(result)

    useEffect(() => {
        console.log('render useEffect')
        if (!result) return
        if (result.output.includes('Error')) {
            notifyError(result.type, result.error)
        } else {
            notifySuccess()
            // setShowResult(true)
            const inputElements = Array.from(formRef.current.elements).filter(
                (element) => element.tagName === 'INPUT'
            );
            console.log(inputElements)
            inputElements.forEach((input) => {
                console.log(input.value)
                input.value = '';
            });
            // setCreateFile(null)
            // setUpdateFile(null)
        }

        // return () => setShowResult(false)
    }, [result])

    function onSubmit() {
        formRef.current.blur()
        setCreateFile(null)
        setUpdateFile(null)
        // setShowResult(false)
        setUpdateIDsArray([])
        setDeleteIDsArray([])
    }

    function addUpdateID() {
        const idToAdd = updateIDInputRef.current.value
        if (!idToAdd) return
        setUpdateIDsArray(prevIDs => [...prevIDs, idToAdd])
        updateIDInputRef.current.value = ''
    }
    function addDeleteID() {
        const idToAdd = deleteIDInputRef.current.value
        if (!idToAdd) return
        setDeleteIDsArray(prevIDs => [...prevIDs, idToAdd])
        deleteIDInputRef.current.value = ''
    }

    async function handleCreateTalk() {
        await useFetch('POST', import.meta.env.VITE_LOCAL_URL + '/api/avatar/createTalk') 
    }
    async function handleGetTalk() {
        await useFetch('GET', import.meta.env.VITE_LOCAL_URL + '/api/avatar/getTalk') 
    }

  return (
    <section>
        <div className='flex flex-wrap gap-12 p-8'>
            <Form ref={formRef} className='flex flex-col gap-4 p-8 w-fit max-w-screen-md items-start border-r-2' method="POST" encType='multipart/form-data' onSubmit={onSubmit} >
                <h2 className='uppercase font-bold text-2xl mb-4'>Create Vector</h2>
                <label className='text-slate-300' htmlFor="indexName">Index Name for Vector DB</label>
                <input type="text" name='indexName' className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-fit' />
                <label className='text-slate-300' htmlFor="category">Category Name for Vector File MetaData</label>
                <input type="text" name='category' className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-fit' />
                <label className='text-slate-300' title='Select File' htmlFor="createFileUpload">
                    Select file
                    <FileArrowUp size={48} color="#217416" weight="light" className='cursor-pointer mt-2' />
                </label>
                <input className='hidden' type="file" name="fileUpload" id="createFileUpload" onChange={(e) => {
                    console.log(e.target.files)
                    setCreateFile(e.target.files)
                    }} onClick={(e) => e.target.value = null}  />
                {createFile && 
                    <div className='flex relative p-2 w-fit h-24 justify-center items-center font-semibold'>
                        <div className='flex items-center bg-slate-50 h-full text-black p-2 rounded-s-lg max-w-[180px] break-words justify-center'>{createFile[0]?.name.split('.')[0]}</div>
                        <div className='flex items-center bg-green-800 p-2 rounded-e-lg h-full'>{'.' + createFile[0]?.name.split('.')[1]}</div>
                        <div className='absolute top-0 right-0 cursor-pointer' onClick={() => {setCreateFile(null);formRef.current.reset()}}>
                            <XSquare size={24} weight="duotone" />
                        </div>
                    </div>
                }
                {navigation.state === 'submitting' ?
                <div>
                    <GridLoader
                    color="#fed7aa"
                    loading
                    margin={6}
                    size={8}
                    speedMultiplier={1.5}
                />
                </div>
                :
                <button name='usecase' value='create' type="submit" className='flex  gap-2 items-center mt-8 p-2 rounded-md bg-primary-900 hover:bg-primary-500 uppercase'><Upload size={32} color="#f8f8f8" weight="duotone" />Create</button>
                }
            </Form>
            <Form ref={formRef} className='flex flex-col gap-4 p-8 w-fit max-w-screen-md items-start border-r-2' method="POST" encType='multipart/form-data' onSubmit={onSubmit} >
                <h2 className='uppercase font-bold text-2xl mb-4'>Update Vector</h2>
                <label className='text-slate-300' htmlFor="indexName">Index Name for Vector DB</label>
                <input type="text" name='indexName' className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-fit' />
                <div className='flex flex-col gap-4'>
                    <label className='text-slate-300' htmlFor="idsToReplace">IDs to replace</label>
                    {updateIDsArray.map(id => (
                        <div key={id} className='flex gap-4 items-center'>
                            <input type="text" id={id} name='idsToReplace' className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-80 cursor-not-allowed' value={id} readOnly />
                            <XCircle size={32} color='red' onClick={() => setUpdateIDsArray(updateIDsArray.filter(i => i !== id))} className='cursor-pointer' />
                        </div>
                    ))
                    }
                    <div className='flex gap-4 items-center'>
                        <input ref={updateIDInputRef} type="text" className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-80' placeholder='Add ID to replace' />
                        <PlusCircle size={32} onClick={addUpdateID} className='cursor-pointer text-primary-500' />
                    </div>
                </div>
                <label className='text-slate-300' htmlFor="vectorCategory">Category Name for Vector File MetaData</label>
                <input type="text" name='vectorCategory' className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-fit' />
                <label className='text-slate-300' title='Select File' htmlFor="updateFileUpload">
                    Select file
                    <FileArrowUp size={48} color="#217416" weight="light" className='cursor-pointer mt-2' />
                </label>
                <input className='hidden' type="file" name="fileUpload" id="updateFileUpload" onChange={(e) => {
                    console.log(e.target.files)
                    setUpdateFile(e.target.files)
                    }} onClick={(e) => e.target.value = null}  />
                {updateFile && 
                    <div className='flex relative p-2 w-fit h-24 justify-center items-center font-semibold'>
                        <div className='flex items-center bg-slate-50 h-full text-black p-2 rounded-s-lg max-w-[180px] break-words justify-center'>{updateFile[0]?.name.split('.')[0]}</div>
                        <div className='flex items-center bg-green-800 p-2 rounded-e-lg h-full'>{'.' + updateFile[0]?.name.split('.')[1]}</div>
                        <div className='absolute top-0 right-0 cursor-pointer' onClick={() => {setUpdateFile(null);formRef.current.reset()}}>
                            <XSquare size={24} weight="duotone" />
                        </div>
                    </div>
                }
                {navigation.state === 'submitting' ?
                <div>
                    <GridLoader
                    color="#fed7aa"
                    loading
                    margin={6}
                    size={8}
                    speedMultiplier={1.5}
                />
                </div>
                :
                <button name='usecase' value='update' type="submit" className='flex  gap-2 items-center mt-8 p-2 rounded-md bg-primary-900 hover:bg-primary-500 uppercase'><Upload size={32} color="#f8f8f8" weight="duotone" />Update</button>
                }
            </Form>
            <Form ref={formRef} className='flex flex-col gap-4 p-8 w-fit max-w-screen-md items-start border-r-2' method="POST" encType='application/x-www-form-urlencoded' onSubmit={onSubmit} >
                <h2 className='uppercase font-bold text-2xl mb-4'>Delete Vector</h2>
                <label className='text-slate-300' htmlFor="indexName">Index Name for Vector DB</label>
                <input type="text" name='indexName' className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-fit' />
                <div className='flex flex-col gap-4'>
                    <label className='text-slate-300' htmlFor="idsToDelete">IDs to delete</label>
                    {deleteIDsArray.map(id => (
                        <div key={id} className='flex gap-4 items-center'>
                            <input type="text" id={id} name='idsToDelete' className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-80 cursor-not-allowed' value={id} readOnly />
                            <XCircle size={32} color='red' onClick={() => setDeleteIDsArray(deleteIDsArray.filter(i => i !== id))} className='cursor-pointer' />
                        </div>
                    ))
                    }
                    <div className='flex gap-4 items-center'>
                        <input ref={deleteIDInputRef} type="text" className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-80' placeholder='Add ID to delete' />
                        <PlusCircle size={32} onClick={addDeleteID} className='cursor-pointer text-primary-500' />
                    </div>
                </div>
                <label className='text-slate-300' htmlFor="category">Category Name for Vector File MetaData</label>
                <input type="text" name='category' className='p-2 outline-none text-base bg-slate-700 text-white rounded-md w-fit' />
                {navigation.state === 'submitting' ?
                <div>
                    <GridLoader
                    color="#fed7aa"
                    loading
                    margin={6}
                    size={8}
                    speedMultiplier={1.5}
                />
                </div>
                :
                <button name='usecase' value='delete' type="submit" className='flex  gap-2 items-center mt-8 p-2 rounded-md bg-primary-900 hover:bg-primary-500 uppercase'><Upload size={32} color="#f8f8f8" weight="duotone" />Delete</button>
                }
            </Form>
            <div className='flex flex-col justify-center gap-4'>
                <Button onClick={handleCreateTalk}>Create Talk Video</Button>
                <Button onClick={handleGetTalk}>Get Talk Video</Button>
            </div>
        </div>
        {/* {showResult &&
            <div className='flex flex-col gap-4 p-16 justify-center items-center text-2xl'>
                    <span>{result?.output || result?.message}</span>
                    <button className='bg-primary-900 hover:bg-primary-500 p-4 rounded-md' onClick={() => setShowResult(false)}>OK</button>
            </div>
        } */}
        <Toaster position='bottom-center' toastOptions={{duration: ''}} />
    </section>
  )
}

export const action = async ({ request, params }) => {
    const formData = await request.formData()
    const useCase = formData.get('usecase')

    if (useCase === 'create') {
        const response = await useFetch('POST', LOCAL_URL + '/api/database/create', {body: formData})
        console.log(response)
        return response
    }
    if (useCase === 'update') {
        const response = await useFetch('POST', LOCAL_URL + '/api/database/update', {body: formData})
        console.log(response)
        return response
    }
    if (useCase === 'delete') {
        const response = await useFetch('POST', LOCAL_URL + '/api/database/delete', {body: formData})
        console.log(formData.get('idsToDelete'))
        console.log(response)
        return response
    }
}
