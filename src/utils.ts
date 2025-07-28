import type { CompFn, CompUtil } from "./types";

export const Comp: CompFn = (fn, props) => {
  const tmplFn = fn(props);
  const res = function () {
    return tmplFn();
  } as CompUtil;
  res._isComponent = true;

  return res;
};
