import Effect from '../effects/Effect';
import ShaderPass from '../graphics/ShaderPass';
import PixelateShader from '../shaders/PixelateShader';
import HexagonShader from '../shaders/HexagonShader';

const shaders = {
    Square: PixelateShader,
    Hexagon: HexagonShader
};

export default class PixelateEffect extends Effect {
    constructor(options) {
        super(PixelateEffect, options);
    }

    update(options) {
        let changed = Effect.prototype.update.call(this, options);

        if (this.pass && options.type !== undefined) {
            this.setPass(this.getShaderPass(this.options.type));
        }

        return changed;
    }

    updatePass() {
        this.pass.setUniforms({ size: this.options.size });
    }

    addToScene() {
        this.setPass(this.getShaderPass(this.options.type));
        this.updatePass();
    }

    removeFromScene() {
        this.pass = null;
    }

    getShaderPass(type) {
        let pass = new ShaderPass(shaders[type]);
        pass.setUniforms(this.options);

        return pass;
    }
}

PixelateEffect.label = 'Pixelate';

PixelateEffect.className = 'PixelateEffect';

PixelateEffect.defaults = {
    type: 'Square',
    size: 10
};