import React from 'react'
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import Button from '../components/Button'

export default function ErrorPage() {
    const error = useRouteError()

    
    if (isRouteErrorResponse(error)) {
      console.log(error)
      return (
        <div className='flex justify-center items-center h-screen bg-slate-800'>
            <div className='flex flex-col gap-6 border-4 p-8 rounded-lg border-red-600 bg-slate-50 max-w-screen-md'>
                <h1 className='text-3xl font-bold'>Oops.. {error.status} - {error.statusText}</h1>
                {error.message &&
                  <p className='font-semibold'>"{error.message}"</p>
                }
                {error.data &&
                  <p className='font-semibold'>"{error.data?.message || error.data}"</p>
                }
                {process.env.NODE_ENV === 'development' && 
                  <p className='font-semibold text-gray-500'>"{error.error?.stack}"</p>
                }
                <div>
                  <Link to={'/'}>
                    <Button>Back to Startpage</Button>
                  </Link>
                </div>
            </div>
        </div>
      )
    } else {
      console.log(error)
      return (
        <div className='flex justify-center items-center h-screen bg-slate-800'>
            <div className='flex flex-col gap-6 border-4 p-8 rounded-lg border-red-600 bg-slate-50 max-w-screen-md'>
                <h1 className='text-2xl font-bold'>Oops.. There was an Error</h1>
                <p>"{error.statusText || error.message}"</p>
                <p>"{process.env.NODE_ENV === 'development' && error.stack}"</p>
                <div>
                  <Link to={'/'}>
                    <Button>Back to Startpage</Button>
                  </Link>
                </div>
            </div>
        </div>
      )
    }
}
