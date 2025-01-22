import PostForm from '@/components/forms/PostForm'
import React from 'react'

function CreatePost() {
  return (
    <div className='w-full flex justify-center py-12 mb-3 px-5 overflow-y-auto custom-scrollbar'>
      <PostForm post={undefined} action='Create'/>
    </div>
  )
}

export default CreatePost
