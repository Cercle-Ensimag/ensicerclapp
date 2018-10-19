import {Component} from '@angular/core';
import {DicoService} from '../../language/dico.service';
import {CafetService} from '../cafet-service/cafet.service';

@Component({
  selector: 'app-cafet-admin',
  templateUrl: './cafet-admin.component.html',
  styleUrls: ['./cafet-admin.component.css']
})
export class CafetAdminComponent {

	public index=0;
	
  constructor(
    public cafet: CafetService,
    public d: DicoService
  ) { }

}
