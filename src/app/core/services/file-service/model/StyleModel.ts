export class StyleModel {
  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }

  name?: string;
  prompt?: string;
  negative_prompt?: string;
}
