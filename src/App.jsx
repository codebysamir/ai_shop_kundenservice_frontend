import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {

  return (
    <main className='relative bg-gradient-to-tr from-slate-900 from-75% via-indigo-900 to-slate-800 text-white flex box-border'>
      <nav className='sticky bottom-0 top-0 h-screen z-50 w-fit'>
        <Navbar />
      </nav>
      <section className='flex-grow'>
        <Outlet />
      </section>
    </main>
  )
}


export default App
