import React from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
    const error = useRouteError()

    
    if (isRouteErrorResponse(error)) {
      console.log(error)
      return (
        <div className='flex justify-center items-center h-screen bg-slate-800'>
            <div className='border-4 p-8 rounded-lg border-red-600 bg-slate-50 max-w-screen-md'>
                <h1 className='text-2xl font-bold'>Oops.. {error.status}</h1>
                <br/>
                <p>"{error.statusText || error.message}"</p>
                <br/>
                <p>"{error.data?.message}"</p>
                <br/>
                <p>"{process.env.NODE_ENV === 'development' && error.stack}"</p>
            </div>
        </div>
      )
    } else {
      console.log(error)
      return (
        <div className='flex justify-center items-center h-screen bg-slate-800'>
            <div className='border-4 p-8 rounded-lg border-red-600 bg-slate-50 max-w-screen-md'>
                <h1 className='text-2xl font-bold'>Oops.. There was an Error</h1>
                <br/>
                <p>"{error.statusText || error.message}"</p>
                <br/>
                <p>"{process.env.NODE_ENV === 'development' && error.stack}"</p>
            </div>
        </div>
      )
    }
}
