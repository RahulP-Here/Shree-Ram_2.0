import React from 'react'

const Navbar = ({ showModal, setLastToken }) => {
 

  const addCustomer = () => {
    showModal(true);
  }

  return (
    <>
      <header className='py-3 text-text flex justify-between items-center px-8 overflow-hidden border-b border-b-highlight'>
        <div className="logo h-[50px] flex gap-4 items-center">
          <img className="h-full" src="/images/logo.png" alt="shree ram" />
          <h1 className='font-extrabold text-[1.8rem]'>Shree Ram</h1>
        </div>
        <nav>
          <div className='flex gap-4'>
          <button className='py-2 px-6 rounded-lg font-semibold bg-primary text-white pop-effect-button' onClick={addCustomer}>ADD</button>
          <button className='py-2 px-6 rounded-lg font-semibold bg-red-600 text-white pop-effect-button' onClick={()=>{setLastToken(1)}}>Reset</button>
          
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar
