import * as CONFIG from '../config/config';
import { PlayerPosition } from '../interfaces/player-position';
import { Point } from './track.builder';



export class Detector {
    public angle: number | null = null;
    public length: number | null = null;
    public move: string = '';
    public moveIndex: number = 0;
    public isActive: boolean = false;
}

export class PlayerCar {

    protected ctx: CanvasRenderingContext2D;

    public keyPresed: number = 0;
    public pos: PlayerPosition = { x: 0, y: 0 };
    public image: HTMLImageElement | null = null;

    protected cWidth: number = CONFIG.playerCar.width;
    protected cHeight: number = CONFIG.playerCar.height;
    protected cS: number = Math.sqrt(Math.pow(CONFIG.playerCar.width, 2) + Math.pow(CONFIG.playerCar.height, 2));

    public moveUP = false; //jazda w gore
    public moveDown = false; //jazda w dol
    public moveLeft = false; //jazda w lewo
    public moveRight = false; //jazda w prawo

    public moveUPRight = false; //jazda w gore i w prawo
    public moveUPLeft = false; //jazda w gore i w lewo

    public moveDownRight = false; //jazda w dol i w prawo
    public moveDownLeft = false; //jazda w dol i w lewo

    public moveLeftUP = false; //jazda w lewo i w gore
    public moveLeftDown = false; // jazda w lewo i w dol

    public moveRightUp = false; // jazda w prawo i w gore
    public moveRightDown = false; // jazda w prawo i w dol
    public moveLabels: Array<string> = ['', 'up', 'down', 'left', 'right', 'upRight', 'upLeft', 'downRight', 'downLeft', 'leftUp', 'leftDown', 'rightUp', 'rightDown'];
    public moveLabel: string = '';

    public detectors: Array<Detector> = [];

    public isCollision: boolean = false;

    public constructor(ctx: CanvasRenderingContext2D, playeStartPosition: PlayerPosition, image: HTMLImageElement) {
        this.ctx = ctx;
        this.pos = { x: playeStartPosition.x, y: playeStartPosition.y };
        this.image = image;
    }


    /**
     * //Wykrywanie kolizji
     * @returns {boolean} true - kolizja, false - brak kolizji
     */
    public detectCollision(): boolean {
        let hasGoodAngle = false;
        this.detectors.forEach((d: Detector) => {
            if (d.length && d.length <= 90 && d.length >= 15) {
                hasGoodAngle = true;
            }
        });
        this.isCollision = !hasGoodAngle;
        return this.isCollision;
    }

    /**
     * zwraca liczbe kątów w których samochód może jechać i powienien być aktywny detektor
     * @returns {Array<number>} tablica kątów w których samochód może jechać
     */
    public getActiveAngle(): Array<number> {
        if (this.moveUP) {
            return [180, 225, 270, 315, 360];
        } else if (this.moveDown) {
            return [360, 45, 90, 135, 180]
        } else if (this.moveLeft) {
            return [90, 135, 180, 225, 270];
        } else if (this.moveRight) {
            return [270, 315, 360, 45, 90];
        } else if (this.moveUPRight || this.moveRightUp) {
            return [225, 270, 315, 360, 45];
        } else if (this.moveUPLeft || this.moveLeftUP) {
            return [135, 180, 225, 270, 315];
        } else if (this.moveDownRight || this.moveRightDown) {
            return [315, 360, 45, 90, 135];
        } else if (this.moveDownLeft || this.moveLeftDown) {
            return [45, 90, 135, 180, 225];
        }
        return [180, 225, 270, 315, 360];
    }


