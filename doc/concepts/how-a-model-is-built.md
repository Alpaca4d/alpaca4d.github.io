# 🏗️ How a model is built

Every Alpaca4d definition follows the same chain. Materials go into sections, sections into
elements, and the elements, supports, load patterns and constraints go into
[Assemble](../basics/assemble.md), which makes them one model. An analysis solves that model and
hands it back with its results, which the result components and
[Model View](../basics/visualisation/model-view.md) read.

```
Material ──► Section ──► Element ─────┐
                         Support ─────┤
Load ──► Load Pattern ────────────────┼──► Assemble ──► AlpacaModel ──► Analysis ──► AlpacaModel ──► Results
                      Constraint ─────┤                                              with results     Model View
                   MPCO Recorder ─────┘
```

## What each stage hands on

**Material.** A stress–strain law and a density. There are two families, and they are not
interchangeable: [Uniaxial](../basics/materials/Uniaxial.md) for beam sections and fibres,
[nD](../basics/materials/ND.md) for shells and solids. Of a uniaxial material only `E`, `Eta` and
`Eneg` reach OpenSees. Alpaca4d uses `G` for the section's torsion and shear terms and `Rho` for
the element's mass, which is why they sit on the material and not on the section.

**Section.** A geometry paired with a material. A beam section reduces to an area, two second
moments, a torsion constant and two shear factors; a shell section is a thickness and an nD
material. The section carries its material, and with it the density, on to the element. It
does not know which way it faces: that comes from the element.

**Element.** Rhino geometry turned into finite elements: a curve into a beam, mesh faces into
shells, a hexahedral or tetrahedral mesh into a solid. Solids take an nD material directly, with
no section, and a [Spring Link](../basics/elements/spring-link.md) takes one uniaxial material per
direction and reads its `E` as a stiffness. An element knows its own geometry and nothing else: a
beam does not know which other beam it meets. Each element can be given an optional
**ElementId**, a name that loads and result components can pick it out by later.

**Supports, loads and constraints.** A [Support](../basics/elements/support.md) holds a node
still. A [constraint](../basics/constraints/README.md) ties nodes to each other. Loads do not go
into Assemble on their own: they are grouped into a [Load Pattern](../basics/loads/load-pattern.md),
which gives them a [time series](../basics/time-history/README.md) and a factor. The one
exception is [Mass Point](../basics/loads/mass-point.md), which adds mass rather than force and goes
straight into Assemble. An [MPCO Recorder](../basics/mpco-recorder.md), if there is one, says
which results to record.

**Assemble.** The hinge of the chain. It collects every beam end, shell vertex and solid corner
and merges the ones within its **Tolerance** into one node. The same search attaches point loads,
mass points, supports and the nodes named by constraints. It numbers everything and gives each
node 6 degrees of freedom when a beam or a shell touches it, 3 when only solids do. Out comes one
`AlpacaModel`, the object every later component reads.

**Analysis.** [Run Analysis](../basics/analysis/run-analysis.md) solves the model under the
recipe of [Analysis Settings](../basics/analysis/analysis-settings.md): the integrator, the
convergence test, the steps, the damping and the solver.
[Natural Vibration](../basics/analysis/natural-vibration.md) and
[Linear Buckling](../basics/analysis/linear-buckling.md) need no settings. Each returns the same
model with its results attached. There is no separate result object.

**Results and Model View.** The [result components](../basics/results/README.md) read numbers
off the analysed model, one **Step** or every step at once with **History**.
[Model View](../basics/visualisation/model-view.md) draws the model before the analysis, to check
supports and loads, and any of its results after it.

## Why the chain is split this way

**It is how OpenSees builds a model.** An OpenSees model is written as materials, sections,
elements, nodes, restraints and load patterns, and an analysis as a handful of objects that each
answer one question. Most Alpaca4d components stand for one of those commands, and their
reference pages show it under *Relation to OpenSees*.

**Each piece is reused.** One material goes into many sections, one section onto many elements.
Because loads and patterns are separate, the same load can appear in several load cases at
different factors.

**Connection is decided once, by geometry.** Nothing before Assemble knows about anything else,
and two members are joined when, and only when, their geometry meets within the **Tolerance**.
So when a connection carries no force, the tolerance is the first thing to check, and **Node IDs**
in Model View shows how many nodes the model really has.

**One object flows downstream.** Every analysis takes an `AlpacaModel` and returns one, so the
same result components read the answer of any analysis. An analysed model also keeps the model
it was analysed from: that is why Natural Vibration and Linear Buckling accept the output of Run
Analysis as well as that of Assemble.

## See also

- [Assemble](../basics/assemble.md) — tolerance, node matching and degrees of freedom
- [Loads](../basics/loads/README.md) — loads, load patterns and mass
- [Analysis](../basics/analysis/README.md) — the objects an analysis is made of
- [Which element](which-element.md) — choosing the element for each part
- [Which analysis](which-analysis.md) — choosing the analysis for the question
- [Alpaca4d and OpenSees](alpaca4d-and-opensees.md) — what happens when the model is solved
