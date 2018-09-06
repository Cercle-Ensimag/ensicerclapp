import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import {DicoService} from '../../language/dico.service';
import {Actu, ActusService} from '../actus-service/actus.service';

@Component({
  selector: 'app-actu',
  templateUrl: './actu.component.html',
  styleUrls: ['./actu.component.css']
})
export class ActuComponent implements OnInit {
  public id: string;

  constructor(
    private route: ActivatedRoute,
	  private sanitizer: DomSanitizer,

    public location: Location,
    public actus: ActusService,
    public d: DicoService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  safeUrl(actu: Actu): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(actu.pdfLink);
  }
}
