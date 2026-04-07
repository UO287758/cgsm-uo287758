import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';

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

    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const material = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "textures/brick.png" ),
        bumpMap: textureLoader.load( "textures/brick-map.png" )
    } );
    const box = new THREE.Mesh( geometry, material );

    box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );
    }, false );

    scene.add( box );
    
    function animate() {
        requestAnimationFrame( animate );
        box.rotation.y += 0.01;  
        renderer.render( scene, camera );
    }
    
    animate();
}
else {
    console.error( 'WebGL 2 is not available.' );
}