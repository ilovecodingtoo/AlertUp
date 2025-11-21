import { Routes } from '@angular/router';
import { MapsComponent } from './components/maps/maps.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AlertFormComponent } from './components/alert-form/alert-form.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';


export const routes: Routes = [
    { path: '', component: MapsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'alert-form', component: AlertFormComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'general-settings', component: GeneralSettingsComponent },
    { path: 'account-settings', component: AccountSettingsComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent }
];
