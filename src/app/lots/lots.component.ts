import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as localMasterJson from '../../assets/data/master.json';


@Component({
  selector: 'app-lots',
  templateUrl: './lots.component.html',
  styleUrls: ['./lots.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class LotsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  
  addNewLotItem(){
  }

}
