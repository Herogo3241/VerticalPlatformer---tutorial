const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
// console.log(c);
canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

const gravity = 0.1;

// console.log(floorCollisions);

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

// console.log(floorCollisions2D)
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

// console.log(collisionBlocks)

const platformCollisons2D = [];
for (let i = 0; i < platformCollisons.length; i += 36) {
  platformCollisons2D.push(platformCollisons.slice(i, i + 36));
}

// console.log(platformCollisons2D)
const platformBlocks = [];
platformCollisons2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol !== 0) {
      platformBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4
        })
      );
    }
  });
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./assets/Background Image/background.png",
});
const backgroundImageHeight = 432
const camera = {
  position: {
    x: 0,
    y: scaledCanvas.height - backgroundImageHeight,
  }
}

const player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformBlocks,
  imgSrc: "./assets/Warrior/Idle.png",
  framerate: 8,
  animations: {
    Idle: {
      imgSrc: "./assets/Warrior/Idle.png",
      framerate: 8,
      framebuffer: 10,
    },
    IdleLeft: {
      imgSrc: "./assets/Warrior/IdleLeft.png",
      framerate: 8,
      framebuffer: 10,
    },
    Run: {
      imgSrc: "./assets/Warrior/Run.png",
      framerate: 8,
      framebuffer: 11,
    },
    RunLeft: {
      imgSrc: "./assets/Warrior/RunLeft.png",
      framerate: 8,
      framebuffer: 11,
    },
    Jump: {
      imgSrc: "./assets/Warrior/Jump.png",
      framerate: 2,
      framebuffer: 10,
    },
    JumpLeft: {
      imgSrc: "./assets/Warrior/JumpLeft.png",
      framerate: 2,
      framebuffer: 10,
    },
    Fall: {
      imgSrc: "./assets/Warrior/Fall.png",
      framerate: 2,
      framebuffer: 10,
    },
    FallLeft: {
      imgSrc: "./assets/Warrior/FallLeft.png",
      framerate: 2,
      framebuffer: 10,
    },
  },
});
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x,  camera.position.y);
  background.update();
  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update();
  // });

  // platformBlocks.forEach((platformBlock) => {
  //   platformBlock.update();
  // });
  player.checkHorizontalCanvasCollision();
  player.update();

  player.velocity.x = 0;
  if (keys.a.pressed) {
    player.velocity.x = -1;
    player.swapSprite("RunLeft");
    player.lastDirection = "left";
    player.shouldCameraPanToRight({canvas , camera})
  } else if (keys.d.pressed) {
    player.swapSprite("Run");
    player.lastDirection = "right";
    player.velocity.x = 1;
    player.shouldCameraPanToLeft({canvas , camera})
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right") {
      player.swapSprite("Idle");
    }else{
      player.swapSprite('IdleLeft')
    }
  }

  if (player.velocity.y < 0) {
    player.shouldCameraPanToDown({canvas , camera})
    if (player.lastDirection === "right") {
      player.swapSprite("Jump");
    }else{
      player.swapSprite('JumpLeft')
    }
  }
  else if (player.velocity.y > 0) {
    player.shouldCameraPanToUp({canvas , camera})
    if (player.lastDirection === "right") {
      player.swapSprite("Fall");
    }else{
      player.swapSprite('FallLeft')
    }
  }
  c.restore();
}

window.addEventListener("keypress", (event) => {
  // console.log(event)
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      player.velocity.y = -3.5;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  // console.log(event)
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});

animate();
