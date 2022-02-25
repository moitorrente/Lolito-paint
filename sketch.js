let layer = 0;
let mode = 'paint';

document.getElementsByName('load-element').forEach(button => button.onclick = () => {
    overPaintPixels(localStorage.getItem(button.id).split(','));
});
document.getElementsByName('mode').forEach(button => button.onclick = () => {
    mode = button.id;
});
// let selectedLayer = 'face';

document.getElementById('download').onclick = () => {
    paint.download();
}

document.getElementById('new-layer').onclick = () => {
    paint.addLayer();
    updateLayerNumber();
    document.getElementById('duplicate-layer').classList.remove('disabled');
    document.getElementById('layer-container').classList.remove('d-none');

}
document.getElementById('delete-layer').onclick = () => {
    paint.removeLayer();
    if (paint.getLayerNumber() < 1){
        document.getElementById('duplicate-layer').classList.add('disabled');
        document.getElementById('layer-container').classList.add('d-none');
    } 
    updateLayerNumber();
}

document.getElementById('duplicate-layer').onclick = () => {
    paint.duplicateLayer();
    updateLayerNumber();
}

function updateLayerNumber() {
    document.getElementById('layer-number').innerHTML = `(${paint.getLayerNumber()})`
}

function setup() {
    const canvas = createCanvas(rows * size, cols * size);
    canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.parent('canvas-container');
    frameRate(60)
    paint = new Paint(cols, rows, 0, size);
    paint.background.background();
    paint.addLayer();
    updateLayerNumber();
}

function draw() {
    background(217, 217, 217);
    paint.hover()
    paint.show()
}

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
//   }

function mouseDragged() {
    paintAction();
}

function mousePressed() {
    paintAction();
}

function mouseReleased() {
    paint.updateLayerPreview();
}

function paintAction() {
    if (mouseButton === LEFT) {
        if (mode === 'erase-pixels') {
            paint.erase()
        } else {
            paint.paint();
        }
    } else {
        paint.erase();
    }
}

function download(layer) {
    return paint.export(layer);
}

function overPaintPixels(set) {
    set.forEach((pixel, id) => {
        if (pixel === 'black') paint.paint(id);
    });
}

function whiteBackground() {
    background(255);
    paint.show();
}

function createPreview() {

    whiteBackground();
    const originalCanvas = document.getElementById("defaultCanvas0");
    const scaledCanvas = document.createElement('canvas');    //off-screen canvas

    scaledCanvas.width = 64;  //size of new canvas, make sure they are proportional
    scaledCanvas.height = 64; //compared to original canvas

    // scale original image to new canvas
    const ctx = scaledCanvas.getContext('2d');
    ctx.drawImage(originalCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    return scaledCanvas.toDataURL('image/jpeg', 1)
}

async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'image.jpeg';
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

document.getElementById('new-paint').onclick = () => alert('nuevo');