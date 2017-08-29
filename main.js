let unspeed = -5;
let size = 16;
let spacing = 5;
let ratio = 16;

let colorUnspeed = -20;
let colorStretch = 20;
let colorRange = [0.05, 1];
let colorMode = "opaque";
let direction = "h";

let breadth, stretch;

const {floor, ceil, round, abs, sin, cos, PI: pi} = Math;

let getColor;
if (colorMode == "transparent") {
	getColor = (shift) => `rgba(255, 255, 255, ${shift})`;
} else {
	getColor = (shift) => {
		const floored = floor(shift * 255);
		return `rgb(${floored}, ${floored}, ${floored})`;
	}
}

function remap(value, oldMin, oldMax, newMin, newMax) {
	return (value - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin;
}

class Main {
	static init(selector) {
		this.canvas = $(selector)[0];
		this.ctx = this.canvas.getContext("2d");
		this.adjust();
	}

	static resize(factor = 1) {
		const newWidth = window.innerWidth * factor;
		const newHeight = window.innerHeight * factor;

		stretch = window.innerHeight / 3;
		breadth = stretch / ratio;
		
		if (this.width == newWidth && this.height == newHeight) {
			return;
		}

		this.width = newWidth;
		this.height = newHeight;
		this.canvas.style.width = `${window.innerWidth}px`;
		this.canvas.style.height = `${window.innerHeight}px`;
	}

	static adjust() {
		const ratio = window.devicePixelRatio;

		if (1 < ratio) {
			this.resize(ratio);
			return true;
		}

		this.resize(1);
		return false;
	}

	static get width() { return this.canvas.width; }
	static get height() { return this.canvas.height; }
	static set width(to) { this.canvas.width = to; }
	static set height(to) { this.canvas.height = to; }

	static get midX() {return floor(this.width / 2); }
	static get midY() {return floor(this.height / 2); }

	static clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	static fill(color) {
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	static stroke(color, thicc /* sorry. */) {
		this.ctx.strokeStyle = color;
		
		if (thicc) {
			// when the stroke line thicc 😩
			this.ctx.lineWidth = thicc;
		}

		this.ctx.stroke();
	}

	static circle(xOffset = 0, y = 0, radius = size, color = "#fff") {
		this.ctx.beginPath();
		if (direction == "h") {
			this.ctx.arc(floor(y), floor(this.midY + xOffset), radius, 0, 2 * pi);
		} else {
			this.ctx.arc(floor(this.midX + xOffset), floor(y), radius, 0, 2 * pi);
		}

		this.ctx.closePath();
		this.fill(color);
	}

	static render() {
		const {ctx} = this;
		
		this.clear();

		const n = this.visiblePairs * 2;
		const gap = size + spacing;

		for (let i = 0; i < n; i++) {
			const shift = remap(sin((i + (new Date().getTime() / colorUnspeed)) / colorStretch), -1, 1, ...colorRange);
			const color = getColor(shift);
			const y = i * gap;

			const time = new Date().getTime() / unspeed;
			const range = 500;


			this.circle(remap(sin(i / breadth + 2*pi*(time % range)/range), -1, 1, -stretch, stretch), y, size, color);
			this.circle(remap(cos(i / breadth + 2*pi*(time % range)/range), -1, 1, -stretch, stretch), y, size, color);
		}
	}

	static get visiblePairs() {
		return ceil((direction == "h"? this.width : this.height) / (size + spacing));
	}
}

class BasePair {
	constructor(y = 0, z = 0) {
		this.y = y;
		this.z = z;
	}

	render() {
		const {ctx} = Main;
	}
}

$(() => {
	Main.init("canvas");

	const renderLoop = () => {
		Main.render();
		window.requestAnimationFrame(renderLoop);
	}

	renderLoop();
});

$(window).on("resize", () => Main.adjust());