import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() public img = './../../assets/loader19.gif';

}
