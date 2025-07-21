let platforms;
let player;
let cursors;
let stars;
let score = 0;
let scoreText;
let bombs;
let gameOver = false;

//объект сцена
class GameScene extends Phaser.Scene {
        //важные циклы игры, загрузка игровых ассеты
            preload(){
                this.load.image('sky', 'assets/blue-sky.jpg');
                this.load.image('ground', 'assets/ground.png');
                this.load.image('star', 'assets/star.png');
                this.load.image('bomb', 'assets/bomb.png');
                this.load.image('hero', 'assets/hero.png');
                this.load.image('restart', 'assets/restart.png')
            }
            //прописывание и добавление игровых объектов на сцене и дополнительные параметры для них
            create(){
                //обновление страницы
                this.add.image(0, 0, 'sky').setOrigin(0,0);
                const restartButton = this.add.image(1500, 30, 'restart').setInteractive();

                restartButton.on('pointerdown', () => {
                    location.reload();
                });
                //создание переменнойЮ значищей объекст с физическими свойствами
                platforms = this.physics.add.staticGroup();
                platforms.create(250, 850, 'ground').setScale(2).refreshBody();
                platforms.create(630, 740, 'ground');
                platforms.create(900, 900, 'ground');
                platforms.create(1150, 750, 'ground');
                platforms.create(1400, 600, 'ground');
                platforms.create(1000, 450, 'ground');
                platforms.create(600, 350, 'ground');
                platforms.create(100, 400, 'ground');

                //создаем персонажа
                this.player = this.physics.add.sprite(400, 350, 'hero');
                // this.player.setBounce(0.2);
                this.player.setCollideWorldBounds(true);

                // this.player.body.setGravityY(300);
                this.physics.add.collider(this.player, this.platforms);

                // Добавляем столкновение между героем и платформами
                this.physics.add.collider(this.player, platforms);

                cursors = this.input.keyboard.createCursorKeys();

                //создание неэстатической группы
                stars = this.physics.add.group({
                    key: 'star',
                    repeat: 11,
                    setXY: {x: 12, y: 12, stepX: 130},
                })
                //добавление физики прыгучести у звезд
                stars.children.iterate((child) => {
                    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
                })
                this.physics.add.collider(stars, platforms);

                this.physics.add.overlap(this.player, stars, this.collectStar, null, this)

                //счет собранных звезд
                scoreText = this.add.text(16, 16, 'Score: 0', {
                    fontSize: '32px',
                    fill: '#000',
                });

                //bombs
                bombs = this.physics.add.group();
                this.physics.add.collider(bombs, platforms);
                this.physics.add.collider(this.player, bombs, this.hitBomb, null, this);
            }
            //опсание различных операций(передвижение при нажатии на клавишу)
            update(){
                //завершение обработки опреаций в случае gameOver
                if(gameOver) return;
                
                if(cursors.left.isDown){
                    this.player.setVelocityX(-220);
                }else if(cursors.right.isDown){
                    this.player.setVelocityX(220);
                }else{
                    this.player.setVelocityX(0);
                }

                if(cursors.up.isDown && this.player.body.touching.down){
                    this.player.setVelocityY(-330);
                }
            }

            //функция отвечает за поедание звезд
            collectStar(player, star){
                star.disableBody(true, true);
                score += 10;
                scoreText.setText(`Score: ${score}`)

                if(stars.countActive(true) === 0){
                    stars.children.iterate(child => {
                        child.enableBody(true, child.x, 0, true, true)
                    })
                    let x = (player.x < 400)
                        Phaser.Math.Between(400, 800)
                        Phaser.Math.Between(0, 400)
                    let bomb = bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
                }
            }

            // функция, отвечающая за подрыв игрока
            hitBomb(player, bomb){
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                gameOver = true;
            }
        }

        let config = {
            type: Phaser.AUTO,
            width: 1531,
            height: 980,
            scene: new GameScene(),
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {
                        y: 300
                    }
                }
            }
        }
        let game = new Phaser.Game(config);


                
                 