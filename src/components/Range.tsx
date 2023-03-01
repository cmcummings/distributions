import { Accessor, Setter, Component, onMount, onCleanup, createEffect } from "solid-js";

function clamp(min: number, max: number, val: number) {
  return Math.max(min, Math.min(max, val));
}

const Range: Component<{
  left: Accessor<number>,
  setLeft: Setter<number>,
  right: Accessor<number>,
  setRight: Setter<number>,
  min?: number,
  max?: number,
  step?: number  
}> = ({ left, setLeft, right, setRight, min = 0, max = 1, step = 0.05 }) => {
  const range = max - min;
  const leftKnobPos = () => (clamp(min, max, left()) - min) / range;
  const rightKnobPos = () => (clamp(min, max, right()) - min) / range;

  let slider!: HTMLDivElement;
 
  function getValueFromKnobPosition(clientX: number): number {
    const rect = slider.getBoundingClientRect();
    const rel = clientX - rect.left;
    const sliderWidth = rect.width;
    const val = clamp(min, max, (rel / sliderWidth) * range + min);
    if (step) {
      return val - val % step;
    } else {
      return val;
    }
  }  

  function moveLeftKnob(e: MouseEvent) {
    setLeft(Math.min(right() - step, getValueFromKnobPosition(e.clientX)));
  }

  function moveRightKnob(e: MouseEvent) {
    setRight(Math.max(left() + step, getValueFromKnobPosition(e.clientX)));
  }

  createEffect(() => {
    // console.log(left(), right());
  })

  function onLeftKnobHold(e: MouseEvent) {
    document.addEventListener('mousemove', moveLeftKnob);
  }
  
  function onRightKnobHold(e: MouseEvent) {
    document.addEventListener('mousemove', moveRightKnob);
  }

  function removeEventListeners() {
    document.removeEventListener('mousemove', moveLeftKnob);
    document.removeEventListener('mousemove', moveRightKnob);
  }

  onMount(() => {
    document.addEventListener('mouseup', removeEventListeners);
  });

  onCleanup(() => {
    document.removeEventListener('mouseup', removeEventListeners); 
  });

  return (
    <div class="inline-block w-48 h-4 relative" ref={slider}>
      <div 
        ref={slider} 
        class="bg-gray-300 rounded-full h-2 top-1 left-2 absolute" 
        style={{"width": "calc(100% - 1rem)"}}>
        <div 
          class="bg-teal-500 rounded-full h-full absolute" 
          style={{"width": `calc(100% - ${leftKnobPos()*100}% - ${100-rightKnobPos()*100}%)`, "left": `${leftKnobPos()*100}%`}}/>
        <div 
          onmousedown={onLeftKnobHold} 
          class="bg-teal-500 rounded-full w-4 h-4 -top-1 absolute"
          style={{ left: `calc(${leftKnobPos()*100}% - 0.5rem)` }}/>
        <div 
          onmousedown={onRightKnobHold} 
          class="bg-teal-500 rounded-full w-4 h-4 -top-1 absolute"
          style={{ left: `calc(${rightKnobPos()*100}% - 0.5rem)` }}/> 
       </div> 
    </div>
  );
}

export { Range };