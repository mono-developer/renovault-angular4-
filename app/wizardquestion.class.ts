export class WizardQuestion {
  id: number;
  parent: number;
  question: number;
  text: string;
  type: string;
  image: string;
  display: string;
  navigation_answers: WizardQuestion[];
  sort: string;
  no_of_questions: number;
  no_of_answers: number;
  normalized_no_of_questions: number;
  normalized_no_of_answers: number;
  stateclassname: string;
  lastmaintenance: number;
  nextmaintenance: number;
}