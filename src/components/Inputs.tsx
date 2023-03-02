import { Setter, Component, onMount, onCleanup, createSignal, splitProps, mergeProps } from "solid-js";
import { JSX } from "solid-js";

function clamp(min: number, max: number, val: number) {
  return Math.max(min, Math.min(max, val));
}

interface RangeProps {
  left: number,
  setLeft: Setter<number>,
  right: number,
  setRight: Setter<number>,
  min?: number,
  max?: number,
  step?: number
}

const sliderDefaultProps = {
  min: 0,
  max: 100,
  step: 1
}

const RangeSlider: Component<RangeProps> = (p) => {
  const props = mergeProps(sliderDefaultProps, p);

  const [hovering, setHovering] = createSignal(false);
  const sliderColor = () => (hovering() ? "bg-teal-600" : "bg-teal-500")

  const range = props.max - props.min;
  const leftKnobPos = () => (clamp(props.min, props.max, props.left) - props.min) / range;
  const rightKnobPos = () => (clamp(props.min, props.max, props.right) - props.min) / range;

  let slider!: HTMLDivElement;
  let leftKnob!: HTMLDivElement;
  let rightKnob!: HTMLDivElement;

  function getValueFromKnobPosition(clientX: number): number {
    const rect = slider.getBoundingClientRect();
    const rel = clientX - rect.left;
    const sliderWidth = rect.width;
    const val = clamp(props.min, props.max, (rel / sliderWidth) * range + props.min);
    if (props.step) {
      return val - val % props.step;
    } else {
      return val;
    }
  }

  function moveLeftKnob(e: MouseEvent) {
    props.setLeft(Math.min(props.right, getValueFromKnobPosition(e.clientX)));
  }

  function moveRightKnob(e: MouseEvent) {
    props.setRight(Math.max(props.left, getValueFromKnobPosition(e.clientX)));
  }

  function onHold(e: MouseEvent) {
    // Find closer knob
    const leftRect = leftKnob.getBoundingClientRect();
    const distLeft = Math.abs(leftRect.left + leftRect.width / 2 - e.clientX);
    const rightRect = rightKnob.getBoundingClientRect();
    const distRight = Math.abs(rightRect.left + rightRect.width / 2 - e.clientX);
    if (distLeft < distRight) {
      onLeftKnobHold();
      moveLeftKnob(e);
    } else {
      onRightKnobHold();
      moveRightKnob(e);
    }
  }

  function onLeftKnobHold() {
    document.addEventListener('mousemove', moveLeftKnob);
  }

  function onRightKnobHold() {
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
        style={{ "width": "calc(100% - 1rem)" }}
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
        onMouseDown={onHold}
      >
        <div
          class={"rounded-full h-full absolute " + sliderColor()}
          style={{ "width": `calc(100% - ${leftKnobPos() * 100}% - ${100 - rightKnobPos() * 100}%)`, "left": `${leftKnobPos() * 100}%` }} />
        <div
          ref={leftKnob}
          class={"rounded-full w-4 h-4 -top-1 absolute " + sliderColor()}
          style={{ left: `calc(${leftKnobPos() * 100}% - 0.5rem)` }} />
        <div
          ref={rightKnob}
          class={"rounded-full w-4 h-4 -top-1 absolute " + sliderColor()}
          style={{ left: `calc(${rightKnobPos() * 100}% - 0.5rem)` }} />
      </div>
    </div>
  );
}


const RangeDetailed: Component<RangeProps & { name: string }> = (p) => {
  const props = mergeProps(sliderDefaultProps, p);

  return (
    <div class="p-2 flex items-center justify-between">
      <div class="align-start">
        <p class="inline mr-2">{props.name}</p>
      </div>
      <div class="align-end flex items-center gap-2">
        <RangeSlider {...props} />
        <NumberInput
          value={props.left}
          step={props.step}
          max={props.right}
          onChange={(e) => { props.setLeft(parseFloat(e.currentTarget.value)) }}
          class="w-20" />
        <p>to</p>
        <NumberInput
          value={props.right}
          step={props.step}
          min={props.left}
          onChange={(e) => { props.setRight(parseFloat(e.currentTarget.value)) }}
          class="w-20" />
      </div>
    </div>
  )
}


