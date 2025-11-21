import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, Injectable } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { GoogleMapsModule } from '@angular/google-maps';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouteReuseStrategy } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class NoReuseSameRouteStrategy extends RouteReuseStrategy {
  override shouldReuseRoute(future: any, curr: any): boolean { return false; }
  override shouldDetach(): boolean { return false; }
  override store(): void {}
  override shouldAttach(): boolean { return false; }
  override retrieve(): any { return null; }
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    { provide: RouteReuseStrategy, useClass: NoReuseSameRouteStrategy },
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      GoogleMapsModule,
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatDialogModule,
      MatSnackBarModule,
      MatProgressSpinnerModule
    )
  ]
};
