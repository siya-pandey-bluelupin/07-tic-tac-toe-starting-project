import React, { useState } from 'react'

const SelectGame = (onSelectAi,onSelect2Player) => {

   
  return (
    <div id="game-over" style={{gap:50}}>
    <button onClick={onSelectAi()}>Play with AI</button>
    <button onClick={()=>onSelect2Player()}>Play with Player 2</button>
  </div>
  )
}

export default SelectGame