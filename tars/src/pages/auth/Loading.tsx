import React from 'react'
import { Spinner } from '@/components/ui/spinner'
const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner className='size-6'/>
        Loading
    </div>
  )
}
export default Loading