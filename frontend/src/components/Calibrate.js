import React from "react"

export default function Calibrate() {
    return (
        <div>
            <div class="text top-left">Look here first</div>
            <div class="text top-right">Look here second</div>
            <div class="centered-div">Look to the top left (double blink), then top right (double blink), then bottom right (double blink).</div>
            <div class="text bottom-right">Look here third</div>
            <button id="calibrateForReal" class="btn btn-success rounded-pill px-3" type="button">Calibrate</button>
            <a href="play">
                <button id="goToGame" class="btn btn-success rounded-pill px-3" type="button">Click to Play</button>
            </a>
            <img id="decoration1" src="./Decoration1.png"/>
            <img id="decoration2" src="./Decoration1.png"/>
            <img id="decoration3" src="./Decoration1.png"/>
            <img id="decoration4" src="./Decoration1.png"/>
            <img id="decoration5" src="./Decoration2.png"/>
            <img id="decoration6" src="./Decoration2.png"/>
            <img id="decoration7" src="./Decoration2.png"/>
            <img id="decoration8" src="./Decoration2.png"/>
        </div>
    )
}