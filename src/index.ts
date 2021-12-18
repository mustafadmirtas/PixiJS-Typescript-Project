import * as PIXI from 'pixi.js';
import PixiFps from "pixi-fps";
import { TweenLite } from "gsap";
import * as particles from 'pixi-particles';


const texts = ["Sad", "Happy", "Smile", "Unsure", "Frown", "Tongue", "Cry", "Devil"];

export class GameManager {
    private app: PIXI.Application;
    private _gameContainer: PIXI.Container | any;
    private _cardContainer: PIXI.Container | any;
    private _textImageContainer: PIXI.Container | any;
    private _particleContainer: PIXI.ParticleContainer | any;
    private _cards: PIXI.Sprite[] = [];
    private _width = 1920;
    private _height = 1080;
    private _counter = 0;
    private _firstInFirstOut = true;
    private _cardInterval: any;
    private _textInterval: any;
    
    public constructor() {
        this.app = new PIXI.Application({ width: this._width, height: this._height, resolution: 1, backgroundColor: 0xcccccc, autoDensity: true });
        document.body.appendChild(this.app.view);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.PRECISION_VERTEX = PIXI.PRECISION.LOW;
        PIXI.settings.CREATE_IMAGE_BITMAP = true;
        this.app.renderer.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";

        window.addEventListener("resize", () => {
            this.resize();
        });

        this.app.loader.add('card1', 'assets/card1.png');
        this.app.loader.add('card2', 'assets/card2.png');
        this.app.loader.add('particle', 'assets/particle.png');
        this.app.loader.add('fireParticle', 'assets/fireParticle.png');
        this.app.loader.add('button', 'assets/button.png');
        this.app.loader.add('assets/texture.json');
        this.app.loader.onComplete.add(() => { this.onLoadComplete(); });
        this.app.loader.load();
    }

    private onLoadComplete(): void {
        const fpsCounter = new PixiFps();

        this._gameContainer = new PIXI.Container();
        this._cardContainer = new PIXI.Container();
        this._textImageContainer = new PIXI.Container();
        this._particleContainer = new PIXI.ParticleContainer();
       
        this._gameContainer.name = "GameContainer";
        this._cardContainer.name = "CardContainer";
        this._textImageContainer.name = "TextAndImageContainer";
        this._particleContainer.name = "ParticleContainer";
        this.app.stage.addChild(this._gameContainer);
        this._gameContainer.addChild(this._cardContainer);
        this._gameContainer.addChild(this._textImageContainer);
        this._gameContainer.addChild(this._particleContainer);

        this.createButtons();

        this._cardContainer.visible = false;
        this._textImageContainer.visible = false;
        this._particleContainer.visible = false;

        //this._textInterval = setInterval(() => { this.createTextAndImageRandomized(); }, 2000);
        //this.createFireEffectParticle();
        //this.createCards();

        this.app.stage.addChild(fpsCounter);
    }

    private createButtons() {
        let caseOneButton: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from("button"));
        let caseOneText: PIXI.Text = new PIXI.Text("Case One", { fontFamily: 'Arial', fontSize: 40, fill: 0xffffff, align: 'center' });
        caseOneText.anchor.set(0.5, 0.5);
        caseOneText.position.set(240, 100);
        caseOneButton.position.set(350, 0);
        caseOneButton.scale.set(0.5, 0.5);
        caseOneButton.addChild(caseOneText);
        caseOneButton.interactive = true;

        caseOneButton.on("pointerdown", () => {
            if (this._cardContainer.visible == false) {
                this._cardContainer.visible = true;
                this._textImageContainer.visible = false;
                this._particleContainer.visible = false;
                this.createCards();
                this._textImageContainer.removeChildren();
                this._particleContainer.removeChildren();
                clearInterval(this._textInterval);
            }
        });
        this._gameContainer.addChild(caseOneButton);

