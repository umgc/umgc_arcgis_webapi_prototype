import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AppDialogMapSelectionComponent } from './map-selection.dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { AddressLocatorService } from './address-locator.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../src/environments/environment';

@NgModule({
    declarations: [AppComponent, AppDialogMapSelectionComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        HttpClientModule,
    ],
    entryComponents: [AppDialogMapSelectionComponent],
    providers: [
        AddressLocatorService,
        { provide: 'BACKEND_API_URL', useValue: environment.backendApiUrl },
        { provide: 'DEFAULT_LANGUAGE', useValue: environment.defaultLanguage },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
