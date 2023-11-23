import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import toast, { Toaster } from 'react-hot-toast'
import useFetch from '../hooks/useFetch';

const LOCAL = import.meta.env.VITE_LOCAL_URL
const notify = () => toast.success('Bestellung abgeschlossen!');

export default function Cart({ cartItems, checkout, revalidator }) {
  const [goCheckout, setGoCheckout] = useState(checkout)
  // const revalidator = useRevalidator()

  console.log(cartItems)
  console.log(cartItems.length && 'test')
    console.log(checkout)
  useEffect(() => {
    setGoCheckout(checkout)
  }, [checkout])

  const total = getTotal(cartItems)

  async function orderSuccessfull() {
    const response = await useFetch('DELETE', LOCAL + '/api/cart/delete')
    console.log(response)
    // getCartItems()
    setGoCheckout(false)
    revalidator.revalidate()
    // fetcher.load('/chat')
    notify()
  }

  async function startCheckout() {
    const response = await useFetch('POST', LOCAL + '/api/cart/checkout', {body: JSON.stringify({
      status: true
    })})
    console.log(response)
    setGoCheckout(true)
  }
  
  async function cancelCheckout() {
    const response = await useFetch('POST', LOCAL + '/api/cart/checkout', {body: JSON.stringify({
      status: false
    })})
    console.log(response)
    setGoCheckout(false)
  }

  return (
    <motion.div layout layoutRoot key={'cartIn'} variants={dropIn} transition={transition} initial={'hidden'} animate={'visible'} exit={'exit'} className={`fixed right-0 top-0 grid justify-center h-screen min-w-[15rem] ${goCheckout ? 'w-screen bg-slate-900 bg-opacity-95' : 'w-60 2xl:w-80'} p-4 items-center`}>
        <motion.div layout="position" className={`flex flex-col gap-4 rounded-xl bg-slate-100 min-h-[30dvh] max-h-[80dvh] text-slate-900 font-semibold p-4 ${goCheckout ? 'w-[50vw]' : 'w-full'}`}>
            <motion.h2 layout="position" className='text-2xl text-center uppercase'>Warenkorb</motion.h2>
            <motion.div layout className='flex flex-col gap-2 h-fit min-h-32 my-8 mx-auto'>
                {cartItems?.length > 0 &&
                cartItems.map((item, index) => (
                  <div key={index} className='flex gap-2 items-center justify-between animate-slideIn border-2 rounded-3xl p-2 px-4 bg-slate-100'>
                    <div className='flex flex-col text-sm'>
                      <span className='w-full'>{item.product}</span>
                      <span className='text-gray-500'>{item.details}</span>
                    </div>
                    <span className='max-w-[40%] text-right'>{item.price}</span>
                  </div>
                ))
                }
            </motion.div>
            <div className='flex gap-4 justify-center text-xl'>
              <motion.p layout className='uppercase'>Total</motion.p>
              <motion.span layout>{total} CHF</motion.span>
            </div>
            <motion.div layout='position' className='flex flex-col gap-4'>
              <Button onClick={goCheckout ? orderSuccessfull : startCheckout}>
                {goCheckout ? 'Jetzt bezahlen' : 'Einkauf beenden'}
              </Button>
              {goCheckout &&
                <Button noBG onClick={cancelCheckout}>zurück</Button>
              }
            </motion.div>
            <Toaster position='bottom-center' />
        </motion.div>
    </motion.div>
  )
}

function getNumber(string) {
  console.log(isNaN(string))
  const flaotingNumberRegex = /^\d+\.?\d+$/
  const oneCharRegex = /[\d.]/
  if (isNaN(string)) {
    const charArray = [...string]
    const onlyNumArray = charArray.filter(char => oneCharRegex.test(char))
    const isNumber = parseFloat(onlyNumArray.join(''))  
    return isNumber
  } else {
    return string
  }
}

function getTotal(array) {
  if (!Array.isArray(array)) return
  if (!array.length) return
  let total = 0
  array.forEach(item => total += +getNumber(item.price))
  if (isNaN(total)) return 
  console.log(total)
  return total.toFixed(2)
}

const dropIn = {
  hidden: {
    x: 20,
    // opacity: 0,
  },
  visible: {
    x: 0,
    // opacity: 1,
  },
  exit: {
    x: 20,
    // opacity: 0,
  }
}

const transition = {
  duration: 0.25,
  // ease: easeInOut
} 