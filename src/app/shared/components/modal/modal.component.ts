import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { vi } from 'date-fns/locale';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnChanges{
  
  @Input() public img = './../../../../assets/0003.png';
  @Input() public visible = false;
  @Output() public onClose = new EventEmitter()
  private body: any;
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['visible'] && this.visible === true){
      // this.body = document.querySelector('body') as HTMLElement
      // this.body.style.overflow = 'hidden';
    }
  }
  
  fechar(){
    // this.body.style.overflow = '';
    this.onClose.emit(true);
  }

}
