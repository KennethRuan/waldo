import React from "react"
import waldoCircle from '../waldoCircle.png'
import { percentage } from './Canvas.jsx'

export default function GameOver() {
    return (
        <div class="gameOverPage">
          <img src={waldoCircle} id="waldoCircle"></img>
          <div id="congrats">You found Waldo!</div>
          <div id="stats">{`You looked over ${percentage}% of the board before finding Waldo.`}</div>
        </div>
    )
}