interface SliderProps {
  value: number,
  setValue: Setter<number>,
  min?: number,
  max?: number,
  step?: number
}

const NumberSlider: Component<SliderProps> = (p) => {
  const props = mergeProps(sliderDefaultProps, p);

  const [hovering, setHovering] = createSignal(false);
  const sliderColor = () => (hovering() ? "bg-teal-600" : "bg-teal-500")

  const range = props.max - props.min;
  const knobPos = () => (clamp(props.min, props.max, props.value) - props.min) / range;

  let slider!: HTMLDivElement;
  let knob!: HTMLDivElement;

  function getValueFromKnobPosition(clientX: number): number {
    const rect = slider.getBoundingClientRect();
    const rel = clientX - rect.left;
    const sliderWidth = rect.width;
    const val = clamp(props.min, props.max, (rel / sliderWidth) * range + props.min);
    if (props.step) {
      return val - val % props.step;
    } else {
      return val;
    }
  }

  function moveKnob(e: MouseEvent) {
    props.setValue(getValueFromKnobPosition(e.clientX));
  }


  function onHold(e: MouseEvent) {
    onKnobHold();
    moveKnob(e)
  }

  function onKnobHold() {
    document.addEventListener('mousemove', moveKnob);
  }

  function removeEventListeners() {
    document.removeEventListener('mousemove', moveKnob);
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
        style={{ "width": "calc(100% - 1rem)" }}
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
        onMouseDown={onHold}
      >
        <div
          class={"rounded-full h-full absolute " + sliderColor()}
          style={{ "width": `${knobPos() * 100}%` }} />
        <div
          ref={knob}
          class={"rounded-full w-4 h-4 -top-1 absolute " + sliderColor()}
          style={{ left: `calc(${knobPos() * 100}% - 0.5rem)` }} />
      </div>
    </div>
  );
}

const NumberDetailed: Component<SliderProps & { name: string }> = (p) => {
  const props = mergeProps(p);

  return (
    <div class="p-2 flex items-center justify-between">
      <div class="align-start">
        <p class="inline mr-2">{props.name}</p>
      </div>
      <div class="align-end flex items-center gap-2">
        <NumberSlider {...props} />
        <NumberInput
          value={props.value}
          step={props.step}
          onChange={(e) => { props.setValue(parseFloat(e.currentTarget.value)) }}
          class="w-20" />
      </div>
    </div>
  )
}

const NumberInput: Component<JSX.InputHTMLAttributes<HTMLInputElement>> = (p) => {
  const [local, rest] = splitProps(p, ["class", "type"]);

  return (
    <input
      type="number"
      class={"outline-none p-1 rounded-md focus:outline-2 focus:outline-teal-500 focus:bg-[#14b8a611] bg-[#14b8a617] " + local.class}
      {...rest}
    />
  )
}


interface ProbabilityInputProps {
  leftBound: number,
  setLeftBound: Setter<number>,
  rightBound: number,
  setRightBound: Setter<number>,
  result: number
}

const ProbabilityInput: Component<JSX.HTMLAttributes<HTMLDivElement> & ProbabilityInputProps> = (p) => {
  const [local, rest] = splitProps(p, ["leftBound", "setLeftBound", "rightBound", "setRightBound", "result"]);

  return (
    <div {...rest}>
      <span>P(</span>
      <NumberInput class="w-20 mx-1" step={0.01} value={local.leftBound} onChange={(e) => { local.setLeftBound(parseFloat(e.currentTarget.value)) }} />
      <span> &lt; X &lt; </span>
      <NumberInput class="w-20 mx-1" step={0.01} value={local.rightBound} onChange={(e) => { local.setRightBound(parseFloat(e.currentTarget.value)) }} />
      <span>) = {local.result.toPrecision(4)}</span>
    </div>
  )
}


export { RangeSlider, RangeDetailed, NumberSlider, NumberDetailed, ProbabilityInput };