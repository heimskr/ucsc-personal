let unspeed = -5;
let delay = 1000 / 30;
let size = 10;
let spacing = 0;
let breadth = 20;
let width = 200;
let colorUnspeed = 20;
let colorHeight = 6;

const {floor, ceil, round, abs, sin, cos, PI: pi} = Math;

function remap(value, oldMin, oldMax, newMin, newMax) {
	return (value - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin;
}

class Main {
	static init(selector) {
		this.offset = 0;

		this.canvas = $(selector)[0];
		this.ctx = this.canvas.getContext("2d");
		this.adjust();
	}

	static resize(factor = 1) {
		const newWidth = window.innerWidth * factor
		const newHeight = window.innerHeight * factor
		
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
		this.ctx.arc(floor(this.midX + xOffset), floor(y), radius, 0, 2 * pi);
		this.ctx.closePath();
		this.fill(color);
	}

	static render() {
		this.offset++;
		const {ctx} = this;
		
		this.clear();

		const n = this.visiblePairs * 2;
		const gap = size + spacing;

		for (let i = 0; i < n; i++) {
			const shift = remap(sin((i + (new Date().getTime() / colorUnspeed)) / colorHeight), -1, 1, 0.2, 1);
			const color = `rgba(255, ${floor(1 * 255)}, 255, ${shift})`;
			console.log(color);
			const y = i * gap// - (new Date().getTime() / 2 % (this.height + 10));

			const time = new Date().getTime() / unspeed;
			const range = 500;


			this.circle(remap(sin(i / breadth + 2*pi*(time % range)/range), -1, 1, -width, width), y, size, color);
			this.circle(remap(cos(i / breadth + 2*pi*(time % range)/range), -1, 1, -width, width), y, size, color);
		}
	}

	static get visiblePairs() {
		return ceil(this.height / (size + spacing));
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
	this.offset = 0;

	Main.render();
	setInterval(() => Main.render(), delay);
});

$(window).on("resize", () => Main.adjust());