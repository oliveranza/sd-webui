export class ToastModel {
  constructor(init?: Partial<ToastModel>) {
    Object.assign(this, init);
  }

  type: string | 'success' | 'error' | 'info' | 'warning' = 'info';
  title: string = '';
  message: string = '';
  visible: boolean = false;
  topOffset: number = 0;
}
