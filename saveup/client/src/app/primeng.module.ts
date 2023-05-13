import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RippleModule } from "primeng/ripple";
import { ButtonModule } from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {AccordionModule} from "primeng/accordion";
import {PanelModule} from "primeng/panel";
import {OverlayModule} from "primeng/overlay";
import {MenuModule} from "primeng/menu";

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
    CardModule,
    TableModule,
    OverlayModule,
    MenuModule
  ]
})
export class PrimengModule { }
