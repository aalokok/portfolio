import * as THREE from 'three';

/**
 * Creates a procedural environment map for metallic reflections
 * @param isDarkMode Whether the app is in dark mode
 * @returns A cube texture that can be used as an environment map
 */
export function createEnvironmentMap(isDarkMode: boolean): THREE.CubeTexture {
  // Create a procedural environment map with gradients
  const size = 256;
  
  const getPixel = (face: number, u: number, v: number): [number, number, number] => {
    // Normalize u,v to -1 to 1
    const nx = u * 2 - 1;
    const ny = v * 2 - 1;
    let r = 0, g = 0, b = 0;
    
    if (isDarkMode) {
      // Dark mode - cool blue-purple gradients for top/bottom, dark surroundings
      switch (face) {
        case 0: // px - right
          r = 16 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 20;
          g = 16 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 20;
          b = 24 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 20;
          break;
        case 1: // nx - left
          r = 16 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 20;
          g = 16 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 20;
          b = 24 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 20;
          break;
        case 2: // py - top
          // Brighter area to simulate light source
          const distTop = Math.sqrt(nx*nx + (ny-0.3)*(ny-0.3));
          const brightnessTop = Math.pow(Math.max(0, 1 - distTop * 1.5), 3);
          r = 40 + brightnessTop * 215;
          g = 40 + brightnessTop * 215;
          b = 60 + brightnessTop * 195;
          break;
        case 3: // ny - bottom
          r = 10 + Math.abs(nx) * 6;
          g = 10 + Math.abs(nx) * 6;
          b = 14 + Math.abs(nx) * 8;
          break;
        case 4: // pz - front
          r = 20 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 16;
          g = 20 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 16;
          b = 28 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 16;
          break;
        case 5: // nz - back
          r = 20 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 16;
          g = 20 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 16;
          b = 28 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 16;
          break;
      }
    } else {
      // Light mode - brighter, more varied environment
      switch (face) {
        case 0: // px - right
          r = 220 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 35;
          g = 220 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 35;
          b = 225 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 30;
          break;
        case 1: // nx - left
          r = 220 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 35;
          g = 220 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 35;
          b = 225 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 30;
          break;
        case 2: // py - top
          // Bright area for light source
          const distLight = Math.sqrt(nx*nx + (ny-0.3)*(ny-0.3));
          const brightnessLight = Math.pow(Math.max(0, 1 - distLight * 1.5), 1.5);
          r = 230 + brightnessLight * 25;
          g = 230 + brightnessLight * 25;
          b = 235 + brightnessLight * 20;
          break;
        case 3: // ny - bottom
          r = 210 + Math.abs(nx) * 10;
          g = 210 + Math.abs(nx) * 10;
          b = 215 + Math.abs(nx) * 10;
          break;
        case 4: // pz - front
          r = 225 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 30;
          g = 225 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 30;
          b = 230 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 25;
          break;
        case 5: // nz - back
          r = 225 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 30;
          g = 225 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 30;
          b = 230 + Math.pow(Math.max(0, 1 - Math.abs(ny)), 2) * 25;
          break;
      }
    }
    
    return [r, g, b];
  };
  
  // Generate the 6 faces of the cube map (using constants from THREE directly)
  const faceIndices = [0, 1, 2, 3, 4, 5]; // right, left, top, bottom, front, back
  
  const textures: THREE.DataTexture[] = [];
  
  for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
    // Create a new data array for each face
    const faceData = new Uint8Array(size * size * 4);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const u = x / (size - 1);
        const v = y / (size - 1);
        
        const [r, g, b] = getPixel(faceIndex, u, v);
        
        faceData[i] = r;
        faceData[i + 1] = g;
        faceData[i + 2] = b;
        faceData[i + 3] = 255; // Alpha
      }
    }
    
    const texture = new THREE.DataTexture(
      faceData, 
      size, 
      size, 
      THREE.RGBAFormat
    );
    texture.needsUpdate = true;
    textures.push(texture);
  }
  
  const cubeTexture = new THREE.CubeTexture([
    textures[0].image,
    textures[1].image,
    textures[2].image,
    textures[3].image,
    textures[4].image,
    textures[5].image
  ]);
  
  cubeTexture.needsUpdate = true;
  
  return cubeTexture;
} 