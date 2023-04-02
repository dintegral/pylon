import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  PreloadAllModules,
  withPreloading,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
