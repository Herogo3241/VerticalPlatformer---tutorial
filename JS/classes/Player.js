class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    platformBlocks,
    imgSrc,
    framerate,
    scale = 0.5,
    animations,
  }) {
    super({ imgSrc, framerate, scale });
    // this.image = image;
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.height = this.image.height;
    this.width = this.image.width;
    this.collisionBlocks = collisionBlocks;
    this.platformBlocks = platformBlocks;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };
    this.animations = animations;
    this.lastDirection = "right";

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imgSrc;
      // console.log(this.animations[key].imgSrc , key)
      this.animations[key].image = image;
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  // draw() {
  //   c.fillStyle = "red";
  //   c.fillRect(this.position.x, this.position.y, this.width, this.height);
  // }

  swapSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;
    // console.log(key)
    this.currentframe = 0;
    this.image = this.animations[key].image;
    this.framebuffer = this.animations[key].framebuffer;
    this.framerate = this.animations[key].framerate;
    // console.log(this.image)
  }

  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 53,
        y: this.position.y - 10,
      },
      width: 200,
      height: 80,
    };
  }

  checkHorizontalCanvasCollision() {
    if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576) {
      this.velocity.x = 0;
    }

    if (this.hitbox.position.x + this.velocity.x <= 2) {
      this.velocity.x = 0;
    }
  }

  shouldCameraPanToLeft({ canvas, camera }) {
    const cameraRightSideBox = this.camerabox.position.x + this.camerabox.width;
    const scaledDownCanvasWidth = canvas.width / 4;

    if (cameraRightSideBox >= 576) return;

    if (
      cameraRightSideBox >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldCameraPanToRight({ canvas, camera }) {
    if (this.camerabox.position.x <= 0) return;

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldCameraPanToDown({ canvas, camera }) {
    if (this.camerabox.position.y + this.velocity.y <= 0) return;

    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldCameraPanToUp({ canvas, camera }) {
    if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432) return;
    const scaledDownCanvasHeight = canvas.height / 4;
    if (
      this.camerabox.position.y + this.camerabox.height >=
      Math.abs(camera.position.y) + scaledDownCanvasHeight
    ) {
      camera.position.y -= this.velocity.y;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitbox();
    this.updateCamerabox();
    // console.log(this.swapSprite('Run'))

    // c.fillStyle = "rgba(0,0,255,0.2)";
    // c.fillRect(
    //   this.camerabox.position.x,
    //   this.camerabox.position.y,
    //   this.camerabox.width,
    //   this.camerabox.height
    // );

    //hitbox
    // c.fillStyle = "rgba(255,0,0,0.2)";
    // c.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );
    // //image
    // c.fillStyle = "rgba(0,255,0,0.2)";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    this.draw();
    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollision();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollision();
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 15,
      height: 27,
    };
  }

  checkForHorizontalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    //platform collisions
    for (let i = 0; i < this.platformBlocks.length; i++) {
      const platformBlock = this.platformBlocks[i];

      if (
        platformCollision({
          object1: this.hitbox,
          object2: platformBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = platformBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
