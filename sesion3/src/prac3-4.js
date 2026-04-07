import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';
import { materialSheen } from 'three/tsl';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';


if ( WEBGL.isWebGL2Available() ) {
    // WebGL is available
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xf0f0f0, 0.6 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 20, 0 );

    const geometry = new THREE.BoxGeometry( 50, 50, 50 );
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const specialFaceMaterial = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "textures/brick-btn-map.png" )
    } );
    const regularFaceMaterial = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "textures/brick-btn.png" )
    } );      

    // A box has 6 faces
    const materials = [
        specialFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
    ];
    
    const box1 = new THREE.Mesh( geometry, materials );
    box1.position.set(-150, 25, 0);

    const box2 = new THREE.Mesh( geometry, materials );
    box2.position.set(150, 25, 0);

    const stats = new Stats( );
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    document.body.appendChild( stats.dom );

    const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
    helper.position.y = 0.1;

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );
    }, false );

    scene.add( box1 );
    scene.add( box2 );
    scene.add( helper );

    const controls = new FirstPersonControls( camera, renderer.domElement );
    controls.movementSpeed = 70;
    controls.lookSpeed = 0.05;
    controls.noFly = false;
    controls.lookVertical = false;
    const clock = new THREE.Clock( )
    
    
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
        stats.update( );
        const delta = clock.getDelta();
        controls.update( delta );
    }
    
    animate();
}
else {
    console.error( 'WebGL 2 is not available.' );
}