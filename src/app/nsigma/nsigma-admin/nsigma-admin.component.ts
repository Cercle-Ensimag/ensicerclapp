import {Component, OnDestroy, OnInit} from '@angular/core';
import {NsigmaAnnonce, NsigmaService} from '../nsigma.service';
import {DicoService} from '../../language/dico.service';
import {ToolsService} from '../../providers/tools.service';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../shared-components/delete-dialog/delete-dialog.component';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-nsigma-admin',
  templateUrl: './nsigma-admin.component.html',
  styleUrls: ['./nsigma-admin.component.css']
})
export class NsigmaAdminComponent implements OnInit, OnDestroy {

  constructor(
    public nsigma: NsigmaService,
    public d: DicoService,
    private tools: ToolsService,
  ) {}

  ngOnInit() {
    this.nsigma.start();
  }

  ngOnDestroy() {
    this.nsigma.stop();
  }

}
