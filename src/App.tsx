import { Component, createSignal } from 'solid-js';
import Graph from "./components/Graph";
import { Range } from "./components/Range";
import { binomial, normal } from './distribution';


const App: Component = () => {
  const [domainMin, setDomainMin] = createSignal(-20);
  const [domainMax, setDomainMax] = createSignal(20);

  return (
    <div>
      <div class="p-2 flex items-center">
        <p class="inline mr-2">Domain</p>
        <Range 
          left={domainMin} setLeft={setDomainMin}
          right={domainMax} setRight={setDomainMax}
          min={-100} max={100} step={1}
          />
        <p class="inline ml-2">[{domainMin}, {domainMax}]</p>
      </div>
      <Graph width={500} height={300} 
        domain={[domainMin, domainMax]} 
        range={[() => 0, () => 1]}
        func={(x: number) => normal(0, 1, x)}/>
    </div>
  );
};

export default App;
