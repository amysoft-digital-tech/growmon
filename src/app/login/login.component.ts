import { Component, OnInit } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [IonicModule, CommonModule],
  styleUrls: ['./login.component.scss'],
  standalone: true,
})
export class LoginComponent  implements OnInit {
  constructor(private menuController: MenuController) {}

  ngOnInit() { 
    this.menuController.enable(false);
  }

  public login() {
    
  }

}
