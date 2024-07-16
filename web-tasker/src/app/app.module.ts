import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebReqInterceptor } from './helpers/web-req.interceptor';
import { NgInitDirective } from './load-directive';

@NgModule({ declarations: [
        AppComponent,
        NgInitDirective
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        //material imports
        AngularMaterialModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {}
