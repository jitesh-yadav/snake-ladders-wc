import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavePiComponent } from './save-pi/save-pi.component';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    SavePiComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ]
})
export class SavePiModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const savePiComponent = createCustomElement(SavePiComponent, {
      injector: this.injector,
    });

    customElements.define('save-pi', savePiComponent);
  }
}
