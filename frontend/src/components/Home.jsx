import React from "react"

export default function Home() {
    return (
        <div>
            <img id="welcome-waldo" src="./wheres-waldo-costume.webp" />
            <br></br>
            <a href="calibrate">
                <button id="calibrate" class="btn btn-success rounded-pill px-3" type="button">Click to Calibrate</button>
            </a>
            <img id="decoration1" src="./Decoration1.png"/>
            <img id="decoration2" src="./Decoration1.png"/>
            <img id="decoration3" src="./Decoration1.png"/>
            <img id="decoration4" src="./Decoration1.png"/>
            <img id="decoration5" src="./Decoration2.png"/>
            <img id="decoration6" src="./Decoration2.png"/>
            <img id="decoration7" src="./Decoration2.png"/>
        </div>
    )
}