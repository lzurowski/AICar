import * as CONFIG from './../config/config';


export interface Point{
    x:number;
    y:number;
}
export interface TracCordinates{
    l:Point,
    r:Point,
}    

export class TrackBuilder {


    public tw:number = 100;

    protected ctx: CanvasRenderingContext2D;

    public constructor(ctx: CanvasRenderingContext2D)
    {
        this.ctx = ctx;
        this.tw = CONFIG.trackWidth;
    }



    public buildStraightVertical(t:TracCordinates, length:number):TracCordinates{
        //lewa lini
        this.ctx.moveTo(t.l.x, t.l.y);
        const el:Point = {x:t.l.x, y:t.l.y-length};
        this.ctx.lineTo(el.x, el.y);
        
        //prawa linia
        this.ctx.moveTo(t.r.x, t.r.y);
        const er:Point = {x:t.r.x, y:t.r.y-length};
        this.ctx.lineTo(er.x, er.y);
        
        return {
            l:el,
            r:er
        };
    }

    public buildStraightHorizonatl(t:TracCordinates, length:number):TracCordinates{
        //lewa lini
        this.ctx.moveTo(t.l.x, t.l.y);
        const el:Point = {x: t.l.x+length, y: t.l.y};
        this.ctx.lineTo(el.x, el.y);
        
        //prawa linia
        this.ctx.moveTo(t.r.x, t.r.y);
        const er:Point = {x:t.r.x+length, y:t.r.y};
        this.ctx.lineTo(er.x, er.y);
        
        return {
            l:el,
            r:er
        };
    }


    public buildTurn1(t:TracCordinates):TracCordinates{
        //lewa linia
        const el:Point = {
            x: t.l.x + this.tw, 
            y: t.l.y-this.tw
        };
        this.ctx.moveTo(t.l.x, t.l.y);
        this.ctx.arcTo(el.x, t.l.y, el.x, el.y ,100);
        
        //prawa linia
        this.ctx.moveTo(t.r.x, t.r.y); 
        const er:Point = {
            x: el.x + this.tw, 
            y: el.y
        };
        this.ctx.arcTo(er.x, t.r.y, er.x, er.y ,200);
        return {
            l:el,
            r:er
        };
    }


    public buildTurn2(t:TracCordinates ):TracCordinates{
        //lewa linia
        const el:Point = {
            x: t.l.x+this.tw, 
            y: t.l.y-2*this.tw
        };
        this.ctx.moveTo(t.l.x, t.l.y);
        this.ctx.arcTo(t.l.x, el.y, el.x, el.y ,200);
        el.x+=this.tw;

        
        //prawa linia
        const er:Point = {
            x: t.r.x+this.tw, 
            y: t.r.y-this.tw
        };
        this.ctx.moveTo(t.r.x, t.r.y); 
        this.ctx.arcTo(t.r.x, er.y, er.x, er.y ,100);
        
        return {
            l:el,
            r:er
        };
    }


    public buildTurn3(t:TracCordinates ):TracCordinates{
        //lewa linia
        const el:Point = {
            x: t.l.x-this.tw, 
            y: t.l.y-this.tw
        };
        this.ctx.moveTo(t.l.x, t.l.y);
        this.ctx.arcTo(t.l.x, el.y, el.x, el.y ,100);
        
        
        //prawa linia
        const er:Point = {
            x: t.r.x-this.tw, 
            y: t.r.y-2*this.tw
        };
        this.ctx.moveTo(t.r.x, t.r.y); 
        this.ctx.arcTo(t.r.x, er.y, er.x, er.y ,200);
        er.x-=this.tw;
        return {
            l:el,
            r:er
        };
    }

    public buildTurn4(t:TracCordinates ):TracCordinates{
        //lewa linia
        const el:Point = {
            x: t.l.x-this.tw, 
            y: t.l.y+this.tw
        };
        this.ctx.moveTo(t.l.x, t.l.y);
        this.ctx.arcTo(el.x, t.l.y, el.x, el.y ,100);
        
        //prawa linia
        const er:Point = {
            x: t.r.x-2*this.tw, 
            y: t.r.y+this.tw
        };
        this.ctx.moveTo(t.r.x, t.r.y); 
        this.ctx.arcTo(er.x, t.r.y, er.x, er.y ,200);
        er.y+=this.tw;
        return {
            l:el,
            r:er
        };
    }

    public buildTurn5(t:TracCordinates ):TracCordinates{
        //lewa linia
        const el:Point = {
            x: t.l.x+this.tw, 
            y: t.l.y+this.tw
        };
        this.ctx.moveTo(t.l.x, t.l.y);
        this.ctx.arcTo(t.l.x, el.y, el.x, el.y ,100);
        
        //prawa linia
        const er:Point = {
            x: t.r.x+2*this.tw, 
            y: t.r.y+2*this.tw
        };
        this.ctx.moveTo(t.r.x, t.r.y); 
        this.ctx.arcTo(t.r.x, er.y, er.x, er.y ,200);
        return {
            l:el,
            r:er
        };
    }

