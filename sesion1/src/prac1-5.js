import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';

if ( WEBGL.isWebGL2Available() ) {
    // WebGL is available
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 500 );

    const boxGeometry = new THREE.BufferGeometry();
    const size = 40;
    const inner = 30;
    const outer = 40;
    
    const boxVertices = new Float32Array( [
        -inner, -inner, inner,   
        inner, -inner, inner,
        inner, inner, inner,    
        -inner, inner, inner,    
        

        -inner, -inner, -inner,  
        -inner, inner, -inner,   
        inner, inner, -inner,   
        inner, -inner, -inner,   
        
        -inner, inner, -inner,  
        -inner, inner, inner,    
        inner, inner, inner,     
        inner, inner, -inner,    
        
        -inner, -inner, -inner, 
        inner, -inner, -inner,   
        inner, -inner, inner,    
        -inner, -inner, inner,   
        
        inner, -inner, -inner,   
        inner, inner, -inner,   
        inner, inner, inner,    
        inner, -inner, inner,   

        -inner, -inner, -inner,  
        -inner, -inner, inner,   
        -inner, inner, inner,    
        -inner, inner, -inner     
    ] );
    
    const boxIndices = [
        0, 1, 2,    0, 2, 3,   
        4, 5, 6,    4, 6, 7,   
        8, 9, 10,   8, 10, 11, 
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19, 
        20, 21, 22, 20, 22, 23 
    ];
    
    boxGeometry.setIndex( boxIndices );
    boxGeometry.setAttribute( 'position', new THREE.BufferAttribute( boxVertices, 3 ) );
    boxGeometry.computeVertexNormals();
    
    const boxMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
    const box = new THREE.Mesh( boxGeometry, boxMaterial );
    box.position.set( -120, 0, 0 );
    box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );

    const cylinderGeometry = new THREE.BufferGeometry();
    const radius = 40;
    const height = 100;
    const segments = 32;
    
    const cylinderVertices = [];
    const cylinderIndices = [];
    
    cylinderVertices.push( 0, height / 2, 0 );
    cylinderVertices.push( 0, -height / 2, 0 );
    
    for ( let i = 0; i <= segments; i++ ) {
        const theta = ( i / segments ) * Math.PI * 2;
        const x = radius * Math.cos( theta );
        const z = radius * Math.sin( theta );
        
        cylinderVertices.push( x, height / 2, z );
        cylinderVertices.push( x, -height / 2, z );
    }
    
    for ( let i = 0; i < segments; i++ ) {
        cylinderIndices.push( 0, 2 + i * 2, 2 + ( i + 1 ) * 2 );
    }
    
    for ( let i = 0; i < segments; i++ ) {
        cylinderIndices.push( 1, 3 + ( i + 1 ) * 2, 3 + i * 2 );
    }
    
    for ( let i = 0; i < segments; i++ ) {
        const topCurrent = 2 + i * 2;
        const bottomCurrent = 3 + i * 2;
        const topNext = 2 + ( i + 1 ) * 2;
        const bottomNext = 3 + ( i + 1 ) * 2;
        
        cylinderIndices.push( topCurrent, bottomCurrent, topNext );
        cylinderIndices.push( bottomCurrent, bottomNext, topNext );
    }
    
    cylinderGeometry.setIndex( cylinderIndices );
    cylinderGeometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( cylinderVertices ), 3 ) );
    cylinderGeometry.computeVertexNormals();
    
    const cylinderMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } ); 
    const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
    cylinder.position.set( 0, 0, 0 );
    cylinder.rotation.set( Math.PI / 5, 0, 0 );

    const sphereGeometry = new THREE.BufferGeometry();
    const sphereRadius = 50;
    const widthSegments = 32;
    const heightSegments = 16;
    
    const sphereVertices = [];
    const sphereIndices = [];
    
    for ( let lat = 0; lat <= heightSegments; lat++ ) {
        const theta = lat * Math.PI / heightSegments;
        const sinTheta = Math.sin( theta );
        const cosTheta = Math.cos( theta );
        
        for ( let lon = 0; lon <= widthSegments; lon++ ) {
            const phi = lon * 2 * Math.PI / widthSegments;
            const sinPhi = Math.sin( phi );
            const cosPhi = Math.cos( phi );
            
            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;
            
            sphereVertices.push( sphereRadius * x, sphereRadius * y, sphereRadius * z );
        }
    }
    
    for ( let lat = 0; lat < heightSegments; lat++ ) {
        for ( let lon = 0; lon < widthSegments; lon++ ) {
            const first = lat * ( widthSegments + 1 ) + lon;
            const second = first + widthSegments + 1;
            
            sphereIndices.push( first, second, first + 1 );
            sphereIndices.push( second, second + 1, first + 1 );
        }
    }
    
    sphereGeometry.setIndex( sphereIndices );
    sphereGeometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( sphereVertices ), 3 ) );
    sphereGeometry.computeVertexNormals();
    
    const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphere.position.set( 120, 0, 0 );

    const houseGeometry = new THREE.BufferGeometry();
    const houseSize = 40;
    
    const houseVertices = new Float32Array( [
        -houseSize, -houseSize, 0,        
        houseSize, -houseSize, 0,         
        houseSize, houseSize * 0.5, 0,    
        -houseSize, houseSize * 0.5, 0,   
        
        0, houseSize * 1.5, 0             
    ] );
    
    const houseIndices = [
        0, 1, 2,    
        0, 2, 3,    
        
        3, 2, 4 
    ];
    
    houseGeometry.setIndex( houseIndices );
    houseGeometry.setAttribute( 'position', new THREE.BufferAttribute( houseVertices, 3 ) );
    houseGeometry.computeVertexNormals();
    
    const houseMaterial = new THREE.MeshBasicMaterial( { 
        color: 0xffff00,
        side: THREE.DoubleSide 
    } ); 
    const house = new THREE.Mesh( houseGeometry, houseMaterial );
    house.position.set( 240, 0, 0 );

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );
    }, false );

    scene.add( box );
    scene.add( cylinder );
    scene.add( sphere );
    scene.add( house );
    renderer.render( scene, camera );
}
else {
    console.error( 'WebGL 2 is not available.' );
}