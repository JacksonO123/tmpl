import type {
  TmplFn,
  ContentsFn,
  State,
  CompUtil,
  ReplaceFn,
  ElFactory,
} from "./types";

export const elFactory = <T extends string>(elName: T) => {
  const getContents: ContentsFn = (tmplStr, states) => {
    let res: Node[] = [];
    let str = "";

    let i = 0;
    for (; i < states.length; i++) {
      if (tmplStr[i].length > 0) {
        str += tmplStr[i];
      }

      if ((states[i] as State<unknown>)._isState) {
        str += (states[i] as State<unknown>).value;
      } else if ((states[i] as Element).ELEMENT_NODE === Node.ELEMENT_NODE) {
        if (str.length > 0) {
          res.push(new Text(str));
          str = "";
        }

        res.push(states[i] as Node);
      } else if ((states[i] as CompUtil)._isComponent) {
        const compRes = (states[i] as CompUtil)();
        res.push(compRes);
      }
    }

    str += tmplStr[i];
    res.push(new Text(str));

    return res;
  };

  const replace: ReplaceFn = (el, str, states) => {
    const newContents = getContents(str, states);
    el.innerHTML = "";
    for (let i = 0; i < newContents.length; i++) {
      el.appendChild(newContents[i]);
    }
  };

  const fn: TmplFn = (str, ...states) => {
    const el = document.createElement(elName);

    const contents = getContents(str, states);
    for (let i = 0; i < contents.length; i++) {
      el.appendChild(contents[i]);
    }

    for (let i = 0; i < states.length; i++) {
      if ((states[i] as State<unknown>)._isState) {
        (states[i] as State<unknown>).onChange(() => replace(el, str, states));
      }
    }

    return el;
  };

  return fn;
};

const els = ["div", "h1", "span"] as const;
export const T = els.reduce(
  (acc, curr) => {
    acc[curr] = elFactory(curr);
    return acc;
  },
  {} as ElFactory<typeof els>,
);

export const createState = <T>(value: T): State<T> => {
  const obj: State<T> = {
    _isState: true,
    value,
    deps: [],
    onChange: function (fn) {
      (this as State<T>).deps.push(fn);
    },
    propagate: function () {
      (this as State<T>).deps.forEach((dep) => dep());
    },
  };

  obj.onChange.bind(null, obj);
  obj.propagate.bind(null, obj);

  return new Proxy(obj, {
    set(target, key, newValue) {
      target[key] = newValue;
      target.propagate();
      return true;
    },
    get(obj, key) {
      return obj[key];
    },
  });
};

export const render = (target: Element, root: Element, flush = false) => {
  if (flush) {
    target.innerHTML = "";
  }

  target.appendChild(root);
};
