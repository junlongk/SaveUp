import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RippleModule } from "primeng/ripple";
import { ButtonModule } from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    BrowserAnimationsModule,
    RippleModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    CardModule
  ]
})
export class PrimengModule { }
