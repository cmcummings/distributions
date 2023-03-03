import { Component } from "solid-js";



const DividerH: Component = () => {
  return <div class="border-t border-gray-200 w-full my-4" />;
}

const DividerV: Component = () => {
  return <div class="inline border-1 border-l border-gray-300" />
;
}

export { DividerH, DividerV };