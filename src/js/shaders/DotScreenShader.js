import * as THREE from 'three';
import glsl from '../lib/glsl';

export default {
    uniforms: {
        tDiffuse: { type: 't', value: null },
        tSize: { type: 'v2', value: new THREE.Vector2(256, 256) },
        center: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) },
        angle: { type: 'f', value: 1.57 },
        scale: { type: 'f', value: 1.0 }
    },

    vertexShader: glsl.vertex.Basic,
    fragmentShader: glsl.fragment.DotScreen
};