    public buildTurn6(t:TracCordinates ):TracCordinates{
        //lewa linia
        const el:Point = {
            x: t.l.x +2*this.tw, 
            y: t.l.y + this.tw,
        };
        this.ctx.moveTo(t.l.x, t.l.y); 
        this.ctx.arcTo(el.x, t.l.y, el.x, el.y ,200);
        el.y+=this.tw;
        //prawa linia
        const er:Point = {
            x: t.r.x+this.tw, 
            y: t.r.y+this.tw
        };
        this.ctx.moveTo(t.r.x, t.r.y);
        this.ctx.arcTo(er.x, t.r.y, er.x, er.y ,100);
      
        return {
            l:el,
            r:er
        };
    }

    public buildTurn7(t:TracCordinates ):TracCordinates{
        //lewa linia
        const el:Point = {
            x: t.l.x-2*this.tw, 
            y: t.l.y + 2*this.tw,
        };
        this.ctx.moveTo(t.l.x, t.l.y); 
        this.ctx.arcTo(t.l.x, el.y, el.x, el.y ,200);
        
        //prawa linia
        const er:Point = {
            x: t.r.x-this.tw, 
            y: t.r.y+this.tw
        };
        this.ctx.moveTo(t.r.x, t.r.y);
        this.ctx.arcTo(t.r.x, er.y, er.x, er.y ,100);
      
        return {
            l:el,
            r:er
        };
    }

    public buildTurn8(t:TracCordinates ):TracCordinates{
        //lewa linia
        const el:Point = {
            x: t.l.x-2*this.tw, 
            y: t.l.y - 2*this.tw,
        };
        this.ctx.moveTo(t.l.x, t.l.y); 
        this.ctx.arcTo(el.x, t.l.y, el.x, el.y ,200);
        
        //prawa linia
        const er:Point = {
            x: t.r.x-this.tw, 
            y: t.r.y-this.tw
        };
        this.ctx.moveTo(t.r.x, t.r.y);
        this.ctx.arcTo(er.x, t.r.y, er.x, er.y ,100);
      
        return {
            l:el,
            r:er
        };
    }


    /**
     * Buduje tor z początkowych parametrów na podstawie przełanej tablicy zakrętów
     * @param trackStart 
     * @param track 
     */
    public buildTrack( trackStart:TracCordinates, track:Array<string>){
            let trackEnd:TracCordinates = trackStart;  
			this.ctx.beginPath();
            for(let i=0; i < track.length; i++){

                // t1, t2, t3, t4, t5, t6, t7, t8, vt100, vd100, hr100, hl100
                const key:string = track[i];

                //console.log(key);

                switch(key[0]){
                    case 't':{
                        switch(key[1]){
                            case '1':{
                                trackEnd = this.buildTurn1(trackEnd);
                                break;
                            }   
                            case '2':{
                                trackEnd = this.buildTurn2(trackEnd);                            
                                break;
                            }case '3':{
                                trackEnd = this.buildTurn3(trackEnd);
                                break;
                            }case '4':{
                                trackEnd = this.buildTurn4(trackEnd);
                                break;
                            }case '5':{
                                trackEnd = this.buildTurn5(trackEnd);
                                break;
                            }case '6':{
                                trackEnd = this.buildTurn6(trackEnd);
                                break;
                            }
                            case '7':{
                                trackEnd = this.buildTurn7(trackEnd);
                                break;
                            }
                            case '8':{
                                trackEnd = this.buildTurn8(trackEnd);
                                break;
                            }
                        }
                        break;
                    }
                    case 'v':{
                        //left
                        let l: number = 0;                    
                        if(key[1] === 't'){
                            let s:String = new String(key).replace('vt','');
                             l = Number.parseInt(s.valueOf());
                        }else{//right
                            let s:String = new String(key).replace('vd','');
                            l = Number.parseInt(s.valueOf()) * -1;
                        }
                        trackEnd = this.buildStraightVertical(trackEnd, l);	
                        break;
                    }
                    case 'h':{
                        //left
                        let l: number = 0;                    
                        if(key[1] === 'l'){
                            let s:String = new String(key).replace('hl','');
                            l = Number.parseInt(s.valueOf()) *-1;
                        }else{//right
                            let s:String = new String(key).replace('hr','');
                            l = Number.parseInt(s.valueOf());
                        }
                        trackEnd = this.buildStraightHorizonatl(trackEnd, l);	
                        break;
                    }
                }
            }
            this.ctx.strokeStyle = '#8B0000';
			this.ctx.stroke();
    }


}