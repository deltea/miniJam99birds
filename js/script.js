// Damn Those Birds!
let game = {
  poopTimes: 0,
  currentStage: 1,
  timer: 30,
  sfx: {},
  deaths: 0,
  carSpeed: 500,
  wind: {
    windy: false,
    windSpeed: 800,
    direction: false
  },
  pointer: {
    isDown: false,
    x: 0
  }
};
class Game extends Phaser.Scene {
  constructor(key, birdMax, hasWind, hasOil, hasTree, hasWater, treePos) {
    super(key);
    this.birdMax = birdMax;
    this.hasWind = hasWind;
    this.hasOil = hasOil;
    this.hasTree = hasTree;
    this.hasWater = hasWater;
    this.treePos = treePos;
  }
  preload() {
    this.load.image("car0", "assets/car0.png");
    this.load.image("car1", "assets/car1.png");
    this.load.image("car2", "assets/car2.png");
    this.load.image("car3", "assets/car3.png");
    this.load.image("car4", "assets/car4.png");
    this.load.image("car5", "assets/car5.png");
    this.load.image("car6", "assets/car6.png");
    this.load.image("car7", "assets/car7.png");
    this.load.image("car8", "assets/car8.png");
    this.load.image("car9", "assets/car9.png");
    this.load.image("car10", "assets/car10.png");
    this.load.image("car11", "assets/car11.png");
    this.load.image("plant0", "assets/plant0.png");
    this.load.image("plant0wind0", "assets/plant0wind0.png");
    this.load.image("plant0wind1", "assets/plant0wind1.png");
    this.load.image("plant1", "assets/plant1.png");
    this.load.image("plant1wind0", "assets/plant1wind0.png");
    this.load.image("plant1wind1", "assets/plant1wind1.png");
    this.load.image("pigeon0", "assets/pigeon0.png");
    this.load.image("pigeon1", "assets/pigeon1.png");
    this.load.image("blueJay0", "assets/blueJay0.png");
    this.load.image("blueJay1", "assets/blueJay1.png");
    this.load.image("poop", "assets/poop.png");
    this.load.image("cloud", "assets/cloud.png");
    this.load.image("oil", "assets/oil.png");
    this.load.image("tree0", "assets/tree0.png");
    this.load.image("tree1", "assets/tree1.png");
    this.load.image("tree2", "assets/tree2.png");
    this.load.image("boss0", "assets/boss0.png");
    this.load.image("boss1", "assets/boss1.png");
    this.load.image("bossPoop", "assets/bossPoop.png");
    this.load.image("stage1", "assets/stage1.png");
    this.load.image("stage2", "assets/stage2.png");
    this.load.image("stage3", "assets/stage3.png");
    this.load.image("stage4", "assets/stage4.png");
    this.load.image("stage5", "assets/stage5.png");
    this.load.image("stage6", "assets/stage6.png");
    this.load.image("toucan0", "assets/toucan0.png");
    this.load.image("toucan1", "assets/toucan1.png");
    this.load.image("mountains", "assets/mountains.png");
    this.load.image("water0", "assets/water0.png");
    this.load.image("water1", "assets/water1.png");
    this.load.image("water2", "assets/water2.png");
    this.load.image("water3", "assets/water3.png");

    this.load.image("0", "assets/0.png");
    this.load.image("1", "assets/1.png");
    this.load.image("2", "assets/2.png");
    this.load.image("3", "assets/3.png");
    this.load.image("4", "assets/4.png");
    this.load.image("5", "assets/5.png");
    this.load.image("6", "assets/6.png");
    this.load.image("7", "assets/7.png");
    this.load.image("8", "assets/8.png");
    this.load.image("9", "assets/9.png");

    this.load.audio("hit", "assets/hit.mp3");
    this.load.audio("wind", "assets/wind.mp3");
    this.load.audio("levelUp", "assets/levelUp.mp3");
    this.load.audio("powerup", "assets/powerup.mp3");
    this.load.audio("bossPoop", "assets/bossPoop.mp3");
    this.load.audio("music", "assets/music.mp3");
    this.load.audio("boss", "assets/boss.mp3");
  }
  create() {
    let phaser = this;
    // Create mountains
    for (var i = 0; i < 6; i++) {
      this.add.image(128 + (i * 512), this.sys.game.canvas.height - 100, "mountains").setScale(8).setScrollFactor(0.5);
    }

    // Create tree
    if (this.hasTree) {
      game.tree = this.physics.add.staticSprite(this.treePos, this.sys.game.canvas.height - 256, "tree0").setScale(8);
    }

    // Create plants first layer
    game.plants = this.physics.add.group();
    for (var i = 0; i < 5; i++) {
      let plant = game.plants.create(Math.random() * 2000, this.sys.game.canvas.height - 32, "plant0").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
      plant.type = 0;
    }

    // Create the car
    game.car = this.physics.add.sprite(1000, this.sys.game.canvas.height - 32, "car0").setScale(8).setCollideWorldBounds(true).setSize(16, 8).setOffset(0, 0).setDrag(800);
    game.car.cantMove = false;

    // Create plants second layer
    for (var i = 0; i < 5; i++) {
      let plant = game.plants.create(Math.random() * 2000, this.sys.game.canvas.height - 32, "plant1").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
      plant.type = 1;
    }

    // SFX
    game.sfx.hit = this.sound.add("hit");
    game.sfx.bossPoop = this.sound.add("bossPoop");
    game.sfx.powerup = this.sound.add("powerup");
    game.sfx.levelUp = this.sound.add("levelUp").play();
    game.sfx.wind = this.sound.add("wind").setLoop(true);
    game.sfx.music = this.sound.add("music").setLoop(true);
    game.sfx.boss = this.sound.add("boss").setLoop(true);
    if (game.currentStage === 1 && game.deaths < 1) {
      game.sfx.music.play();
    } else if (game.currentStage === 6 && game.deaths < 1) {
      game.sfx.boss.play();
    }

    // Create birds
    game.birds = this.physics.add.group();
    game.poop = this.physics.add.group();
    game.birdInterval = setInterval(function () {
      let dir = Math.floor(Math.random() * 2) === 1 ? 0 : 2000;
      let type = Math.random() * 1 > 0.5 ? (Math.random() * 1 > 0.3 && game.currentStage > 3 ? "toucan" : "blueJay") : "pigeon";
      let bird = game.birds.create(dir, Math.random() * phaser.sys.game.canvas.height / 2, `${type}0`).setScale(8).setGravityY(-config.physics.arcade.gravity.y);
      bird.type = type;
      if (bird.type === "blueJay") {
        bird.setVelocityX(dir > 0 ? -200 : 200);
        bird.poopTimer = 50;
      } else if (bird.type === "pigeon") {
        bird.setVelocityX(dir > 0 ? -150 : 150);
        bird.poopTimer = 100;
      } else {
        bird.setVelocityX(dir > 0 ? -100 : 100);
        bird.poopTimer = 150;
      }
      bird.dir = dir;
      if (dir < 2000) {
        bird.flipX = true;
      }
    }, Math.random() * (this.birdMax - 1000) + 1000);

    // Input
    game.cursors = this.input.keyboard.createCursorKeys();

    // Camera
    this.cameras.main.setBounds(0, 0, 2000, this.sys.game.canvas.height);
    this.physics.world.setBounds(0, 0, 2000, this.sys.game.canvas.height);
    this.cameras.main.startFollow(game.car, true, 0.1, 0.1);

    // Animation
    this.anims.create({
      key: "drive0",
      frames: [{
        key: "car1"
      }, {
        key: "car0"
      }],
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "drive1",
      frames: [{
        key: "car3"
      }, {
        key: "car2"
      }],
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "drive2",
      frames: [{
        key: "car5"
      }, {
        key: "car4"
      }],
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "drive3",
      frames: [{
        key: "car7"
      }, {
        key: "car6"
      }],
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "drive4",
      frames: [{
        key: "car9"
      }, {
        key: "car8"
      }],
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "drive5",
      frames: [{
        key: "car11"
      }, {
        key: "car10"
      }],
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "pigeonFly",
      frames: [{
        key: "pigeon1"
      }, {
        key: "pigeon0"
      }],
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "blueJayFly",
      frames: [{
        key: "blueJay1"
      }, {
        key: "blueJay0"
      }],
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "plant0wind",
      frames: [{
        key: "plant0wind0"
      }, {
        key: "plant0wind1"
      }],
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "plant1wind",
      frames: [{
        key: "plant1wind0"
      }, {
        key: "plant1wind1"
      }],
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "treeWind",
      frames: [{
        key: "tree1"
      }, {
        key: "tree2"
      }],
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "boss",
      frames: [{
        key: "boss0"
      }, {
        key: "boss1"
      }],
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "toucanFly",
      frames: [{
        key: "toucan1"
      }, {
        key: "toucan0"
      }],
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "waterDrip",
      frames: [{
        key: "water0"
      }, {
        key: "water1"
      }, {
        key: "water2"
      }, {
        key: "water3"
      }],
      frameRate: 3,
      repeat: -1
    });
    game.car.anims.play(`drive${game.poopTimes}`, true);

    // Show time
    game.timerNumbers = this.physics.add.staticGroup();
    let numberArray = String(game.timer).split("");
    for (var i = 0; i < numberArray.length; i++) {
      game.timerNumbers.create((i * 40) + 40, 50, numberArray[i]).setScale(8).setScrollFactor(0);
    }

    // Timer
    game.timerInterval = setInterval(function () {
      game.timer--;
      let numberArray = String(game.timer).split("");
      for (var i = 0; i < game.timerNumbers.getChildren().length; i++) {
        game.timerNumbers.getChildren()[i].visible = false;
      }
      for (var x = 0; x < numberArray.length; x++) {
        game.timerNumbers.create((x * 40) + 40, 50, numberArray[x]).setScale(8).setScrollFactor(0);
      }
      if (game.timer <= 0) {
        game.timer = 30;
        clearInterval(game.timerInterval);
        clearInterval(game.birdInterval);
        clearInterval(game.cloudInterval);
        game.wind.windy = false;
        game.sfx.wind.stop();
        game.currentStage++;
        if (game.currentStage > 6) {
          phaser.scene.stop();
          phaser.scene.start("Win");
        }
        phaser.scene.stop();
        phaser.scene.start(`Stage${game.currentStage}`);
      }
    }, 1000);

    // Create clouds
    game.clouds = this.physics.add.group();
    game.cloudInterval = setInterval(function () {
      let dir = Math.floor(Math.random() * 2) === 1 ? 0 : 2000;
      let cloud = game.clouds.create(dir, Math.random() * phaser.sys.game.canvas.height / 2, "cloud").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
      cloud.dir = dir;
      if (Math.random() * 1 > 0.5) {
        cloud.flipX = true;
      }
    }, 5000);
    if (this.hasWind) {
      setTimeout(function () {
        game.wind.windy = true;
        game.wind.direction = Math.random() * 1 > 0.5 ? true : false;
        game.sfx.wind.play({
          volume: 0.1
        });
        setTimeout(function () {
          game.wind.windy = false;
          game.sfx.wind.stop();
          game.plants.getChildren().forEach(plant => {
            plant.setTexture(plant.type ? "plant1" : "plant0");
          });
        }, 10000);
      }, Math.random() * 25000);
    }

    // Create oil
    game.oil = this.physics.add.group();
    if (this.hasOil) {
      game.oil.create(Math.random() * 800, phaser.sys.game.canvas.height - 32, "oil").setGravityY(-config.physics.arcade.gravity.y).setScale(8);
    }

    // Create water bucket
    game.waterBucket = this.physics.add.group();
    if (this.hasWater) {
      let bucket = game.waterBucket.create(Math.random() * 800, phaser.sys.game.canvas.height - 24, "water0").setGravityY(-config.physics.arcade.gravity.y).setScale(8);
      bucket.anims.play("waterDrip", true);
    }

    // Boss bird
    if (game.currentStage === 6) {
      game.boss = this.physics.add.sprite(1000, 100, "boss0").setScale(8).setGravityY(-config.physics.arcade.gravity.y).setCollideWorldBounds(true);
      game.boss.dir = false;
      game.boss.poopTimer = 30;
      game.bossPoop = this.physics.add.group();
    }

    // Create stage message
    game.stageMessage = this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, `stage${game.currentStage}`).setScale(8).setScrollFactor(0);
    setTimeout(function () {
      game.stageMessage.moveToCorner = phaser.tweens.add({
        targets: game.stageMessage,
        y: 160,
        x: phaser.sys.game.canvas.width - 150,
        ease: "Quad.easeInOut",
        duration: 600,
        repeat: 0
      });
    }, 1000);

