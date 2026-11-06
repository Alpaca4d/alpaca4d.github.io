# 🔍 Which analysis

Each analysis answers a different question about the same model. A static analysis gives the
displacements and forces under the loads; Natural Vibration the modes and periods; Linear
Buckling the load factor the structure becomes unstable at; a time history the response as it
happens; and a moment–curvature analysis how one cross-section behaves up to failure. Pick the
analysis by the question.

## At a glance

| You want | Analysis | Set up with |
| --- | --- | --- |
| Displacements, forces and stresses under the loads | Linear static | [Run Analysis](../basics/analysis/run-analysis.md) and [Analysis Settings](../basics/analysis/analysis-settings.md), one step |
| The same, where supports lift, bars go slack or displacements are large | Non-linear static | Run Analysis, the Newton algorithm, several steps |
| Periods, frequencies, mode shapes, participating masses | Natural vibration | [Natural Vibration](../basics/analysis/natural-vibration.md), no settings |
| Whether and when the structure buckles, α_cr | Linear buckling | [Linear Buckling](../basics/analysis/linear-buckling.md), no settings |
| The response to a ground motion, an impact, a machine | Time history | Run Analysis, **AnalysisType** `Transient` |
| How a cross-section cracks, yields and fails | Moment–curvature | [Moment Curvature](../basics/moment-curvature/moment-curvature.md), a section on its own |

## Static analysis

A static analysis finds where the structure comes to rest under its loads, with no inertia. It is
what [Run Analysis](../basics/analysis/run-analysis.md) does with **AnalysisType** `Static` and the
`LoadControl` [Integrator](../basics/analysis/integrator.md), and an
[Analysis Settings](../basics/analysis/analysis-settings.md) left with its defaults already
describes one. A linear model needs one step: one step of `LoadControl` with **Lambda** 1 applies
the whole load.

A model is non-linear when its stiffness changes as it moves. In Alpaca4d that comes from:

- [Compression Only](../basics/elements/support.md) supports, which let go when the node lifts;
- tension-only and compression-only [Trusses](../basics/elements/force-beam-column.md), which go
  slack;
- large displacements: trusses are always corotational, and a [shell](../basics/elements/shell.md)
  can be made corotational with **Is Corotational**.

Such a model needs the load in steps. Each step adds the [Integrator](../basics/analysis/integrator.md)'s
**Lambda** to a pseudo-time, a [Linear](../basics/time-history/linear.md) time series turns that
time into a load factor that ramps up, and the [Test](../basics/analysis/test.md) decides when
the iterations of a step have converged. The algorithm matters: `Linear` does one solve with no
iteration, and on a non-linear model it still reports success, with the unconverged first guess.
`Newton`, the default, re-forms the tangent stiffness every iteration. It costs about 20 % more
on an elastic model, and is what lets a non-linear step converge at all. Run Analysis warns when
the algorithm is `Linear` and the model has one-way bars or supports.

## Natural Vibration

An eigenvalue problem: the modes the structure vibrates in, with their periods and frequencies.
There is nothing to converge, so it needs no settings. It is the first analysis worth running on
a new model, because a first period far from what you expect means the mass or the stiffness is
wrong.

It needs mass, which comes from the material densities and from
[Mass Points](../basics/loads/mass-point.md). [Gravity Load](../basics/loads/gravity.md) adds force,
not mass. A mode has no size of its own, so each is read with its largest translation 1. The
modal report gives the participating masses, and the frequencies are what
[Damping](../basics/analysis/damping.md) is tuned to.

## Linear Buckling

The load factors at which the structure buckles under its loads, lowest first, and the shapes it
buckles into. The first is the critical load factor $$\alpha_{cr}$$, which EN 1993-1-1 compares with
10 to decide whether a frame needs a second-order analysis. It also gives the buckling length of a
member for a design check.

It is linear: elastic, about the undeformed shape, with no imperfections. So $$\alpha_{cr}$$ is
the elastic critical load factor, not the load the structure can carry: for that, a non-linear
static analysis with the imperfections modelled is the tool. Beams buckle in bending only, so
lateral-torsional buckling is left to [Utilisation](../basics/results/utilisation.md), and solids
never soften under load. A member that can buckle on its own, between its ends, has to be
split with **Divisions**.

## Time history

When inertia matters, time is real: a ground motion, an impact, a machine. Run Analysis then runs
with **AnalysisType** `Transient`, and the pieces change with it:

- **Integrator.** `Newmark`, implicit; with γ = 0.5 and β = 0.25, the defaults, it is
  unconditionally stable and adds no numerical damping. `CentralDifference` is explicit and stable
  only for a time step below the critical step of the smallest, stiffest element, which suits
  short, sharp events.
- **Analysis Step.** **NumIncr** × **Dt** is the duration. **Dt** has to sample both the input
  signal and the highest mode of interest.
- **Damping.** Without it a dynamic model rings indefinitely. Rayleigh damping is tuned to
  frequencies from Natural Vibration.
- **Loads.** A [time series](../basics/time-history/README.md) carries the signal: a
  [Path](../basics/time-history/path.md) of times and values, a
  [Trigonometric](../basics/time-history/trigonometric.md) wave, or a record read from a file. A
  ground motion is a [UniformExcitation](../basics/loads/load-pattern.md) pattern, which shakes the
  whole base in one direction.

Velocities and accelerations are recorded only by a transient analysis. **History** on the
result components reads every step at once.

## Moment–curvature

A section-level analysis, not one of the model. A [fibre section](../basics/moment-curvature/fiber-section.md)
gives each small area of the cross-section a non-linear material law, and
[Moment Curvature](../basics/moment-curvature/moment-curvature.md) pushes its curvature under a
held axial force to the ultimate state. Out come first yield, the ultimate moment, the ductility
and an effective cracked stiffness, all from the material laws.
[Interaction Domain](../basics/moment-curvature/interaction-domain.md) gives instead what the
section carries at the ultimate limit state, for every combination of N, My and Mz.

A fibre section cannot yet be assigned to a beam of the model, whose sections are elastic. The tab
is marked βeta.

## See also

- [Analysis](../basics/analysis/README.md) — the objects an analysis is made of
- [Analysis Settings](../basics/analysis/analysis-settings.md) — the algorithm, the system and the analysis type
- [Time History](../basics/time-history/README.md) — choosing a time series
- [Moment Curvature](../basics/moment-curvature/README.md) — fibre sections
- [Results](../basics/results/README.md) — reading what an analysis found
- [Alpaca4d and OpenSees](alpaca4d-and-opensees.md) — what happens when an analysis runs
