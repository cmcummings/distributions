import { Component, createEffect, createSignal } from 'solid-js';
import { Divider } from './components/Generic';
import Graph from "./components/Graph";
import { RangeDetailed, NumberDetailed, ProbabilityInput } from "./components/Inputs";
import { normalcdf, normal } from './distribution';


const App: Component = () => {
  const [domainMin, setDomainMin] = createSignal(-5);
  const [domainMax, setDomainMax] = createSignal(5);
  const [rangeMin, setRangeMin] = createSignal(0);
  const [rangeMax, setRangeMax] = createSignal(0.5);
  const [mean, setMean] = createSignal(0);
  const [sd, setSD] = createSignal(1);

  const [probLeftBound, setProbLeftBound] = createSignal(-1.96);
  const [probRightBound, setProbRightBound] = createSignal(1.96);
  const [probResult, setProbResult] = createSignal(0);

  createEffect(() => {
    setProbResult(normalcdf(mean(), sd(), probLeftBound(), probRightBound()))
  })

  return (
    <>
      <div class="bg-gray-100 border border-gray-200 py-2 px-2 lg:px-[20%]">
        <h2>Distributions</h2>
      </div>
      <main class="px-2 lg:px-[10%] mt-5 flex flex-wrap gap-5 justify-center">
        <div class="p-5 bg-gray-100 border border-gray-200 rounded-md">
          <Graph width={500} height={300}
            domain={[domainMin(), domainMax()]}
            range={[rangeMin(), rangeMax()]}
            probBounds={[probLeftBound(), probRightBound()]}
            func={normal(mean(), sd())} />
        </div>
        <div class="p-5 bg-gray-100 border border-gray-200 rounded-md">
          <h3 class="text-lg block">Graph Settings</h3>
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
          <Divider /> 
          <h3 class="text-lg block">Distribution</h3>
          <NumberDetailed
            name="Mean"
            value={mean()} setValue={setMean}
            min={-50} max={50} step={0.1}/>
          <NumberDetailed
            name="Standard Deviation"
            value={sd()} setValue={setSD}
            min={0} max={10} step={0.1}/>
          <Divider />
          <h3 class="text-lg block">Probability</h3>
          <ProbabilityInput 
            leftBound={probLeftBound()} setLeftBound={setProbLeftBound}
            rightBound={probRightBound()} setRightBound={setProbRightBound} 
            result={probResult()} />  
        </div>
      </main>
    </>
  );
};

export default App;
