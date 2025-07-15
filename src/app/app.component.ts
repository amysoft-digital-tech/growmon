  import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SwPush, SwUpdate, ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
	  CommonModule,
	  IonicModule,
    HttpClientModule,
	  RouterLink, 
	  RouterLinkActive
  ],
})
export class AppComponent {
  public publicKey = "BDj5krSGA-G_sn9tg7rHhLmLob-lio_o54MFZtACs0c27QwMpVr1giLr_cuJkgFiA_Oj9q4hXcPxEJPuKH7pX80";
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'mail' },
    { title: 'Inventory', url: '/inventory', icon: 'paper-plane' },
    { title: 'Lots', url: '/lots', icon: 'heart' },
    { title: 'Germination', url: '/germination', icon: 'archive' },
    { title: 'Starts', url: '/starts', icon: 'trash' },
    { title: 'Grows', url: '/grows', icon: 'warning' },
    { title: 'Clones', url: '/clones', icon: 'warning' },
    { title: 'Harvests', url: '/harvests', icon: 'warning' },
    { title: 'Drying', url: '/drying', icon: 'warning' },
    { title: 'Curing', url: '/curing', icon: 'warning' },
  ];
  public labels = ['University', 'Reports', 'Accounts', 'Notes', 'Expenses', 'Nurtrients', 'Automation', 'Environments', 'Lighting'];
  constructor(private swPush: SwPush, private swUpdate: SwUpdate, private http: HttpClient) {

  }
  ionViewDidLoad() {
	if (!this.swPush.isEnabled) {
      console.log('Notifications is not enabled.');
      return;
    } else {
		this.pushSubscription();
	}
    if(this.swUpdate.isEnabled){
		this.swUpdate.checkForUpdate();
    }
  }
  
  refreshApp() {
	  console.log('refreshing app');
	  this.swUpdate.checkForUpdate();
	  location.reload();
  }
  
  pushSubscription() {
    

    
    this.swPush
    .requestSubscription({ serverPublicKey: this.publicKey })
    .then(async (subscription) => {
      // send subscription to the server
      // this.service.sendSubscriptionToTheServer(subscription).subscribe();
      
      const results = await this.http.post('https://api.amysoft.tech/growmon/subscriptions', subscription).toPromise();
      console.log('subscribed :'+results);
      
    })
    .catch((error) => console.log(error));
  }
  
  pushMessage() {
	  console.log('push a message');
  }

  async pushUnsubscribe() {
    const subscription = await this.swPush.subscription.toPromise();

    if (subscription) {
      await subscription.unsubscribe();      
    } else {
      console.log('subscription not found');
    }
  }

}
