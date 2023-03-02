import { Accessor, Component, createEffect, mergeProps } from "solid-js";

type Function2D = (x: number) => number;

enum FunctionType { Discrete, Continuous }

/**
 * Draws a light grey line from (x1, y1) to (x2, y2) 
 */
function drawGridLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.strokeStyle = "#888888";
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

/**
 * Draws a grid and the function f to the canvas. 
 * @param ctx The context of the canvas to be drawn on. 
 * @param f The function to be drawn.
 * @param funcType The type of function, Discrete or Continuous. 
 * @param options Graphing options.
 */
function drawFunction(
  ctx: CanvasRenderingContext2D,
  f: Function2D, // The function to be drawn, which takes a single variable, x
  funcType: FunctionType, // The type of function, which affects how it is drawn
  options: {
    step: number, // The intervals at which the function will be calculated
    domain: [number, number] // The domain the function will be drawn at, inclusive
    range: [number, number] // The range the function will be drawn at, inclusive
  }
) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const [xBegin, xEnd] = options.domain;
  const [yBegin, yEnd] = options.range;
  const xSpread = xEnd - xBegin;
  const ySpread = yEnd - yBegin;

  // Draw grid

  // Draw y-axis if visible
  if (xBegin <= 0 && xEnd >= 0) {
    const cx = -xBegin / xSpread * canvasWidth;
    drawGridLine(ctx, cx, 0, cx, canvasHeight);
  }

  // Draw x-axis if visible
  if (yBegin <= 0 && yEnd >= 0) {
    const cy = canvasHeight - (-yBegin / ySpread * canvasHeight);
    drawGridLine(ctx, 0, cy, canvasWidth, cy);
  }

  // Draw function
  switch (funcType) {
    case FunctionType.Discrete:      
      ctx.fillStyle = "black";
      for (let x = xBegin; x <= xEnd; x += options.step) {
        const y = f(x);
        const cx = (x - xBegin) / xSpread * canvasWidth;
        const cHeight = (y - yBegin) / ySpread * canvasHeight;
        const cy = canvasHeight - cHeight;
        ctx.fillRect(cx - 2, cy, 4, cHeight);
      }
      break;
    case FunctionType.Continuous:
      ctx.strokeStyle = "#14b8a6"
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = xBegin; x <= xEnd; x += options.step) {
        const y = f(x);
        const cx = (x - xBegin) / xSpread * canvasWidth;
        const cHeight = (y - yBegin) / ySpread * canvasHeight;
        const cy = canvasHeight - cHeight;
        if (x == xBegin) {
          ctx.moveTo(cx, canvasHeight); // To prevent weird fills when the domain doesn't include the entire distribution
          ctx.lineTo(cx, cy);
        } else {
          ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();
      ctx.closePath(); // Go to first point to create fill shape
      ctx.fill();
      break;
  }
}

const Graph: Component<{
  width: number, // The width of the canvas
  height: number, // The height of the canvas
  domain: [number, number],
  range: [number, number],
  func: Function2D
}> = (p) => {
  const props = mergeProps(p);
  
  let canvas!: HTMLCanvasElement;

  createEffect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context failed to load");
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, props.width, props.height);

    // Draw background
    // ctx.fillStyle = "#eeeeee";
    // ctx.fillRect(0, 0, props.width, props.height);

    // Draw function
    drawFunction(ctx, props.func, FunctionType.Continuous, {
      step: 0.05,
      domain: [props.domain[0], props.domain[1]],
      range: [props.range[0], props.range[1]],
    });
  });

  return <canvas ref={canvas} width={props.width} height={props.height} />;
}

export default Graph;