import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
		IonicModule.forRoot({
			mode: 'ios'
		}),
		ServiceWorkerModule.register('./ngsw-worker.js', { enabled: true, registrationStrategy: 'registerImmediately' }),
    ),
    provideRouter(routes)
],
});
