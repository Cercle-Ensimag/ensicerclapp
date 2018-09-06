import {Component, OnInit} from '@angular/core';
import {NsigmaService} from '../nsigma.service';
import {DicoService} from '../../language/dico.service';
import {ToolsService} from '../../providers/tools.service';

@Component({
  selector: 'app-nsigma-admin',
  templateUrl: './nsigma-admin.component.html',
  styleUrls: ['./nsigma-admin.component.css']
})
export class NsigmaAdminComponent implements OnInit {

  constructor(
    public nsigma: NsigmaService,
    public d: DicoService,
    public tools: ToolsService,
  ) {}

  ngOnInit() { }

}
