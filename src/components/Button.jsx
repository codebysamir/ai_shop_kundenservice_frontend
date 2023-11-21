import { motion } from 'framer-motion'

export default function Button({onClick, noBG, children}) {
    // const { onClick } = props

  return (
    <motion.button type="button" className={`${noBG ? 'hover:text-slate-100' : 'bg-slate-500 text-slate-100'} hover:bg-slate-900 rounded-full p-2 px-4 transition-all duration-300 mx-auto`} onClick={onClick ?? null}>
        {children}
    </motion.button>
  )
}
