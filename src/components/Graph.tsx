import { Accessor, Component, createEffect, mergeProps } from "solid-js";

export enum FunctionType { Discrete, Continuous }

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

const STROKE = "#14b8a6";
const FILL = "#14b8a6";
const FILL_TRANSPARENT = "#14b8a644";

/**
 * Draws a grid and the function f to the canvas. 
 * @param ctx The context of the canvas to be drawn on. 
 * @param f The function to be drawn.
 * @param funcType The type of function, Discrete or Continuous. 
 * @param options Graphing options.
 */
function drawFunction(
  ctx: CanvasRenderingContext2D,
  f: (x: number) => number, // The function to be drawn, which takes a single variable, x
  funcType: FunctionType, // The type of function, which affects how it is drawn
  options: {
    step: number, // The intervals at which the function will be calculated
    domain: [number, number] // The domain the function will be drawn at, inclusive
    range: [number, number] // The range the function will be drawn at, inclusive
    probBounds: [number, number] // The domain where the probabilty is being calculated (area under the curve)
  }
) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const [probBegin, probEnd] = options.probBounds;
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
      const cWidth = canvasWidth / (xEnd - xBegin);

      for (let x = xBegin; x <= xEnd; x += 1) {
        const y = f(x);
        const cx = (x - xBegin) / xSpread * canvasWidth;
        const cHeight = (y - yBegin) / ySpread * canvasHeight;
        const cy = canvasHeight - cHeight;

        if (x >= probBegin && x <= probEnd) {
          ctx.fillStyle = FILL;
        } else {
          ctx.fillStyle = FILL_TRANSPARENT;
        }

        ctx.fillRect(cx - cWidth/2, cy, cWidth, cHeight);
      }
      break;
    case FunctionType.Continuous:
      ctx.strokeStyle = STROKE;
      ctx.fillStyle = FILL_TRANSPARENT;
      ctx.lineWidth = 2;
     
      const curvePath = new Path2D();
      const fillPath = new Path2D();
      let begunFill = false;
      let doneFill = false;
      
      const cy0 = canvasHeight - (-yBegin / ySpread * canvasHeight);
      for (let x = xBegin; x <= xEnd; x += options.step) {
        const y = f(x);
        const cx = (x - xBegin) / xSpread * canvasWidth;
        const cy = canvasHeight - (y - yBegin) / ySpread * canvasHeight;
        
        // Draw curve  
        curvePath.lineTo(cx, cy);
        
        // Draw filled probability
        if (!doneFill) { 
          if (begunFill && x >= probEnd) {
            fillPath.lineTo(cx, cy); 
            fillPath.lineTo(cx, cy0);
            fillPath.closePath();
            doneFill = true;
          } else if (!begunFill && x >= probBegin) {
            fillPath.moveTo(cx, cy0);
            fillPath.lineTo(cx, cy);
            begunFill = true;
          } else if(!begunFill) {
            fillPath.moveTo(cx, cy);
          } else {
            fillPath.lineTo(cx, cy);
          }
        }
      }
    
      ctx.fill(fillPath);
      ctx.stroke(curvePath);
   
      break;
  }
}

const Graph: Component<{
  width: number, // The width of the canvas
  height: number, // The height of the canvas
  domain: [number, number],
  range: [number, number],
  probBounds: [number, number],
  func: (x: number) => number,
  funcType: FunctionType
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
    drawFunction(ctx, props.func, props.funcType, {
      step: 0.05,
      domain: props.domain,
      range: props.range,
      probBounds: props.probBounds
    });
  });

  return <canvas ref={canvas} width={props.width} height={props.height} />;
}

export default Graph;