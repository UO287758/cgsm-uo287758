import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 
if ( WEBGL.isWebGL2Available() ) {
    // WebGL is available
    console.log("WebGL 2 is available.");
 
    const scene = new THREE.Scene();
 
    const pointLight = new THREE.PointLight(0xffffff, 100000, 5000);
    pointLight.position.set(100, 0, 150);
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
    scene.add(pointLightHelper);

    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 600 );
 
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
 
    const clock = new THREE.Clock( );
 
    const sphereGeometry = new THREE.BufferGeometry();
    const sphereRadius = 100;
    const widthSegments = 32;
    const heightSegments = 16;
       
    const sphereVertices = [];
    const sphereIndices = [];
    const sphereUVs = [];
       
    for (let stack = 0; stack <= heightSegments; stack++) {
        const phi = stack * Math.PI / heightSegments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
   
        for (let slice = 0; slice <= widthSegments; slice++) {
            const theta = slice * 2 * Math.PI / widthSegments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
     
            sphereVertices.push(sphereRadius * sinPhi * cosTheta, sphereRadius * cosPhi, sphereRadius * sinPhi * sinTheta);
           
            const u = slice / widthSegments;
            const v = 1.0 - (stack / heightSegments);
            sphereUVs.push(u, v);
        }
    }
     

    for (let stack = 0; stack < heightSegments; stack++){
        for (let slice = 0; slice < widthSegments; slice++){
            const a = stack * (widthSegments + 1) + slice;
            const b = a + widthSegments + 1;
     
            sphereIndices.push(a, b, a + 1);
            sphereIndices.push(b, b + 1, a + 1);
        }
    }
       
    sphereGeometry.setIndex(sphereIndices);
    sphereGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(sphereVertices), 3));
    sphereGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(sphereUVs), 2));
    sphereGeometry.computeVertexNormals();
       
    const mapUrl = "../textures/earth.png";   // The file used as texture
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const map = textureLoader.load( mapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
    const sphereMaterial = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide, shininess: 80 } );
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    sphere.rotation.z = 0.36;
   
    const atmosphereGeometry = new THREE.SphereGeometry(105, 32, 16);
    
    const atmosphereUrl = "../textures/atmosphere.png";
    const atmosphereMap = textureLoader.load(atmosphereUrl);
    
    const atmosphereMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: atmosphereMap, transparent: true } );
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.position.set(0, 0, 0);
    atmosphere.rotation.z = 0.36;
    
    const earthGroup = new THREE.Object3D();
    
    earthGroup.add(sphere);
    earthGroup.add(atmosphere);

    scene.add(earthGroup);
   
    const moonRadius = sphereRadius * 0.27; 
    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 16);
    
    const moonMapUrl = "../textures/moon.png";
    const moonMap = textureLoader.load( moonMapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
    const moonMaterial = new THREE.MeshPhongMaterial( { map: moonMap, color: 0xffffff, shininess: 5 } );
    
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    
    const distance = 350;
    
    moon.position.set( distance, 0, 0 );
    
    moon.rotation.y = Math.PI;
    
    const moonGroup = new THREE.Object3D( );
    moonGroup.add( moon );
    
    moonGroup.rotation.z = 0.089;
    
    scene.add(moonGroup);
    
    let moonOrbitAngle = 0;
   
    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta( ); 
        
        const rotation = ( delta * Math.PI * 2 ) / 1;
        earthGroup.rotation.y += rotation;
        atmosphere.rotation.y += rotation * 0.95;
        
        const lunarOrbit = ( delta * Math.PI * 2 ) / 28; 
        moonOrbitAngle += lunarOrbit;
        
        moon.position.x = distance * Math.cos(moonOrbitAngle);
        moon.position.z = distance * Math.sin(moonOrbitAngle);
        
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
 
    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );
}
 