    // Mobile movement
    this.input.on("pointerdown", (pointer) => {
      game.pointer.isDown = true;
      game.pointer.x = pointer.x
    });
    this.input.on("pointerup", (pointer) => {
      game.pointer.isDown = false;
      game.pointer.x = pointer.x
    });

    // Colliders
    this.physics.add.collider(game.plants, game.plants, (plant1, plant2) => {
      plant1.destroy();
    });
    this.physics.add.collider(game.car, game.oil, (car, oil) => {
      game.sfx.powerup.play();
      oil.destroy();
      game.carSpeed += 200;
    });
    this.physics.add.collider(game.car, game.waterBucket, (car, bucket) => {
      game.sfx.powerup.play();
      bucket.destroy();
      game.poopTimes = 0;
      game.car.anims.play(`drive${game.poopTimes}`, true);
    });
    this.physics.add.collider(game.car, game.poop, (car, poop) => {
      game.sfx.hit.play({
        volume: 1.5
      });
      poop.destroy();
      phaser.cameras.main.shake(240, 0.01, false);
      game.poopTimes++;
      game.car.anims.play(`drive${game.poopTimes}`, true);
      if (game.poopTimes > 5) {
        game.car.cantMove = true;
        game.wind.windy = false;
        game.deaths++;
        setTimeout(function () {
          game.sfx.wind.stop();
          game.sfx.music.stop();
          clearInterval(game.timerInterval);
          clearInterval(game.birdInterval);
          clearInterval(game.cloudInterval);
          phaser.scene.stop();
          phaser.scene.start("GameOver");
        }, 2000);
      }
    });
    this.physics.add.collider(game.car, game.bossPoop, (car, poop) => {
      game.sfx.hit.play({
        volume: 1.5
      });
      poop.destroy();
      phaser.cameras.main.shake(240, 0.01, false);
      game.poopTimes++;
      game.car.anims.play(`drive${game.poopTimes}`, true);
      if (game.poopTimes > 5) {
        game.car.cantMove = true;
        game.wind.windy = false;
        game.deaths++;
        setTimeout(function () {
          game.sfx.wind.stop();
          game.sfx.wind.stop();
          clearInterval(game.timerInterval);
          clearInterval(game.birdInterval);
          clearInterval(game.cloudInterval);
          phaser.scene.stop();
          phaser.scene.start("GameOver");
        }, 2000);
      }
    });
  }
  update() {
    if (!game.car.cantMove) {
      if (game.cursors.right.isDown) {
        game.car.setVelocityX(game.carSpeed);
        game.car.flipX = true;
        game.car.anims.play(`drive${game.poopTimes}`, true);
      } else if (game.cursors.left.isDown) {
        game.car.setVelocityX(-game.carSpeed);
        game.car.flipX = false;
        game.car.anims.play(`drive${game.poopTimes}`, true);
      }
      if (game.pointer.isDown) {
        if (game.pointer.x > this.sys.game.canvas.width / 2) {
          game.car.setVelocityX(game.carSpeed);
          game.car.flipX = true;
          game.car.anims.play(`drive${game.poopTimes}`, true);
        } else {
          game.car.setVelocityX(-game.carSpeed);
          game.car.flipX = false;
          game.car.anims.play(`drive${game.poopTimes}`, true);
        }
      }
    }
    game.birds.getChildren().forEach(bird => {
      bird.poopTimer--;
      bird.anims.play(`${bird.type}Fly`, true);
      if (bird.x < 0 || bird.x > 2000) {
        bird.destroy();
      }
      if (bird.poopTimer <= 0) {
        if (bird.type === "toucan") {
          let poop1 = game.poop.create(bird.x, bird.y, "poop").setScale(8).setSize(1, 1).setOffset(6, 6).setGravityX(game.wind.windy ? (game.wind.direction ? game.wind.windSpeed : -game.wind.windSpeed) : 0).setVelocityX(-100);
          let poop2 = game.poop.create(bird.x, bird.y, "poop").setScale(8).setSize(1, 1).setOffset(6, 6).setGravityX(game.wind.windy ? (game.wind.direction ? game.wind.windSpeed : -game.wind.windSpeed) : 0).setVelocityX(100);
          let poop3 = game.poop.create(bird.x, bird.y, "poop").setScale(8).setSize(1, 1).setOffset(6, 6).setGravityX(game.wind.windy ? (game.wind.direction ? game.wind.windSpeed : -game.wind.windSpeed) : 0);

          if (bird.dir < 2000) {
            poop1.flipX = true;
            poop1.setOffset(1, 6);
            poop2.flipX = true;
            poop2.setOffset(1, 6);
            poop3.flipX = true;
            poop3.setOffset(1, 6);
          }
        } else {
          let poop = game.poop.create(bird.x, bird.y, "poop").setScale(8).setSize(1, 1).setOffset(6, 6).setGravityX(game.wind.windy ? (game.wind.direction ? game.wind.windSpeed : -game.wind.windSpeed) : 0);
          if (bird.dir < 2000) {
            poop.flipX = true;
            poop.setOffset(1, 6);
          }
        }
        bird.poopTimer = 100;
        if (bird.type === "blueJay") {
          bird.poopTimer = 50;
        } else if (bird.type === "toucan") {

        }
      }
    });
    game.clouds.getChildren().forEach(cloud => {
      let cloudSpeed = 1;
      if (cloud.dir > 0) {
        cloud.x -= cloudSpeed;
      } else {
        cloud.x += cloudSpeed;
      }
    });
    if (game.wind.windy) {
      game.plants.getChildren().forEach(plant => {
        if (plant.type === 0) {
          plant.anims.play("plant0wind", true);
        } else {
          plant.anims.play("plant1wind", true);
        }
        if (game.wind.direction === false) {
          plant.flipX = true;
        }
      });
    }
    if (game.wind.windy && this.hasTree) {
      game.tree.anims.play("treeWind", true);
    }
    if (game.currentStage === 6) {
      game.boss.anims.play("boss", true);
      game.boss.poopTimer--;
      if (game.boss.poopTimer <= 0) {
        game.sfx.bossPoop.play();
        game.bossPoop.create(game.boss.x, game.boss.y, "bossPoop").setScale(8).setSize(3, 3).setOffset(5, 3);
        game.boss.poopTimer = 30;
      }
      if (game.boss.dir) {
        game.boss.x += 5;
      } else {
        game.boss.x -= 5;
      }
      if (game.boss.x <= 64 || game.boss.x > 2000 - 64) {
        game.boss.dir = !game.boss.dir;
        game.boss.flipX = !game.boss.flipX;
      }
    }
  }
}
class Stage1 extends Game {
  constructor() {
    super("Stage1", 8000, false, false, false, false, 0);
  }
}
class Stage2 extends Game {
  constructor() {
    super("Stage2", 5000, false, true, false, false, 0);
  }
}
class Stage3 extends Game {
  constructor() {
    super("Stage3", 3000, false, false, false, false, 0);
  }
}
class Stage4 extends Game {
  constructor() {
    super("Stage4", 3000, true, false, false, true, 0);
  }
}
class Stage5 extends Game {
  constructor() {
    super("Stage5", 3000, true, false, false, false, 0);
  }
}
class Stage6 extends Game {
  constructor() {
    super("Stage6", 3000, true, false, true, false, 1000);
  }
}
class Title extends Phaser.Scene {
  constructor() {
    super("Title");
  }
  preload() {
    this.load.image("title", "assets/title.png");
    this.load.image("start", "assets/start.png");
    this.load.image("mountains", "assets/mountains.png");
    this.load.image("pigeon0", "assets/pigeon0.png");
    this.load.image("pigeon1", "assets/pigeon1.png");
    this.load.image("car0", "assets/car0.png");
  }
  create() {
    let phaser = this;
    for (var i = 0; i < 5; i++) {
      this.add.image(128 + (i * 512), this.sys.game.canvas.height - 100, "mountains").setScale(8);
    }
    game.birds = this.physics.add.group();
    game.birdInterval = setInterval(function () {
      let dir = Math.floor(Math.random() * 2) === 1 ? 0 : 2000;
      let bird = game.birds.create(dir, Math.random() * phaser.sys.game.canvas.height / 2, "pigeon0").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
      bird.setVelocityX(dir > 0 ? -150 : 150);
      if (dir < 2000) {
        bird.flipX = true;
      }
    }, 3000);
    this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height, "car0").setScale(8);
    this.anims.create({
      key: "pigeonFly",
      frames: [{
        key: "pigeon1"
      }, {
        key: "pigeon0"
      }],
      frameRate: 5,
      repeat: 0
    });
    game.title = this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) - 100, "title").setScale(8);
    game.title.hover = this.tweens.add({
      targets: game.title,
      y: (this.sys.game.canvas.height / 2) - 120,
      ease: "Quad.easeInOut",
      duration: 600,
      repeat: -1,
      yoyo: true
    });
    this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) + 100, "start").setScale(4);
    this.input.on("pointerdown", () => {
      clearInterval(game.birdInterval);
      phaser.scene.stop();
      phaser.scene.start("Stage1");
    });
  }
  update() {
    game.birds.getChildren().forEach(bird => {
      bird.anims.play("pigeonFly", true);
    });
  }
}
class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }
  preload() {
    this.load.image("gameOver", "assets/gameOver.png");
    this.load.image("playAgain", "assets/playAgain.png");
    this.load.image("car10", "assets/car10.png");
  }
  create() {
    let phaser = this;
    this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) - 150, "gameOver").setScale(8);
    this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) + 50, "car10").setScale(8);
    this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) + 150, "playAgain").setScale(4);
    this.input.on("pointerdown", () => {
      game.currentStage = 1;
      game.timer = 30;
      game.carSpeed = 500;
      game.poopTimes = 0;
      phaser.scene.stop();
      phaser.scene.start("Title");
    });
  }
}
class Win extends Phaser.Scene {
  constructor() {
    super("Win");
  }
  preload() {
    this.load.image("goodJob", "assets/goodJob.png");
    this.load.image("car0", "assets/car0.png");
  }
  create() {
    this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) - 100, "goodJob").setScale(8);
    this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) + 100, "car0").setScale(8);
  }
}