    /**
     * rysowanie samochodu
     */
    public draw(): void {
        if (this.ctx && this.image) {
            let p = this.centerPositionOfCar();
            let px = this.pos.x;
            let py = this.pos.y;
            this.ctx.save();
            if (this.moveRightUp || this.moveUPRight) {
                this.ctx.translate(p.x + 0.2 * this.cS, p.y - 0.47 * this.cS);
                this.ctx.rotate(90 * Math.PI / 360);
                px = 0
                py = 0;
            } else if (this.moveLeftUP || this.moveUPLeft) {
                this.ctx.translate(p.x - 0.47 * this.cS, p.y - 0.2 * this.cS);
                this.ctx.rotate(-90 * Math.PI / 360);
                px = 0
                py = 0;

            } else if (this.moveDownLeft || this.moveLeftDown) {
                this.ctx.translate(p.x - 0.2 * this.cS, p.y + 0.47 * this.cS);
                this.ctx.rotate(-270 * Math.PI / 360);
                px = 0
                py = 0;
            }
            else if (this.moveRightDown || this.moveDownRight) {
                this.ctx.translate(p.x + 0.47 * this.cS, p.y + 0.2 * this.cS);
                this.ctx.rotate(270 * Math.PI / 360);
                px = 0
                py = 0;
            }
            else if (this.moveRight) {
                this.ctx.translate(p.x + this.cHeight / 2, p.y - this.cWidth / 2);
                this.ctx.rotate(180 * Math.PI / 360);
                px = 0;
                py = 0;
            } else if (this.moveLeft) {
                this.ctx.translate(p.x - this.cHeight / 2, p.y + this.cWidth / 2);
                this.ctx.rotate(-180 * Math.PI / 360);
                px = 0
                py = 0;
            } else if (this.moveDown) {
                this.ctx.translate(this.pos.x + (this.cWidth), this.pos.y + (this.cHeight));
                this.ctx.rotate(Math.PI);
                px = 0
                py = 0;
            }
            this.ctx.drawImage(
                this.image,
                CONFIG.playerCar.sX, CONFIG.playerCar.sY,
                CONFIG.playerCar.sWidth, CONFIG.playerCar.sHeight,
                px, py,
                this.cWidth, this.cHeight,
            );
            this.ctx.restore();

            this.drawDetectLine();
            this.detectCollision();
        }
    }


    public centerPositionOfCar(): Point {
        let x = this.pos.x + this.cWidth / 2;
        let y = this.pos.y + this.cHeight / 2;
        return { x: x, y: y };
    }





