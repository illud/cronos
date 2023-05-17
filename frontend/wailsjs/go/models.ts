export namespace models {
	
	export class WeekDay {
	    yesterday: string;
	    today: string;
	
	    static createFrom(source: any = {}) {
	        return new WeekDay(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.yesterday = source["yesterday"];
	        this.today = source["today"];
	    }
	}
	export class Datas {
	    countOne: number;
	    countTwo: number;
	    countThree: number;
	    countFour: number;
	    countFive: number;
	    countSix: number;
	    countSeven: number;
	
	    static createFrom(source: any = {}) {
	        return new Datas(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.countOne = source["countOne"];
	        this.countTwo = source["countTwo"];
	        this.countThree = source["countThree"];
	        this.countFour = source["countFour"];
	        this.countFive = source["countFive"];
	        this.countSix = source["countSix"];
	        this.countSeven = source["countSeven"];
	    }
	}
	

}

