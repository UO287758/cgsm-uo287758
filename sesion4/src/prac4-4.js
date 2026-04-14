import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
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

    const listener = new THREE.AudioListener();
    camera.add( listener );

    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedObject = null;

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
    const activeFaceMaterial = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "textures/brick-btn-active.png" )
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
    box1.name = 'box1';

    const box2 = new THREE.Mesh( geometry, materials );
    box2.position.set(150, 25, 0);
    box2.name = 'box2';

    // Audio setup
    const audioLoader = new THREE.AudioLoader();
    
    // Audio para box1
    const sound1 = new THREE.PositionalAudio( listener );
    audioLoader.load( "audio/audio1.ogg", ( buffer ) => {
        sound1.setBuffer( buffer );
        sound1.setRefDistance( 20 );
        sound1.setLoop( true );
        sound1.setRolloffFactor( 1 );
        //sound1.play(); // Modern browsers do not allow sound to start without user interaction
    });
    box1.add( sound1 );

    // Audio para box2
    const sound2 = new THREE.PositionalAudio( listener );
    audioLoader.load( "audio/audio2.ogg", ( buffer ) => {
        sound2.setBuffer( buffer );
        sound2.setRefDistance( 20 );
        sound2.setLoop( true );
        sound2.setRolloffFactor( 1 );
        //sound2.play(); // Modern browsers do not allow sound to start without user interaction
    });
    box2.add( sound2 );

    // Mapeo de cajas a sonidos
    const boxSoundMap = {
        'box1': { mesh: box1, sound: sound1, isPlaying: false },
        'box2': { mesh: box2, sound: sound2, isPlaying: false }
    };

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
    const clock = new THREE.Clock( );

    const distance = 20; // Maximum distance of a collision
    
    // Track keyboard state for collision detection in multiple directions
    const keys = {};
    window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });
    window.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    document.body.addEventListener( 'mousemove', ( event ) => {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, false );


    document.body.addEventListener( 'keydown', ( event ) => {
        const spaceKeyCode = "Space";

        if ( event.code == spaceKeyCode && intersectedObject ) {
            const boxData = boxSoundMap[ intersectedObject.name ];
            
            if ( boxData ) {
                const sound = boxData.sound;
                const mesh = boxData.mesh;

                if ( sound.isPlaying === true ) {
                    sound.pause();
                    boxData.isPlaying = false;
                    mesh.material[ 0 ] = regularFaceMaterial;
                    mesh.material.needsUpdate = true;
                } else {
                    sound.play();
                    boxData.isPlaying = true;
                    mesh.material[ 0 ] = activeFaceMaterial;
                    mesh.material.needsUpdate = true;
                }
            }
        }
    }, false );

    
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
        stats.update( );
        const delta = clock.getDelta();
        
        // Update controls first
        controls.update( delta );
        
        // Collision detection - check if camera overlaps with objects
        let collision = false;
        
        // Cast rays in multiple directions from camera
        const rayDirections = [
            new THREE.Vector3(0, 0, -1),   // Forward
            new THREE.Vector3(1, 0, -1).normalize(),   // Forward-right
            new THREE.Vector3(-1, 0, -1).normalize(),  // Forward-left
            new THREE.Vector3(1, 0, 0).normalize(),    // Right
            new THREE.Vector3(-1, 0, 0).normalize(),   // Left
        ];
        
        for (const direction of rayDirections) {
            // Transform direction to world space
            const worldDir = direction.clone().applyQuaternion(camera.quaternion);
            
            rayCaster.set(camera.position, worldDir);
            const collisions = rayCaster.intersectObjects(scene.children);
            
            if (collisions.length > 0 && collisions[0].distance < distance) {
                collision = true;
                break;
            }
        }
        
        // If collision detected, revert the movement
        if (collision) {
            controls.update(-delta);
        }

        rayCaster.setFromCamera( mouse, camera );
        const intersects = rayCaster.intersectObjects( scene.children );
        if ( intersects.length > 0 ) {
            // Sorted by Z (close to the camera)
            if ( intersectedObject != intersects[ 0 ].object ) {
                intersectedObject = intersects[ 0 ].object;
                console.log( 'New intersected object: ' + intersectedObject.name );
            }
        } else {
            intersectedObject = null;
        }
    }
    
    animate();
}
else {
    console.error( 'WebGL 2 is not available.' );
}