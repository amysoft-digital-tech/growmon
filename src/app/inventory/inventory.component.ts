import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import * as localMasterJson from '../../assets/data/master.json';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class InventoryComponent  implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {}
  
  editInventoryItem(bin: any,id: number) {
	  alert(bin+' '+id);
	  this.router.navigate(['/inventory/detail/'+bin+'/'+id]);
  }
     
  deleteInventoryItem(){
	  alert('Disabled in dev');
  }
  
  addNewInventoryItem()
  {
	  alert('Disabled In Dev!');
  }

}
