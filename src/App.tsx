import { Calculator } from './components/Calculator'
import { Decisions } from './components/Decisions'
import { Hero } from './components/Hero'
import { Roadmap } from './components/Roadmap'

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Decisions />
        <Calculator />
        <Roadmap />
      </main>
      <footer className="bg-navy-900 py-8 text-center">
        <p className="text-[12px] text-paper/60">
          Zappavigna Real Estate · decision-support demo · Phase 1 proof of concept
        </p>
        <p className="mt-1 text-[11px] text-paper/40">
          All figures illustrative. Calculations run entirely in your browser — nothing is stored or sent anywhere.
        </p>
      </footer>
    </>
  )
}
