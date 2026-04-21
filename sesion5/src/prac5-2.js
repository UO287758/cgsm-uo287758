import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => init(), false);

function init() {
    const overlay = document.getElementById('overlay');
    overlay.remove();

    // Initialize DASH player with manifest URL
    const url = "http://example.com/manifest.mpd"; // Replace with actual DASH manifest URL
    const player = dashjs.MediaPlayer().create();
    const videoElement = document.querySelector("#player");
    player.initialize(videoElement, url, true);
    
    // Wait for video to be ready before starting the animation
    videoElement.addEventListener('loadedmetadata', () => {
        startWebGLRendering(videoElement);
    });
}

function startWebGLRendering(video) {
    if ( WEBGL.isWebGL2Available() ) {
        // WebGL is available
        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer( {antialias: true} );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        // Add lighting
        const light = new THREE.AmbientLight( 0xffffff, 1 );
        scene.add( light );

        const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
        camera.position.set( 0, 0, 300 );

        const image = document.createElement( 'canvas' );
        image.width = 480;  // Video width
        image.height = 204; // Video height
        const imageContext = image.getContext( '2d' );
        imageContext.fillStyle = '#000000';
        imageContext.fillRect( 0, 0, image.width - 1, image.height - 1 );
        const texture = new THREE.Texture( image );

        const material = new THREE.MeshBasicMaterial( { map: texture } );
        const wall = new THREE.Mesh( new THREE.PlaneGeometry( image.width, image.height, 4, 4 ), material );
        scene.add( wall );

        window.addEventListener( 'resize', ( ) => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix( );
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.render( scene, camera );
        }, false );
        
        function animate() {
            requestAnimationFrame( animate );
            
            // Update texture from video every frame
            if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
                imageContext.drawImage( video, 0, 0 );
                texture.needsUpdate = true;
            }
            
            wall.rotation.y += 0.01;  
            renderer.render( scene, camera );
        }
        
        animate();
    }
    else {
        console.error( 'WebGL 2 is not available.' );
    }
}