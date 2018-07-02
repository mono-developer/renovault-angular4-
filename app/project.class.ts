export class ProjectPhase
{
	general:	boolean;
	preparation:boolean;
	execution: 	boolean;
	handover:	boolean;

	constructor()
	{
		this.general = false;
		this.preparation = false;
		this.execution = false;
		this.handover = false;
	}
}

export class Project 
{
  id: 		    number;
  name:         string;
  description:  string;
  type:         string;
  startdate:    Date;
  enddate:      Date;
  phase:		ProjectPhase;

  constructor()
  {
  	this.phase = new ProjectPhase();
  }

}

