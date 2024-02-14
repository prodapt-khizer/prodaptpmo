import Sidebar from '@/app/(components)/Sidebar'
import React from 'react'

const Projects = () => {
  return (
    <div className='main_container'>
        <Sidebar currentTab={'projects'}/>
        <div className={`separator-line`} />
        <div className="project_container">Projects</div>
    </div>
  )
}

export default Projects