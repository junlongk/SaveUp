import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RippleModule } from "primeng/ripple";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DividerModule } from "primeng/divider";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { OverlayModule } from "primeng/overlay";
import { MenuModule } from "primeng/menu";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputNumberModule } from "primeng/inputnumber";

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
    InputNumberModule,
    DividerModule,
    CardModule,
    TableModule,
    OverlayModule,
    MenuModule,
    ToastModule,
    ConfirmDialogModule
  ]
})
export class PrimengModule { }
