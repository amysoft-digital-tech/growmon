import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import * as localMasterJson from '../../assets/data/master.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class DashboardComponent  implements OnInit {
  applicationData: any = (localMasterJson as any).default;
  
  constructor() { }

  ngOnInit() {}

}
