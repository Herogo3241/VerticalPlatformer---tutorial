class Sprite {
  constructor({ position, imgSrc, framerate = 1, scale = 1 }) {
    this.position = position;
    this.scale = scale;
    this.image = new Image();
    this.image.src = imgSrc;
    this.loaded = false;
    this.currentframe = 0;
    this.image.onload = () => {
      this.width = this.scale * (this.image.width / this.framerate);
      this.height = this.scale * this.image.height;
      this.loaded = true;
    };
    this.framerate = framerate;
    this.framebuffer = 20;
    this.elapsedframe = 0;
  }

  draw() {
    if (!this.image) return;

    const cropbox = {
      position: {
        x: this.currentframe * (this.image.width / this.framerate),
        y: 0,
      },
      width: this.image.width / this.framerate,
      heigth: this.image.height,
    };

    c.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.heigth,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.updateFrames();
  }

  updateFrames() {
    this.elapsedframe++;
    // this.currentframe++;
    if (this.elapsedframe % this.framebuffer === 0) {
      if (this.currentframe < this.framerate - 1) {
        this.currentframe++;
        // console.log(this.currentframe)
      } else {
        this.currentframe = 0;
      }
    }
  }
}
