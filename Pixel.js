class Pixel {
    constructor(id, x, y, w, color, border, borderColor, setted) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.color = color;
        this.setted = setted;
        this.border = border;
        this.borderColor = borderColor;
        this.hoverActive = false;
    }

    show() {
        rectMode(CORNER);
        if (this.setted) {
            fill(this.color)
        } else {
            this.hoverActive ? fill(180, 180, 180) : noFill();
        }

        stroke(this.borderColor);
        strokeWeight(this.border);
        rect(this.x, this.y, this.w, this.w);
    }

    setBorder(border) {
        this.border = border;
    }

    erase() {
        this.setted = false;
        this.color = null;
        return [parseInt(this.x) / parseInt(this.w), parseInt(this.y) / parseInt(this.w)]

    }

    setColor(color) {
        this.setted = true;
        this.color = color;
        return [parseInt(this.x) / parseInt(this.w), parseInt(this.y) / parseInt(this.w)]
    }

    hover() {
        this.hoverActive = this.checkOver(mouseX, mouseY);
    }

    checkOver(x, y) {
        return (x < this.x + this.w && x > this.x && y < this.y + this.w && y > this.y);
    }
}