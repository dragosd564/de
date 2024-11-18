import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { environment } from './env/env';

if (environment.production) {
  window.console.log = () => { }
  window.console.table = () => { }
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