    public drawDetectLine(): void {
        let trackLine: Array<Point> = []
        let c = this.centerPositionOfCar();

        this.detectors = [];

        this.ctx.moveTo(c.x, c.y);

        let jMax: any = { 45: 12, 90: 17, 135: 12, 180: 8, 225: 12, 270: 17, 315: 12, 360: 8 };
        if (this.moveRightUp || this.moveUPRight) {
            jMax = { 45: 8, 90: 12, 135: 17, 180: 11, 225: 8, 270: 12, 315: 19, 360: 12 };
        } else if (this.moveLeftUP || this.moveUPLeft) {
            jMax = { 45: 17, 90: 12, 135: 8, 180: 12, 225: 19, 270: 12, 315: 8, 360: 11 };
        } else if (this.moveDownLeft || this.moveLeftDown) {
            jMax = { 45: 8, 90: 12, 135: 19, 180: 12, 225: 8, 270: 12, 315: 17, 360: 12 };
        } else if (this.moveRightDown || this.moveDownRight) {
            jMax = { 45: 19, 90: 12, 135: 8, 180: 12, 225: 17, 270: 12, 315: 8, 360: 12 };
        } else if (this.moveRight || this.moveLeft) {
            jMax = { 45: 12, 90: 8, 135: 12, 180: 17, 225: 12, 270: 8, 315: 12, 360: 17 };
        }

        for (let i = 45; i <= 360; i += 45) {
            let angle: number = i;
            let radians: number = angle * (Math.PI / 180);

            let x: number = c.x + Math.cos(radians) * CONFIG.trackWidth;
            let y: number = c.y + Math.sin(radians) * CONFIG.trackWidth;

            for (let j = CONFIG.trackWidth; j > jMax[i]; j--) {
                let tx = c.x + Math.cos(radians) * j;
                let ty = c.y + Math.sin(radians) * j;
                let d = this.ctx.getImageData(tx, ty, 1, 1);
                if (d.data[0] > 0) {
                    x = tx;
                    y = ty;
                    break;
                }
            }

            let d = new Detector();
            d.angle = angle;
            d.length = Math.sqrt(Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2));
            d.move = this.moveLabel;
            d.moveIndex = this.moveLabels.indexOf(this.moveLabel);


            let angleArray = this.getActiveAngle();
            if (angleArray.indexOf(angle) !== -1) {
                this.ctx.beginPath();
                this.ctx.moveTo(c.x, c.y);
                this.ctx.lineTo(x, y);

                if (d.length < 35) {
                    this.ctx.strokeStyle = '#ff0000';
                } else if (d.length < 50) {
                    this.ctx.strokeStyle = '#ffff00';
                } else {
                    this.ctx.strokeStyle = '#00b300';
                }
                this.ctx.stroke();
                d.isActive = true;
            }
            this.detectors.push(d);
        }

    }



    public moveCar(): void {
        if (this.moveUP) {
            if (this.pos.y < 0) {
                this.pos.y = 0;
            } else {
                this.pos.y -= CONFIG.playerCarSpeed;
            }
        }
        if (this.moveDown) {
            if (this.pos.y + this.cHeight === CONFIG.playGroundHeight ||
                this.pos.y + this.cHeight > CONFIG.playGroundHeight) {
                this.pos.y = CONFIG.playGroundHeight - this.cHeight;
            } else {
                this.pos.y += CONFIG.playerCarSpeed;
            }
        }
        if (this.moveLeft) {
            if (this.pos.x === 0 || this.pos.x < 0) {
                this.pos.x = 0;
            } else {
                this.pos.x -= CONFIG.playerCarSpeed;
            }
        }
        if (this.moveRight) {
            if (this.pos.x + CONFIG.playerCar.sWidth === CONFIG.playGroundWidth ||
                this.pos.x + CONFIG.playerCar.sWidth > CONFIG.playGroundWidth) {
                this.pos.x = CONFIG.playGroundWidth - this.cWidth;
            } else {
                this.pos.x += CONFIG.playerCarSpeed;
            }
        }
    }


    /**
     *  Wykrywanie ruchu gracza i ustawianie odpowiednich flag
     * @param event 
     * @param type 
     */
    public detectMove(event: KeyboardEvent, type: string): void {
        if (this.isCollision) {
            this.moveLeft = false;
            this.moveDownLeft = false;
            this.moveLeftDown = false;
            this.moveLeftUP = false;
            this.moveUPLeft = false;
            this.moveRight = false;
            this.moveRightDown = false;
            this.moveDownRight = false;
            this.moveRightUp = false;
            this.moveUPRight = false;
            this.moveUP = false;
            this.moveDown = false;
            return;
        }


        if (type === 'keydown') {
            this.keyPresed++;
            if (event.keyCode === 37) {
                this.moveLeft = true;
                this.moveLabel = 'left';
                if (this.moveUP) {
                    this.moveUPLeft = true;
                    this.moveLabel = 'leftUp';
                } else if (this.moveDown) {
                    this.moveDownLeft = true;
                    this.moveLabel = 'leftDown';
                }
            }
            if (event.keyCode === 39) {
                this.moveRight = true;
                this.moveLabel = 'right';
                if (this.moveUP) {
                    this.moveUPRight = true;
                    this.moveLabel = 'rightUp';
                } else if (this.moveDown) {
                    this.moveDownRight = true;
                    this.moveLabel = 'rightDown';
                }
            }
            if (event.keyCode === 38) {
                this.moveUP = true;
                this.moveLabel = 'up';
                if (this.moveLeft) {
                    this.moveLeftUP = true;
                    this.moveLabel = 'leftUp';
                } else if (this.moveRight) {
                    this.moveRightUp = true;
                    this.moveLabel = 'rightUp';
                }

            }
            if (event.keyCode === 40) {
                this.moveDown = true;
                this.moveLabel = 'down';
                if (this.moveLeft) {
                    this.moveLeftDown = true;
                    this.moveLabel = 'leftDown';
                } else if (this.moveRight) {
                    this.moveRightDown = true;
                    this.moveLabel = 'rightDown';
                }

            }
        } else if (type === 'keyup') {
            this.keyPresed--;
            if (event.keyCode === 37) {
                this.moveLeft = false;
                this.moveDownLeft = false;
                this.moveLeftDown = false;
                this.moveLeftUP = false;
                this.moveUPLeft = false;

            }
            if (event.keyCode === 39) {
                this.moveRight = false;
                this.moveDownRight = false;
                this.moveRightDown = false;
                this.moveRightUp = false;
                this.moveUPRight = false;

            }
            if (event.keyCode === 38) {
                this.moveUP = false;
                this.moveUPLeft = false;
                this.moveUPRight = false;
                this.moveLeftUP = false;
                this.moveRightUp = false;
            }
            if (event.keyCode === 40) {
                this.moveDown = false;
                this.moveDownLeft = false;
                this.moveDownRight = false;
                this.moveLeftDown = false;
                this.moveRightDown = false;
            }
            if (this.keyPresed <= 0) {
                this.keyPresed = 0;
                this.moveLabel = '';
            }
        }
    }

}