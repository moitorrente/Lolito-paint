const rows = 16;
const cols = 16;
const size = 40;

class Paint {
    constructor() {
        this.layers = [];
        this.selectedLayer = 0;
        this.mirrorX = false;
        this.mirrorY = false;
        this.createBackground();
    }

    createBackground() {
        this.background = new Layer(cols, rows, -1, size);
        this.background.background();
    }

    showPresets(id) {
        this.layers.forEach(layer => {
            let presets;
            if (layer.id == id) presets = layer.getPresets();
            if (presets) {
                const presetContainer = document.getElementById('preset-container');
                presetContainer.innerHTML = null;
                presets.forEach((preset, id) => {
                    const container = document.createElement('div');
                    container.onclick = () => {
                        this.reset();
                        preset.data.forEach((pixel, id) => {
                            if (pixel === 'black') this.paint(id);
                        });
                    }

                    // container.innerHTML = `
                    // <input class="list-group-item-check" type="radio" name="preset" id="preset-${id}" value="" checked="">

                    // <label class="list-group-item py-3" for="preset-${id}">
                    // <img src="${preset.preview}"></img>
                    // </label>`;

                    container.innerHTML = `
                    <input class="list-group-item-check" type="radio" name="preset" id="preset-${id}" value="" checked="">
                    <label class="list-group-item list-group-item-action d-flex my-1 gap-3 bg-gradient" for="preset-${id}">
                        <img class="rounded" src="${preset.preview}" id="preset-preview-${id}"></img>     
                    </label>
                    `;
                    presetContainer.appendChild(container);
                })
            }
        })
    }

    getLayerNumber() {
        let sum = 0;
        this.layers.forEach(layer => {
            if (!layer.deleted) sum++;
        });
        return sum;
    }

    createCombinations() {
        //this.preview();

        // let presets = [];

        // for(let i = 0; i < this.layers.length; i++){
        //      presets.push(this.layers[i].getPresets()) ;
        // }
        // console.log(presets)

        // for (let i = 0; i < presets.length; i++){
        //     for(let j = 0; j < presets[i].length; j++){
        //         this.paintPreset(presets[i][j]);
        //         redraw();
        //         this.download();
        //     }
        // }

        const face = this.layers[0].getPresets();
        this.paintPreset(face[0]);
        const eyes = this.layers[1].getPresets();
        const mouths = this.layers[2].getPresets();

        for (let i = 0; i < eyes.length; i++) {
            this.paintPreset(eyes[i]);
            for (let j = 0; j < mouths.length; j++) {
                this.paintPreset(mouths[j]);
                redraw();
                this.download();
            }
        }

    }

    paintPreset(preset) {
        this.selectedLayer = preset.layerId;
        this.reset();
        preset.data.forEach((pixel, id) => {
            if (pixel === 'black') this.paint(id);
        });
    }

    removeLayer() {
        this.layers[this.selectedLayer].deleted = true;
        document.getElementById(`layer-container-${this.selectedLayer}`).classList.add('d-none');
        this.selectedLayer = 0;
    }

    addLayer() {
        let id = this.layers.length;
        const layerContainer = document.getElementById('layer-container');
        this.layers.push(new Layer(cols, rows, id, size));

        const container = document.createElement('div');
        container.id = `layer-container-${id}`;
        container.innerHTML = `
        <input class="list-group-item-check" type="radio" name="layer" id="layer-${id}" value="" checked="">
        <label class="list-group-item list-group-item-action d-flex gap-3 my-1 bg-gradient" for="layer-${id}">
            <img class="rounded" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/bAEMBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAEAAQAMBEQACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Av4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//2Q==" id="layer-preview-${id}"></img>
            <div class="d-flex gap-2 w-100 justify-content-between">
                <small class=" text-nowrap align-self-center" id="layer-name-${id}">Layer ${id}</small>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square align-self-center feature-icon-sm rounded" onclick="paint.addPreset()" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </div>        
        </label>
        `;
        container.onclick = () => {
            this.selectedLayer = id;
            this.showPresets(id);
        }
        layerContainer.prepend(container);
        this.selectedLayer = id;
        this.showPresets(this.selectedLayer);
    }

    duplicateLayer() {

        let temp = this.selectedLayer;
        this.addLayer();
        this.layers[this.selectedLayer].display.length = 0;
        this.layers[temp].display.forEach((pixel) => {
            this.layers[this.selectedLayer].display.push(new Pixel(pixel.id, pixel.x, pixel.y, pixel.w, pixel.color, 0.01, 'black', pixel.setted));
        });
        this.layers[this.selectedLayer].show();
        this.show();
        redraw();

        this.updateLayerPreview();
    }


    addPreset() {
        this.preview();
        this.layers[this.selectedLayer].addPreset();
        this.showPresets(this.selectedLayer);
        this.restoreView();
    }

    show() {
        this.background.show();
        this.layers.forEach(layer => layer.show());
    }

    paint(id) {
        this.layers.forEach(layer => {
            if (layer.id == this.selectedLayer) layer.paint(id, document.getElementById('mirrorX').checked, document.getElementById('mirrorY').checked)
        });
    }

    hover() {
        this.layers.forEach(layer => {
            if (layer.id == this.selectedLayer) layer.hover()
        })
    }

    updateLayerPreview() {
        const preview = document.getElementById(`layer-preview-${this.selectedLayer}`);
        if (preview) {
            this.preview();
            preview.src = createPreview();
            this.restoreView();
        }
    }

    erase() {
        this.layers.forEach(layer => {
            if (layer.id == this.selectedLayer) layer.erase(document.getElementById('mirrorX').checked, document.getElementById('mirrorY').checked)
        });
    }
    reset() {
        this.layers[this.selectedLayer].reset()
    }
    export() {
        return this.layers[this.selectedLayer].export();
    }

    preview() {
        if (this.layers.length) {
            this.layers.forEach(layer => {
                layer.visible = false;
            });
            this.layers[this.selectedLayer].visible = true;
            this.layers[this.selectedLayer].preview();
            this.background.visible = false;
            redraw();
        }
    }

    hide(id) {
        this.layers[id].visible = false;
    }

    restoreView() {
        this.layers.forEach(layer => {
            layer.visible = true;
            layer.restore();
        });
        this.background.visible = true;
    }

    download() {
        this.background.visible = false;
        this.layers.forEach(layer => {
            layer.preview();
        });
        whiteBackground();
        downloadImage(canvas.toDataURL('image/jpeg', 1));
        this.restoreView();
    }
}