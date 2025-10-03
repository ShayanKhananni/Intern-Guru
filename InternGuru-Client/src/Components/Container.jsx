import React from 'react'

const Container = ({children}) => {
  return (
    <>
    <div className='bg-lightGrayBg w-full min-h-screen '>
      {children}
    </div>
    </>
  )
}

export default Container
