// Damn Those Birds!
let game = {
  poopTimes: 0,
  currentStage: 1,
  timer: 30,
  sfx: {},
  carSpeed: 500,
  wind: {
    windy: false,
    windSpeed: 800,
    direction: false
  }
};
class Game extends Phaser.Scene {
  constructor(key, birdMax, hasWind, hasOil) {
    super(key);
    this.birdMax = birdMax;
    this.hasWind = hasWind;
    this.hasOil = hasOil;
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

    this.load.audio("hit", "assets/hit.wav");
    this.load.audio("wind", "assets/wind.wav");
    this.load.audio("music", "assets/music.mp3");
  }
  create() {
    let phaser = this;
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
    game.sfx.wind = this.sound.add("wind").setLoop(true);
    game.sfx.music = this.sound.add("music").setLoop(true);
    game.sfx.music.play();

    // Create birds
    game.birds = this.physics.add.group();
    game.poop = this.physics.add.group();
    game.birdInterval = setInterval(function () {
      let dir = Math.floor(Math.random() * 2) === 1 ? 0 : 2000;
      let type = Math.random() * 1 > 0.5 ? "blueJay" : "pigeon";
      let bird = game.birds.create(dir, Math.random() * phaser.sys.game.canvas.height / 2, `${type}0`).setScale(8).setGravityY(-config.physics.arcade.gravity.y);
      bird.type = type;
      if (bird.type === "blueJay") {
        bird.setVelocityX(dir > 0 ? -200 : 200);
        bird.poopTimer = 50;
      } else {
        bird.setVelocityX(dir > 0 ? -100 : 100);
        bird.poopTimer = 100;
      }
      bird.dir = dir;
      if (dir < 2000) {
        bird.flipX = true;
      }
    }, Math.random() * this.birdMax);

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
        game.sfx.music.stop();
        game.sfx.wind.stop();
        game.currentStage++;
        if (game.currentStage > 3) {
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
        game.sfx.wind.play({
          volume: 0.1
        });
        setTimeout(function () {
          game.wind.windy = false;
          game.sfx.wind.stop();
          game.plants.getChildren().forEach(plant => {
            plant.setTexture(plant.type ? "plant1" : "plant0");
          });
        }, 8000);
      }, Math.random() * 25000);
    }

    // Create oil
    game.oil = this.physics.add.group();
    if (this.hasOil) {
      setTimeout(function () {
        game.oil.create(Math.random() * 2000, phaser.sys.game.canvas.height - 32, "oil").setGravityY(-config.physics.arcade.gravity.y).setScale(8);
      }, Math.random() * 25000);
    }

    // Colliders
    this.physics.add.collider(game.plants, game.plants, (plant1, plant2) => {
      plant1.destroy();
    });
    this.physics.add.collider(game.car, game.oil, (car, oil) => {
      oil.destroy();
      game.carSpeed += 200;
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
    }
    game.birds.getChildren().forEach(bird => {
      bird.poopTimer--;
      bird.anims.play(`${bird.type}Fly`, true);
      if (bird.x < 0 || bird.x > 2000) {
        bird.destroy();
      }
      if (bird.poopTimer <= 0) {
        let poop = game.poop.create(bird.x, bird.y, "poop").setScale(8).setSize(1, 1).setOffset(6, 6).setGravityX(game.wind.windy ? (game.wind.direction ? game.wind.windSpeed : -game.wind.windSpeed) : 0);
        if (bird.dir < 2000) {
          poop.flipX = true;
          poop.setOffset(1, 6);
        }
        bird.poopTimer = 100;
        if (bird.type === "blueJay") {
          bird.poopTimer = 50;
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
  }
}
class Stage1 extends Game {
  constructor() {
    super("Stage1", 8000, false, false);
  }
}
class Stage2 extends Game {
  constructor() {
    super("Stage2", 5000, true, true);
  }
}
class Stage3 extends Game {
  constructor() {
    super("Stage3", 3000, true, false);
  }
}
class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }
  preload() {
    this.load.image("gameOver", "assets/gameOver.png");
    this.load.image("car10", "assets/car10.png");
  }
  create() {
    this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) - 100, "gameOver").setScale(8);
    this.add.image(this.sys.game.canvas.width / 2, (this.sys.game.canvas.height / 2) + 100, "car10").setScale(8);
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
