import React from 'react'
import { useState } from 'react'

function ColorDisplay({color}) {
  return (
    <div style={{backgroundColor: color}}>
      <p> Selected Color: {color}</p>
    </div>
  )
}

function ColorPicker() {
  const [color, setColor] = useState('');

  const handleColor = (e) => {
    setColor(e.target.value);
  }
  return (
    <div>
      <h3>Select a Theme Color!</h3>
      <ColorDisplay color={color}/>
      <input type="color" value={color} onChange={handleColor}/>
    </div>
  )
}

export default ColorPicker