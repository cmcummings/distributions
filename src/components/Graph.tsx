import { Accessor, Component, createEffect } from "solid-js";

type Function2D = (x: number) => number;

enum FunctionType { Discrete, Continuous }

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

  ctx.fillStyle = "black";
  
  switch (funcType) {
    case FunctionType.Discrete:
      for (let x = xBegin; x <= xEnd; x += options.step) {
        const y = f(x);
        const cx = (x - xBegin) / xSpread * canvasWidth;
        const cHeight = (y - yBegin) / ySpread * canvasHeight;
        const cy = canvasHeight - cHeight;
        ctx.fillRect(cx - 2, cy, 4, cHeight);
      }
      break;
    case FunctionType.Continuous:
      ctx.strokeStyle = "#0000ff"
      ctx.beginPath(); 
      for (let x = xBegin; x <= xEnd; x += options.step) {
        const y = f(x);
        const cx = (x - xBegin) / xSpread * canvasWidth;
        const cHeight = (y - yBegin) / ySpread * canvasHeight;
        const cy = canvasHeight - cHeight;
        if (x == xBegin) {
          ctx.moveTo(cx, cy)
        } else {
          ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();
      break;
  }
}



const Graph: Component<{
  width: number, // The width of the canvas
  height: number, // The height of the canvas
  domain: [Accessor<number>, Accessor<number>],
  range: [Accessor<number>, Accessor<number>],
  func: Function2D
}> = ({ width = 500, height = 300, domain, range, func }) => {
  let canvas!: HTMLCanvasElement;

  createEffect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context failed to load");
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 0, width, height);

    // Draw function
    drawFunction(ctx, func, FunctionType.Continuous, {
      step: 0.05,
      domain: [domain[0](), domain[1]()],
      range: [range[0](), range[1]()],
    });
  });

  return <canvas ref={canvas} width={width} height={height} />;
}

export default Graph;