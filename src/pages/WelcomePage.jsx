import React from 'react'

export default function WelcomePage() {
  return (
    <div className='grid place-content-center place-items-center h-screen w-screen bg-slate-900'>
        <div className='flex flex-col gap-4 bg-slate-100 rounded-2xl p-12'>
            <h1 className='text-center text-2xl font-bold'>Swisscom Shop</h1>
            <span className='text-lg mb-10'>Willkommen in unserem Shop, sind Sie bereits Kunde oder Gast?</span>
            <div className='flex gap-4 justify-center'>
                <button className='uppercase rounded-full bg-slate-900 hover:bg-indigo-900 text-slate-50 p-2 px-4 transition-colors' type="button">bereits Kunde</button>
                <button className='uppercase rounded-full bg-slate-900 hover:bg-indigo-900 text-slate-50 p-2 px-4 transition-colors' type="button">als Gast weiter</button>
                <button className='uppercase rounded-full bg-slate-900 hover:bg-indigo-900 text-slate-50 p-2 px-4 transition-colors' type="button">Kunde werden</button>
            </div>
        </div>
    </div>
  )
}
