import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakeLaddersComponent } from './snake-ladders/snake-ladders.component';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    SnakeLaddersComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ]
})
export class SnakeLaddersModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const snakeLaddersComponent = createCustomElement(SnakeLaddersComponent, {
      injector: this.injector,
    });

    customElements.define('snake-ladders', snakeLaddersComponent);
  }
}
