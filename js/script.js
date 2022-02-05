// Damn Those Birds!
let game = {};
class Game extends Phaser.Scene {
  constructor() {
    super();
  }
  preload() {
    this.load.image("car0", "assets/car0.png");
    this.load.image("car1", "assets/car1.png");
    this.load.image("plant0", "assets/plant0.png");
    this.load.image("plant1", "assets/plant1.png");
  }
  create() {
    // Create plants first layer
    game.plants = this.physics.add.group();
    for (var i = 0; i < 5; i++) {
      game.plants.create(Math.random() * 2000, this.sys.game.canvas.height - 32, "plant0").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
    }

    // Create the car
    game.car = this.physics.add.sprite(0, 0, "car0").setScale(8).setCollideWorldBounds(true).setSize(16, 8).setOffset(0, 0).setDrag(800);

    // Create plants second layer
    for (var i = 0; i < 5; i++) {
      game.plants.create(Math.random() * 2000, this.sys.game.canvas.height - 32, "plant1").setScale(8).setGravityY(-config.physics.arcade.gravity.y);
    }

    // Input
    game.cursors = this.input.keyboard.createCursorKeys();

    // Camera
    this.cameras.main.setBounds(0, 0, 2000, this.sys.game.canvas.height);
    this.physics.world.setBounds(0, 0, 2000, this.sys.game.canvas.height);
    this.cameras.main.startFollow(game.car, true, 0.1, 0.1);

    // Animation
    this.anims.create({
      key: "drive",
      frames: [{
        key: "car1"
      }, {
        key: "car0"
      }],
      frameRate: 5,
      repeat: 0
    });

    // Colliders
    this.physics.add.collider(game.plants, game.plants, (plant1, plant2) => {
      plant1.destroy();
    });
  }
  update() {
    if (game.cursors.right.isDown) {
      game.car.setVelocityX(500);
      game.car.flipX = true;
      game.car.anims.play("drive", true);
    } else if (game.cursors.left.isDown) {
      game.car.setVelocityX(-500);
      game.car.flipX = false;
      game.car.anims.play("drive", true);
    }
  }
}
