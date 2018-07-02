export class Message 
{
  message:      		string;
  moreInfo:     		string;
  type:         		string;
  closable:     		boolean;
  dismissTimeout: 	number;
	
	constructor() 
	{
		this.closable = true;
		this.dismissTimeout = 0;
	}
}
