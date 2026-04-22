import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => init(), false);

function init() {
    const overlay = document.getElementById('overlay');
    overlay.remove();

    // Example DASH manifest URL - Replace with your actual manifest URL
    const url = "http://localhost:60080/trailer.mpd";
    const videoElement = document.querySelector("#player");
    videoElement.style.display = "block";
    
    const player = dashjs.MediaPlayer().create();
    player.initialize(videoElement, url, true);
}