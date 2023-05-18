import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ToastModel } from './toast.model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnChanges {
  public toastList: ToastModel[] = [];
  @Input() toast: ToastModel = {} as ToastModel;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toast'] && !changes['toast'].isFirstChange()) {
      const x =
        this.toastList.length > 0 ? this.toastList[this.toastList.length - 1].topOffset + 80 : 1;
      this.toast.topOffset = x;
      this.toastList.push(this.toast);

      this.setToastPosition(x);
      this.selfDestruct();
    }
  }

  setToastPosition(bottom: number) {
    setTimeout(() => {
      const ele = document.querySelector(`.toast-${this.toastList.length - 1}`) as HTMLElement;
      ele.style.bottom = `${bottom}px`;
    }, 0);
  }

  selfDestruct() {
    setTimeout(() => {
      this.toastList.shift();
    }, 5000);
  }
}
