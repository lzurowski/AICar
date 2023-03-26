import { Component, ElementRef, AfterViewInit, ViewChild, HostListener  } from '@angular/core';
import { AppService } from './services/app.service';
import { GameService } from './services/game.service';
import { Detector } from './services/player.car';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

	
  //@ViewChild(ElementRef) canvas!: ElementRef; 
  @ViewChild('canvas')
  private canvas: ElementRef = {} as ElementRef;
  
  	public subscription: any;
	public showLoader = true;
	public detectorData:Array<Detector> = [];

	public labels:Array<boolean> = [];
	public isMove:boolean = false;
	public lernData:Array<any> = [];

	public gameStops:boolean = false;

	constructor(
		private appService: AppService,
		private gameService: GameService
	) {}

	public ngAfterViewInit() {
    if(this.canvas){
		const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
		this.appService.createPlayGround(canvasEl);
		this.subscription = this.appService.getImageLoadEmitter()
			.subscribe((item) => {
				this.showLoader = false;
				this.gameService.startGameLoop();
				this.readDetectors();
			});
    }
	}

	public readLabels():void{
		this.labels = [];
		if(this.gameService.p){
			this.labels.push(this.gameService.p.moveUP);
			this.labels.push(this.gameService.p.moveDown);
			this.labels.push(this.gameService.p.moveLeft);
			this.labels.push(this.gameService.p.moveRight);
		}
		for(let i=0; i<4; i++){
			if(this.labels[i]){
				this.isMove = true;
			}
		}
	}


	public readDetectors():void{
		this.detectorData = this.gameService.p?.detectors || [];
		setTimeout(() => {
			this.readDetectors();
			this.readLabels();
			if(this.isMove){
				this.lernData.push({vector:this.detectorData, label:this.labels});
			}
			if( this.gameService.p?.isCollision && !this.gameStops){
				console.log(this.lernData);
				window.localStorage.setItem('lernData'+this.getRandInt(0,1000), JSON.stringify(this.lernData));
				this.lernData = [];
				this.gameStops = true;
				//set random strng	

			}
		},100);
	}

	public getRandInt(min:number, max:number):number{	
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.appService.movePlayer(event, 'keydown');
	}

	@HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
		this.appService.movePlayer(event, 'keyup');
	}
}
