class Layer {
    constructor(cols, rows, id, pixelSize) {
        this.id = id;
        this.cols = cols;
        this.row = rows;
        this.presetId = 0;
        this.display = [];
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const id = i + j * cols;
                const x = i * pixelSize;
                const y = j * pixelSize;
                this.display.push(new Pixel(id, x, y, size, 'white', 0.01, 'black', false));
            }
        }
        this.visible = true;
        this.deleted = false;
        this.presets = [];
    }


    background() {
        let id = 0;
        for (let i = 0; i < this.display.length; i++) {
            if (i % rows) id++;
            if (id % 2) {
                this.display[i].setColor('#EDF2F7');
            } else {
                this.display[i].setColor('white');
            }
        }
    }


    addPreset() {
        this.presets.push({ "id": this.presetId, "data": this.export(), "preview": createPreview(), "layerId": this.id });
        this.presetId++;
    }

    getPresets() {
        return this.presets;
    }

    setVisibility(visible) {
        this.visible = visible;
    }

    show() {
        if (this.visible && !this.deleted) {
            for (let i = 0; i < this.display.length; i++) {
                this.display[i].show();
            }
        }
    }

    paint(id, mirrorX, mirrorY) {
        let x, y;
        if (id !== undefined) {
            this.display[id].setColor('black');
        } else {
            for (let i = 0; i < this.display.length; i++) {
                this.display[i].checkOver(mouseX, mouseY) ? [x, y] = this.display[i].setColor('black') : false;
            }
        }
        // if (mirrorX) {

        if (mirrorY && x !== undefined && y !== undefined) {
            const i = this.cols - x - 1 + y * this.cols;
            this.display[i].setColor('black');
        }

        if (mirrorX && x !== undefined && y !== undefined) {
            const i = x + (this.cols - y - 1) * this.cols;
            this.display[i].setColor('black');
        }

        if (mirrorY && mirrorX && x !== undefined && y !== undefined) {
            const i = this.cols - x - 1 + (this.cols - y - 1) * this.cols;
            this.display[i].setColor('black');
        }


        // }

    }
    erase(mirrorX, mirrorY) {
        let x, y;
        for (let i = 0; i < this.display.length; i++) {
            this.display[i].checkOver(mouseX, mouseY) ? [x, y] = this.display[i].erase() : false;
        }

        if (mirrorY && x !== undefined && y !== undefined) {
            const i = this.cols - x - 1 + y * this.cols;
            this.display[i].erase();
        }

        if (mirrorX && x !== undefined && y !== undefined) {
            const i = x + (this.cols - y - 1) * this.cols;
            this.display[i].erase();
        }

        if (mirrorY && mirrorX && x !== undefined && y !== undefined) {
            const i = this.cols - x - 1 + (this.cols - y - 1) * this.cols;
            this.display[i].erase();
        }
    }

    reset() {
        this.display.forEach(pixel => pixel.erase());
    }

    export() {
        if (this.visible) return this.display.map(pixel => pixel.color)
    }

    preview() {
        this.display.forEach(pixel => pixel.setBorder(0));
    }
    restore() {
        this.display.forEach(pixel => pixel.setBorder(0.01));
    }

    hover() {
        this.display.forEach(pixel => pixel.hover());

    }
}