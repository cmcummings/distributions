import { Component } from "solid-js";



const DividerH: Component = () => {
  return <div class="border-t border-gray-200 w-full my-4" />;
}

const DividerV: Component = () => {
  return <div class="border-l border-gray-200 h-full mx-4" />;
}

export { DividerH, DividerV };