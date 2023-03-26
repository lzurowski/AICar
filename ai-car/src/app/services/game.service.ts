import { Injectable, Input } from '@angular/core';

import * as CONFIG from './../config/config';
import { PlayerPosition } from './../interfaces/player-position';
import { TracCordinates, TrackBuilder } from './track.builder';
import { PlayerCar } from './player.car';

@Injectable()
export class GameService {

	@Input() public width: number = CONFIG.playGroundWidth;
	@Input() public height: number = CONFIG.playGroundHeight;

	public frameNumber: number = CONFIG.frameNumber;
	public context: CanvasRenderingContext2D | null = null;
	public image: HTMLImageElement|null = null;
	public gameLoop: any = null;

	public playerStartPosition: PlayerPosition = {
		x: CONFIG.playGroundWidth / 2 - CONFIG.playerCar.width,
		y: CONFIG.playGroundHeight - (CONFIG.playerCar.height + CONFIG.playerCar.height / 2),
	};

	public p: PlayerCar|null = null;

	public loadAssets(canvasElement: HTMLCanvasElement): Promise<void> {
		this.context = canvasElement.getContext('2d');
		canvasElement.width = this.width;
		canvasElement.height = this.height;
		return new Promise((resolve, reject) => {
			this.image = new Image();
			this.image.src = CONFIG.spritePath;
			this.image.width = 58;
			this.image.height = 128; this.image.onload = () => {
				if(this.context && this.image) {
					this.p = new PlayerCar(this.context, this.playerStartPosition, this.image);
				}
				resolve();
			};
			
		});
	}

	startGameLoop() {
		this.gameLoop = setInterval(() => {
			if(!this.p?.isCollision){			
				this.suffleProperties();
				this.cleanGround();
				this.buildTrack();
				this.createPlayer();
			}
		}, 1000/CONFIG.frameNumber);
	}

	animationFrame(n: number): boolean {
		if ((this.frameNumber / n) % 1 === 0) { return true; }
		return false;
	}

	suffleProperties(): void {
		this.frameNumber += 1;
	}


	buildTrack(): void {
		if (this.context !== null) {
			const tb = new TrackBuilder(this.context);
			const trackStart:TracCordinates = {
				l: {x: this.playerStartPosition.x-(CONFIG.trackWidth/2)  , y: CONFIG.playGroundHeight},
				r: {x: this.playerStartPosition.x+CONFIG.playerCar.width + CONFIG.trackWidth/2, y: CONFIG.playGroundHeight},
			};
			//Tor
			tb.buildTrack(trackStart,['vt50','t2','hr450','t1','t3','t8','vt20','t3','hl850','t4','t5','hr300', 't6','t7','hl450','t8','vt350']);
		}
	}

	createPlayer(): void {

		if (this.context !== null && this.image!==null) {

			if(this.p) {
				this.p.moveCar();
				this.p.draw();

			}
		}
	}



	cleanGround(): void {
		if (this.context) {
			this.context.clearRect(0, 0, CONFIG.playGroundWidth, CONFIG.playGroundHeight);
		}
	}

}
