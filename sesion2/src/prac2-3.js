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
    camera.position.set( 0, 0, 300 );
 
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
 
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
           
            // Agregar coordenadas UV (invertidas en V para orientación correcta)
            const u = slice / widthSegments;
            const v = 1.0 - (stack / heightSegments);
            sphereUVs.push(u, v);
        }
    }
     
    // Conectamos los vértices de cada fila con los de la siguiente
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
 
    scene.add( sphere );
   
    const atmosphereGeometry = new THREE.SphereGeometry(105, 32, 16);
    
    const atmosphereUrl = "../textures/atmosphere.png";
    const atmosphereMap = textureLoader.load(atmosphereUrl);
    
    var atmosphereMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: atmosphereMap, transparent: true } );
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.position.set(0, 0, 0);
    
    scene.add(atmosphere);
   
    function animate() {
        requestAnimationFrame(animate);
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
 