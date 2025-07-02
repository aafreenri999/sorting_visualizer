let array = [];
let speed = 20;

const barsContainer = document.getElementById("bars-container");
const sizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");

function generateArray(size = 50) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    drawBars();
}

function drawBars(highlight = [], sorted = []) {
    barsContainer.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.textContent = array[i];

        if (highlight.includes(i)) bar.classList.add("comparing");
        if (sorted.includes(i)) bar.classList.add("sorted");

        barsContainer.appendChild(bar);
    }
}

document.getElementById("generate").addEventListener("click", () => {
    generateArray(sizeSlider.value);
});

document.getElementById("start").addEventListener("click", async () => {
    const algo = document.getElementById("algorithm").value;
    disableControls(true);
    if (algo === "bubble") await bubbleSort();
    else if (algo === "quick") await quickSort(0, array.length - 1);
    drawBars([], array.map((_, i) => i)); // Mark all sorted at end
    disableControls(false);
});

sizeSlider.addEventListener("input", () => {
    generateArray(sizeSlider.value);
});

speedSlider.addEventListener("input", () => {
    speed = 210 - parseInt(speedSlider.value);
});

function disableControls(disabled) {
    document.getElementById("generate").disabled = disabled;
    document.getElementById("start").disabled = disabled;
    sizeSlider.disabled = disabled;
    speedSlider.disabled = disabled;
    document.getElementById("algorithm").disabled = disabled;
}

async function bubbleSort() {
    const bars = document.getElementsByClassName("bar");

    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].classList.add("comparing");
            bars[j + 1].classList.add("comparing");

            await sleep(speed);

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].textContent = array[j];
                bars[j + 1].textContent = array[j + 1];
            }

            bars[j].classList.remove("comparing");
            bars[j + 1].classList.remove("comparing");
        }

        bars[array.length - i - 1].classList.add("sorted");
    }

    bars[0].classList.add("sorted");
}

async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);

        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        drawBars([j, high]);
        await sleep(speed);

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
}
async function mergeSort(start = 0, end = array.length -1) {
    if (start >= end) return;

    const mid = Math.floor((start+end) /2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}
async function merge(start, mid, end) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);

    let i = 0, j = 0, k= start;

    while(i < left.length && j < right.length){
        drawBars([k]);
        await sleep(speed);

        if (left[i] <= right[j]){
            array[k++] = left[i++];
        }
        else{
            array[k++] = right[j++];
        }
        drawBars([k+1]);
        await sleep(speed);
    }
    while (i < left.length){
        array[k++] = left[i++];
        drawBars([k-1]);
        await sleep(speed);
    }
    while (j < right.length){
        array[k++] = right[j++];
        drawBars([k-1]);
        await sleep(speed);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

generateArray(sizeSlider.value);
