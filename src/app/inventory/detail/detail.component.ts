import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params, ParamMap, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class DetailComponent  implements OnInit {
	public id: number | undefined;
	public itemTitle?: string;
	public imageSource?: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
	  this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
	  switch(this.id)
	  {
		  case (1):
	  this.itemTitle = 'Auto Chocolate Skunk';
	  this.imageSource = 'https://growdiaries.com/static/seed_item_photos/1803/7-auto-chocolate-skunk.jpg';
	  break;
	  case (2):
	  this.itemTitle = 'Auto Northern Lights';
	  this.imageSource = 'https://growdiaries.com/static/seed_item_photos/1804/8-auto-northern-lights.jpg';
	  break;
  }
	  //1 https://growdiaries.com/static/seed_item_photos/1803/7-auto-chocolate-skunk.jpg 
  }

}
