import React from 'react'
import './styles.css'

const Loading = ({ isLoading = true }) => {

  function renderLoading () {
    return (
      isLoading && (
        <div className="loading-container">
          <div className="loading">
            <div className="circle circle-one"/>
            <div className="circle circle-two"/>
            <div className="circle circle-three"/>
          </div>
        </div>
      )
    )
  }

  return (
    renderLoading()
  )
}

export default Loading