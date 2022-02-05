// Damn Those Birds!
let game = {
  poopTimes: 0,
  currentStage: 1,
  timer: 30,
  sfx: {}
};
class Game extends Phaser.Scene {
  constructor(key, birdMax) {
    super(key);
    this.birdMax = birdMax;
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
    this.load.image("plant1", "assets/plant1.png");
    this.load.image("pigeon0", "assets/pigeon0.png");
    this.load.image("pigeon1", "assets/pigeon1.png");
    this.load.image("poop0", "assets/poop0.png");
    this.load.image("poop1", "assets/poop1.png");
    this.load.image("poop2", "assets/poop2.png");
    this.load.image("cloud", "assets/cloud.png");
    this.load.audio("hit", "assets/hit.wav");
    this.load.audio("music", "assets/music.mp3");
  }
  create() {
    let phaser = this;
    // Create plants first layer
    game.plants = this.physics.add.group();
    for (var i = 0; i < 5; i++) {
      game.plants.create(Math.random() * 2000, this.sys.game.canvas.height - 32, "plant0").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
    }

    // Create the car
    game.car = this.physics.add.sprite(1000, this.sys.game.canvas.height - 32, "car0").setScale(8).setCollideWorldBounds(true).setSize(16, 8).setOffset(0, 0).setDrag(800);
    game.car.cantMove = false;

    // Create plants second layer
    for (var i = 0; i < 5; i++) {
      game.plants.create(Math.random() * 2000, this.sys.game.canvas.height - 32, "plant1").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
    }

    // SFX
    game.sfx.hit = this.sound.add("hit");
    game.sfx.music = this.sound.add("music").setLoop(true);
    game.sfx.music.play();

    // Create birds
    game.birds = this.physics.add.group();
    game.poop = this.physics.add.group();
    game.poopInterval = setInterval(function () {
      let dir = Math.floor(Math.random() * 2) === 1 ? 0 : 2000;
      let bird = game.birds.create(dir, Math.random() * phaser.sys.game.canvas.height / 2, "pigeon0").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
      bird.setVelocityX(dir > 0 ? -100 : 100);
      bird.poopTimer = 100;
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

    // Colliders
    this.physics.add.collider(game.plants, game.plants, (plant1, plant2) => {
      plant1.destroy();
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
        setTimeout(function () {
          clearInterval(game.timerInterval);
          clearInterval(game.poopInterval);
          clearInterval(game.cloudInterval);
          phaser.scene.stop();
          phaser.scene.start("GameOver");
        }, 2000);
      }
    });

    // Timer
    game.timerInterval = setInterval(function () {
      game.timer--;
      if (game.timer <= 0) {
        game.timer = 30;
        clearInterval(game.timerInterval);
        clearInterval(game.poopInterval);
        clearInterval(game.cloudInterval);
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
  }
  update() {
    if (!game.car.cantMove) {
      if (game.cursors.right.isDown) {
        game.car.setVelocityX(500);
        game.car.flipX = true;
        game.car.anims.play(`drive${game.poopTimes}`, true);
      } else if (game.cursors.left.isDown) {
        game.car.setVelocityX(-500);
        game.car.flipX = false;
        game.car.anims.play(`drive${game.poopTimes}`, true);
      }
    }
    game.birds.getChildren().forEach(bird => {
      bird.poopTimer--;
      bird.anims.play("pigeonFly", true);
      if (bird.poopTimer <= 0) {
        let poop = game.poop.create(bird.x, bird.y, "poop0").setScale(8).setSize(1, 1).setOffset(6, 6);
        if (bird.dir < 2000) {
          poop.flipX = true;
          poop.setOffset(1, 6);
        }
        bird.poopTimer = 100;
      }
    });
    game.clouds.getChildren().forEach(cloud => {
      if (cloud.dir > 0) {
        cloud.x--;
      } else {
        cloud.x++;
      }
    });
  }
}
class Stage1 extends Game {
  constructor() {
    super("Stage1", 5000);
  }
}
class Stage2 extends Game {
  constructor() {
    super("Stage2", 3000);
  }
}
class Stage3 extends Game {
  constructor() {
    super("Stage3", 1000);
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
