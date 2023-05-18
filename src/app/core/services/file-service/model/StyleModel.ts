export class StyleModel {
  constructor(init?: Partial<StyleModel>) {
    Object.assign(this, init);
  }

  name?: string;
  prompt?: string;
  negative_prompt?: string;
}
