import {Component, OnDestroy, OnInit} from '@angular/core';
import {DicoService} from '../../language/dico.service';
import {ToolsService} from '../../providers/tools.service';
import {NsigmaService} from '../nsigma.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-nsigma-home',
  templateUrl: './nsigma-home.component.html',
  styleUrls: ['./nsigma-home.component.css']
})
export class NsigmaHomeComponent implements OnInit, OnDestroy {

  constructor(
    public nsigma: NsigmaService,
    public d: DicoService,
    private tools: ToolsService,
    private location: Location
  ) { }

  ngOnInit() {
    this.nsigma.start();
  }

  ngOnDestroy() {
    this.nsigma.stop();
  }

}
