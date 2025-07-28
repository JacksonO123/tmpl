export type State<T> = {
  _isState: true;
  value: T;
  deps: (() => void)[];
  onChange: (fn: () => void) => void;
  propagate: () => void;
};

export type CompUtil = { _isComponent: true } & (() => Element);
export type TmplFn = (
  str: TemplateStringsArray,
  ...states: (State<unknown> | Element | CompUtil)[]
) => Element;
export type ContentsFn = (
  str: TemplateStringsArray,
  states: (State<unknown> | Element | CompUtil)[],
) => Node[];
export type ReplaceFn = (
  el: Element,
  str: TemplateStringsArray,
  states: (State<unknown> | Element | CompUtil)[],
) => void;
export type CompFn = <T extends object>(
  comp: (props?: T) => () => Element,
  props?: T,
) => CompUtil;

export type ElFactory<T extends readonly string[]> = {
  [K in T[number]]: TmplFn;
};
