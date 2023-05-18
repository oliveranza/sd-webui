import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ModalComponent } from "./modal/modal.component";
import { ToastComponent } from "./toast/toast.component";

@NgModule({
  declarations: [
    ModalComponent,
    ToastComponent
  ],
  imports:[
    CommonModule,
    MatIconModule
  ],
  exports: [
    ModalComponent,
    ToastComponent
  ]
})
export class SharedModule{}