import { Component, createEffect, createSignal, For, JSX, Match, mergeProps, onCleanup, onMount, splitProps, Switch } from 'solid-js';
import { DividerH } from './components/Generic';
import Graph from "./components/Graph";
import { RangeDetailed, NumberDetailed, ProbabilityInput } from "./components/Inputs";
import { normalcdf, normalpdf, poissonpdf, poissoncdf, exponentialpdf, exponentialcdf, uniformpdf, uniformcdf } from './distribution';

const DistributionPage: Component<{
  pdf: (x: number) => number,
  cdf: (a: number, b: number) => number,
  distributionSettingsChildren: JSX.Element
}> = (p) => {
  const props = mergeProps(p);

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
    <main class="px-2 lg:px-[10%] mt-5 flex flex-wrap gap-5 justify-center items-start">
      <div class="p-5 bg-gray-100 border border-gray-200 rounded-md">
        <Graph width={500} height={300}
          domain={[domainMin(), domainMax()]}
          range={[rangeMin(), rangeMax()]}
          probBounds={[probLeftBound(), probRightBound()]}
          func={props.pdf} />
      </div>
      <div class="p-5 bg-gray-100 border border-gray-200 rounded-md">
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
      </div>
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
    distributionSettingsChildren={<>
      <NumberDetailed
        name="Mean"
        value={mean()} setValue={setMean}
        min={-50} max={50} step={0.1} />
      <NumberDetailed
        name="Standard Deviation"
        value={sd()} setValue={setSD}
        min={0} max={10} step={0.1} />
    </>} />
}

const PoissonDistributionPage: Component = () => {
  const [lambda, setLambda] = createSignal(0);

  return <DistributionPage
    pdf={poissonpdf(lambda())}
    cdf={poissoncdf(lambda())}
    distributionSettingsChildren={<>
      <NumberDetailed
        name="Lambda"
        value={lambda()} setValue={setLambda}
        min={0} max={10} step={0.1} /> 
    </>} />
}

const ExponentialDistributionPage: Component = () => {
  const [lambda, setLambda] = createSignal(1);
  
  return <DistributionPage
    pdf={exponentialpdf(lambda())}
    cdf={exponentialcdf(lambda())}
    distributionSettingsChildren={<>
      <NumberDetailed
        name="Lambda"
        value={lambda()} setValue={setLambda}
        min={0} max={10} step={0.1} /> 
    </>} />
}

const UniformDistributionPage: Component = () => {
  const [a, setA] = createSignal(-1);
  const [b, setB] = createSignal(1);

  onMount(() => {
    console.log("mounted")
  });

  onCleanup(() => {
    console.log("unmounted")
  });

  return <DistributionPage
    pdf={uniformpdf(a(), b())}
    cdf={uniformcdf(a(), b())}
    distributionSettingsChildren={<>
      <RangeDetailed
        name="Range"
        left={a()} setLeft={setA}
        right={b()} setRight={setB}
        min={-10} max={10} step={0.1} />
    </>} />
}

const distributions: {
  name: string,
  component: Component 
}[] = [
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
  } 
]

const App: Component = () => {
  const [distribution, setDistribution] = createSignal(0);

  return (
    <>
      <div class="bg-gray-100 border border-gray-200 py-2 px-2 lg:px-[20%] flex gap-3 align-center">
        <a href="https://github.com/cmcummings/distributions"><img src="/src/assets/github-mark.svg" class="w-5 h-5"/></a>
        <h2 class="inline">Distributions</h2>
        <div class="inline border-1 border-l border-gray-300" />
        <For each={Object.values(distributions)}>{(d, i) =>
          <HeaderAnchor onClick={() => setDistribution(i())} class={distribution() === i() ? "font-bold" : ""}>{d.name}</HeaderAnchor>
        }</For>
      </div>
      {distributions[distribution()].component}
      {/* <Switch>
        <Match when={distribution() === "normal"}>
          <NormalDistributionPage />
        </Match>
        <Match when={distribution() === "exponential"}>
          <ExponentialDistributionPage />
        </Match>
      </Switch> */}
    </>
  );
};

export default App;
