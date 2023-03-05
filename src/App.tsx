import { Component, createEffect, createSignal, For, JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import { DividerH } from './components/Generic';
import Graph, { FunctionType } from "./components/Graph";
import { RangeDetailed, NumberDetailed, ProbabilityInput } from "./components/Inputs";
import { normalcdf, normalpdf, poissonpdf, poissoncdf, exponentialpdf, exponentialcdf, uniformpdf, uniformcdf, binomialpdf, binomialcdf, geometricpdf, geometriccdf } from './distribution';
import githubIcon from './assets/github-mark.svg'
import hamburgerIcon from './assets/hamburger.svg'


const Container: Component<JSX.HTMLAttributes<HTMLDivElement>> = (p) => {
  const [local, rest] = splitProps(p, ["class"]);

  return <div class={"p-5 bg-gray-100 border border-gray-200 rounded-md " + local.class} {...rest} />
}

function getCanvasSize(): [number, number] {
  let width = Math.min(window.innerWidth - 20, 800);
  let height = Math.min(window.innerHeight - 20, width * 5/8);
  return [width, height];
}

const DistributionPage: Component<{
  pdf: (x: number) => number,
  cdf: (a: number, b: number) => number,
  distributionSettingsChildren: JSX.Element,
  distType: FunctionType
}> = (p) => {
  const props = mergeProps(p);

  const [canvasSize, setCanvasSize] = createSignal<[number, number]>(getCanvasSize());

  function resizeHandler() {
    setCanvasSize(getCanvasSize());
  }

  onMount(() => {
    window.addEventListener('resize', resizeHandler); 
  });

  onCleanup(() => {
    window.removeEventListener('resize', resizeHandler);
  });

  const [domainMin, setDomainMin] = createSignal(-5);
  const [domainMax, setDomainMax] = createSignal(5);
  const [rangeMin, setRangeMin] = createSignal(0);
  const [rangeMax, setRangeMax] = createSignal(1);

  const [probLeftBound, setProbLeftBound] = createSignal(-1.96);
  const [probRightBound, setProbRightBound] = createSignal(1.96);
  const [probResult, setProbResult] = createSignal(0);

  createEffect(() => {
    setProbResult(props.cdf(probLeftBound(), probRightBound()))
  })

  return (
    <main class="px-2 lg:px-[10%] mt-5 flex flex-wrap gap-5 items-start justify-center">
      <Container>
        <Graph width={canvasSize()[0]} height={canvasSize()[1]}
          domain={[domainMin(), domainMax()]}
          range={[rangeMin(), rangeMax()]}
          probBounds={[probLeftBound(), probRightBound()]}
          func={props.pdf}
          funcType={props.distType} />
      </Container>
      <Container class="flex-grow self-stretch">
        <h3 class="text-lg block font-medium">Graph Settings</h3>
        <RangeDetailed
          name="Domain"
          left={domainMin()} setLeft={setDomainMin}
          right={domainMax()} setRight={setDomainMax}
          min={-100} max={100} step={1}
        />
        <RangeDetailed
          name="Range"
          left={rangeMin()} setLeft={setRangeMin}
          right={rangeMax()} setRight={setRangeMax}
          min={0} max={1} step={0.01}
        />
        <DividerH />
        <h3 class="text-lg block font-medium">Distribution</h3>
        {props.distributionSettingsChildren}
        <DividerH />
        <h3 class="text-lg block font-medium mb-2">Probability</h3>
        <ProbabilityInput
          leftBound={probLeftBound()} setLeftBound={setProbLeftBound}
          rightBound={probRightBound()} setRightBound={setProbRightBound}
          result={probResult()} />
      </Container>
      <Container>
        <h3 class="text-lg font-medium">How to use</h3>
        <ul>
          <li>- Select a distribution to model from the top-bar.</li>
          <li>- Adjust the distribution and graph settings accordingly.</li>
          <li>- Collect your results!</li>
          <li>Note: The settings can be set outside of the range of the sliders by using the number inputs directly.</li>
        </ul>
      </Container>
    </main>
  );
}

const HeaderAnchor: Component<JSX.HTMLAttributes<HTMLAnchorElement>> = (p) => {
  const [local, rest] = splitProps(p, ["class"]);
  return <a class={"inline hover:underline hover:cursor-pointer text-teal-800 " + local.class} {...rest}></a>;
}

const NormalDistributionPage: Component = () => {
  const [mean, setMean] = createSignal(0);
  const [sd, setSD] = createSignal(1);

  return <DistributionPage
    pdf={normalpdf(mean(), sd())}
    cdf={normalcdf(mean(), sd())}
    distType={FunctionType.Continuous}
    distributionSettingsChildren={<>
      <NumberDetailed
        name="Mean (μ)"
        value={mean()} setValue={setMean}
        min={-50} max={50} step={0.1} />
      <NumberDetailed
        name="Standard Deviation (ρ)"
        value={sd()} setValue={setSD}
        min={0} max={10} step={0.1} />
    </>} />
}

const ExponentialDistributionPage: Component = () => {
  const [lambda, setLambda] = createSignal(1);

  return <DistributionPage
    pdf={exponentialpdf(lambda())}
    cdf={exponentialcdf(lambda())}
    distType={FunctionType.Continuous}
    distributionSettingsChildren={<>
      <NumberDetailed
        name="Lambda (λ)"
        value={lambda()} setValue={setLambda}
        min={0} max={10} step={0.1} />
    </>} />
}

const UniformDistributionPage: Component = () => {
  const [a, setA] = createSignal(-1);
  const [b, setB] = createSignal(1);

  return <DistributionPage
    pdf={uniformpdf(a(), b())}
    cdf={uniformcdf(a(), b())}
    distType={FunctionType.Continuous}
    distributionSettingsChildren={<>
      <RangeDetailed
        name="Range"
        left={a()} setLeft={setA}
        right={b()} setRight={setB}
        min={-10} max={10} step={0.1} />
    </>} />
}

const BinomialDistributionPage: Component = () => {
  const [n, setN] = createSignal(1);
  const [p, setP] = createSignal(0.5);

  return <DistributionPage
    pdf={binomialpdf(n(), p())}
    cdf={binomialcdf(n(), p())}
    distType={FunctionType.Discrete}
    distributionSettingsChildren={<>
      <NumberDetailed
        name="Number of trials (n)"
        value={n()} setValue={setN}
        min={1} max={20} step={1} />
      <NumberDetailed
        name="Probability of success (p)"
        value={p()} setValue={setP}
        min={0} max={1} step={0.01} /> 
    </>} />
}

const PoissonDistributionPage: Component = () => {
  const [lambda, setLambda] = createSignal(1.7);

  return <DistributionPage
    pdf={poissonpdf(lambda())}
    cdf={poissoncdf(lambda())}
    distType={FunctionType.Discrete}
    distributionSettingsChildren={<>
      <NumberDetailed
        name="Lambda (λ)"
        value={lambda()} setValue={setLambda}
        min={0} max={10} step={0.1} />
    </>} />
}

const GeometricDistributionPage: Component = () => {
  const [p, setP] = createSignal(0.5);
  
  return <DistributionPage
    pdf={geometricpdf(p())}
    cdf={geometriccdf(p())}
    distType={FunctionType.Discrete}
    distributionSettingsChildren={<>
      <NumberDetailed
        name="Probability of success (p)"
        value={p()} setValue={setP}
        min={0} max={1} step={0.01} />
    </>} />
}

const distributions: { name: string, component: Component }[] = [
  {
    name: "Normal",
    component: NormalDistributionPage
  },
  {
    name: "Exponential",
    component: ExponentialDistributionPage
  },
  {
    name: "Uniform",
    component: UniformDistributionPage
  },
  {
    name: "Binomial",
    component: BinomialDistributionPage
  },
  {
    name: "Poisson",
    component: PoissonDistributionPage
  },
  {
    name: "Geometric",
    component: GeometricDistributionPage
  }
]

const DividerR: Component = () => {
  return <div class="border-1 border-gray-300 border-t sm:border-l" />
}

const App: Component = () => {
  const [distribution, setDistribution] = createSignal(0);
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <>
      <div class="bg-gray-100 border border-gray-200 px-2 py-2 xl:px-[10%] 2xl:px-[15%] flex flex-col sticky z-10 top-0 sm:flex-row sm:justify-between gap-3 align-center">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex justify-between">
            <h2 class="inline">Distributions</h2>
            <div class="sm:hidden">
              <button onClick={() => setMenuOpen(!menuOpen())}><img src={hamburgerIcon} class="w-6 h-6" /></button>
            </div>
          </div>
          <div class={"flex-col sm:flex-row gap-3 " + (menuOpen() ? "flex" : "hidden sm:flex")}>
            <DividerR />
            <For each={Object.values(distributions)}>{(d, i) =>
              <HeaderAnchor onClick={() => setDistribution(i())} class={distribution() === i() ? "font-bold" : ""}>{d.name}</HeaderAnchor>
            }</For>
          </div>
        </div>
        <div class={"flex-col sm:flex-row gap-3 " + (menuOpen() ? "flex" : "hidden sm:flex")}>
          <div class="sm:invisible">
            <DividerR />
          </div>
          <a href="https://github.com/cmcummings/distributions" class="flex items-center gap-2 hover:underline">Source<img src={githubIcon} class="w-5 h-5 inline" /></a>
        </div>
      </div>
      {distributions[distribution()].component}
    </>
  );
};

export default App;