        let caseTwoButton: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from("button"));
        let caseTwoText: PIXI.Text = new PIXI.Text("Case Two", { fontFamily: 'Arial', fontSize: 40, fill: 0xffffff, align: 'center' });
        caseTwoText.anchor.set(0.5, 0.5);
        caseTwoText.position.set(240, 100);
        caseTwoButton.position.set(600, 0);
        caseTwoButton.scale.set(0.5, 0.5);
        caseTwoButton.addChild(caseTwoText);
        caseTwoButton.interactive = true;

        caseTwoButton.on("pointerdown", () => {
            if (this._textImageContainer.visible == false) {
                this._textImageContainer.visible = true;
                this._cardContainer.visible = false;
                this._particleContainer.visible = false;
                this._textInterval = setInterval(() => { this.createTextAndImageRandomized(); }, 2000);
                this._cardContainer.removeChildren();
                this._particleContainer.removeChildren();
                clearInterval(this._cardInterval);
            }
        });
        this._gameContainer.addChild(caseTwoButton);

        let caseThreeButton: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from("button"));
        let caseThreeText: PIXI.Text = new PIXI.Text("Case Two", { fontFamily: 'Arial', fontSize: 40, fill: 0xffffff, align: 'center' });
        caseThreeText.anchor.set(0.5, 0.5);
        caseThreeText.position.set(240, 100);
        caseThreeButton.position.set(850, 0);
        caseThreeButton.scale.set(0.5, 0.5);
        caseThreeButton.addChild(caseThreeText);
        caseThreeButton.interactive = true;

        caseThreeButton.on("pointerdown", () => {
            if (this._particleContainer.visible == false) {
                this._particleContainer.visible = true;
                this._cardContainer.visible = false;
                this._textImageContainer.visible = false;
                this._textImageContainer.removeChildren();
                this._cardContainer.removeChildren();
                clearInterval(this._cardInterval);
                clearInterval(this._textInterval);

                this.createFireEffectParticle();
            }
        });
        this._gameContainer.addChild(caseThreeButton);


    }


    private createCards() {

        for (let i = 0; i < 144; i++) {
            this._cards[i] = PIXI.Sprite.from("card" + (i%2 == 0 ? 1 : 2));
            this._cards[i].position.set(0 + (i * 5), 180 );
            this._cards[i].name = "card " + i;
            this._cards[i].scale.set(1, 1);
            this._cards[i].zIndex = i;
            this._cardContainer.addChild(this._cards[i]);
        }
        this._counter = 144;
        this._cardInterval = setInterval(() => { this.cardMovement(); }, 1000);
    }

    private cardMovement() {
        this._counter = (this._firstInFirstOut ? this._counter-1 : this._counter+1);
        //checking last element or first element of array
        if (this._firstInFirstOut && this._counter == 0) {
            this._firstInFirstOut = false;
        } else if (!this._firstInFirstOut && this._counter == 143) {
            this._firstInFirstOut = true;
        }
        // Tweening cards
        let tween = TweenLite.to(this._cards[this._counter].position, 2, {
            x: (0 + (!this._firstInFirstOut ? (this._counter * 5) : ((143 - this._counter) * 5))), y: !this._firstInFirstOut ? 180 : 360,
            onComplete: () => {
                this._cards[this._counter].parent.sortChildren();
            },
            onStart: () => {
                this._cards[this._counter].zIndex = this._firstInFirstOut ? (143 - this._counter) : this._counter;
                if (this._counter < 72 && this._firstInFirstOut) {
                    this._cards[this._counter].parent.sortChildren();
                } else if (this._counter > 72 && !this._firstInFirstOut) {
                    this._cards[this._counter].parent.sortChildren();
                }
            }
        })

    }

    private createTextAndImageRandomized() {
        this._textImageContainer.removeChildren();
        for (let i = 0; i < 3; i++) {
            let randomNumber = Math.floor(Math.random() * 20);
            randomNumber % 2 == 0 ? this.createRandomText(i) : this.createRandomImage(i);
        }
    }
    //Creating RandomText based on texts
    private createRandomText(index: number) {
        let text = new PIXI.Text(texts[Math.floor(Math.random() * 7)], { fontFamily: 'Arial', fontSize: Math.floor(Math.random() * 20 + 10), fill: 0xff1010, align: 'center' });
        text.position.set(640 + (index * 100), 360);
        this._textImageContainer.addChild(text);
    }
    //Creating Random Image based on Emots
    private createRandomImage(index: number) {
        let sprite = new PIXI.Sprite(PIXI.Texture.from("Emot" + (Math.floor(Math.random() * 4 + 1))));
        sprite.position.set(640 + (index * 100), 360);
        this._textImageContainer.addChild(sprite);
    }
    //Create Animated Particle Effect
    private createFireEffectParticle() {
        console.log(particles);
        var emitter = new particles.Emitter(

            // The PIXI.Container to put the emitter in
            // if using blend modes, it's important to put this
            // on top of a bitmap, and not use the root stage Container
            this._particleContainer,

            // The collection of particle images to use
            ["fireParticle"],

            // Emitter configuration, edit this to change the look
            // of the emitter
            {                
                alpha: {
                    list: [
                        {
                            value: 0.62,
                            time: 0
                        },
                        {
                            value: 0,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                scale: {
                    list: [
                        {
                            value: 1,
                            time: 0
                        },
                        {
                            value: 2,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                color: {
                    list: [
                        {
                            value: "fff191",
                            time: 0
                        },
                        {
                            value: "ff622c",
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                speed: {
                    list: [
                        {
                            value: 100,
                            time: 0
                        },
                        {
                            value: 500,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                startRotation: {
                    min: 265,
                    max: 275
                },
                rotationSpeed: {
                    min: 50,
                    max: 50
                },
                lifetime: {
                    min: 0.2,
                    max: 0.75
                },
                frequency: 0.001,
                spawnChance: 1,
                particlesPerWave: 1,
                emitterLifetime: -1,
                maxParticles: 10,
                pos: {
                    x: 640,
                    y: 750
                },
                addAtBack: false,
                spawnType: "torus",
                spawnCircle: {
                    x: 0,
                    y: 0,
                    r: 10
                },
                
            }
        );

        // Calculate the current time
        var elapsed = Date.now();

        // Update function every frame
        var update = () => {

            // Update the next frame
            requestAnimationFrame(update);

            var now = Date.now();
            // The emitter requires the elapsed
            // number of seconds since the last update
            emitter.update((now - elapsed) * 0.001);
            elapsed = now;

            // Should re-render the PIXI Stage
            // renderer.render(stage);
        };

        // Start emitting
        emitter.emit = true;

        // Start the update
        update();
    }

    //Resize
    private resize() {
        if (window.innerWidth / window.innerHeight >= this._width / this._height) {
            var w = window.innerHeight * (this._width / this._height);
            var h = window.innerHeight;
        } else {
            var w = window.innerWidth;
            var h = window.innerWidth / (this._width / this._height);
        }
        this.app.renderer.view.style.width = w + 'px';
        this.app.renderer.view.style.height = h + 'px';
        
    }
}

window.onload = () => {
    new GameManager();
}
window.PIXI = PIXI;