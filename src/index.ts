import { T, createState, render } from "./core";
import { Comp } from "./utils";

const component = () => {
  const innerState = createState("a");

  // setTimeout(() => {
  //   innerState.value += 'a';
  // }, 1000);

  return () => T.div`in component ${innerState}`;
};

const state = createState(2);

const root = T.div`
hi ${state} .
${T.span`here`}
${Comp(component)}`;

// setTimeout(() => {
//   state.value = 4;
// }, 500);

render(document.body, root);
