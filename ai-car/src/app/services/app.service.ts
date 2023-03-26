import { Injectable, EventEmitter } from '@angular/core';
import { GameService } from './game.service';
import { Detector } from './player.car';

@Injectable()
export class AppService {

	isImageLoaded: EventEmitter<number> = new EventEmitter();
	constructor(private gameService: GameService) { }

	createPlayGround(canvasElement:any): void {
		this.gameService.loadAssets(canvasElement).then( (image) => {
			setTimeout( () =>{
					this.isImageLoaded.emit();
			},1000);
		});
	}

	


	getImageLoadEmitter() {
		return this.isImageLoaded;
	}

	movePlayer(event: KeyboardEvent, type: string): void {
		this.gameService.p?.detectMove(event, type);
	}
}
