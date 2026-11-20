---
description: What each version of Alpaca4d brings, newest first
---

# 📝 Changelog

What each version of Alpaca4d brings, newest first. Betas come through Rhino's Package Manager:
search for **Alpaca4d** and tick **Include pre-releases** (see [Installation](../installation.md)).

{% hint style="info" %}
**Opening a definition saved with an earlier version.** If Grasshopper says *IO generated n
messages* as it opens, a component in it has gained an input since: its wires and values are kept,
and the new input is empty. Save the definition again and the message goes. A component drawn as
**OLD** has been replaced: Grasshopper's **Upgrade Components…** swaps it for the new one, with its
wires.
{% endhint %}

## 0.12.0-beta.6 — 20 November 2026

Meshing with gmsh, timber design, and buckling lengths worked out from the model.

- **Meshing with gmsh.** [Mesh Solid](../basics/utility/mesh-solid.md) fills closed Breps and
  meshes with tetrahedra, [Mesh Surface](../basics/utility/mesh-surface.md) meshes surfaces into
  shells, and [Mesh Refinement](../basics/utility/mesh-refinement.md) makes the elements smaller
  near a point, a curve or a surface. gmsh is a program of its own: download it and set it from the
  Alpaca4d Settings menu. Examples: the
  [slab with openings](https://alpaca4d.github.io/examples/slab-with-openings/) and the
  [femur](https://alpaca4d.github.io/examples/femur/).
- **Timber to EN 1995-1-1.** [Utilisation](../basics/results/utilisation.md) checks Steel or Timber,
  with the grades C14 to C50, D30 to D70 and GL20 to GL32. [Load Pattern](../basics/loads/load-pattern.md)
  takes a load-duration class for k_mod, in its Duration menu, and
  [Section Optimiser](../basics/optimisation/section-optimiser.md) sizes timber, and sizes over the
  load combinations. Example: the [Wave Roof Hall](https://alpaca4d.github.io/examples/wave-roof-hall/),
  glulam arches on a steel frame.
- **Buckling lengths from the model** (EN 1993-1-1), where you give none: in Utilisation, Section
  Optimiser, the timber check and the Report. [Model View](../basics/visualisation/model-view.md)
  draws them, from its Buckling menu.
- **Load combinations in every result component.** Nodal Displacements, Beam Forces, Beam
  Stresses, Shell Forces, Shell Stresses, Brick Stresses, Reaction Forces, Node Forces and
  Utilisation take a Combination: one by name, or all of them, a branch each.
- Beam and WithHinges take their transformation as a word: Linear, PDelta or Corotational.
- Example: the [silo](https://alpaca4d.github.io/examples/silo-explosion-impact/) under a dust
  explosion and a tractor's impact, two transient analyses.

## 0.12.0-beta.5 — 18 November 2026

Nonlinear analysis, footfall, load combinations, reports, and two more methods of topology
optimisation.

- **One [Model View](../basics/visualisation/model-view.md)** draws the model and any of its
  results, several at once, in place of Model View and View Results, which upgrade to it. It draws
  reactions as dots, plastic hinges, and colours that grow with the deformation as it animates;
  [Legend](../basics/visualisation/legend.md) draws a legend per branch.
- **[Load Combination](../basics/loads/load-combination.md)**: a name, a type, and load patterns
  times factors. Run Analysis solves each combination, and Model View, Linear Buckling and Pushover
  take one by name.
- **[Pushover Analysis](../basics/analysis/pushover.md)** of beams on fibre sections, with plastic
  hinges and the ductility each one reaches. Examples: an
  [irregular building](https://alpaca4d.github.io/examples/irregular-building-pushover/) and a
  [reciprocal plywood vault](https://alpaca4d.github.io/examples/reciprocal-vault-pushover/).
- **Steel that yields:** J2 Plasticity, the last type of the [nD Material](../basics/materials/ND.md)
  component, on solids and shells. Examples: a
  [beam with holes](https://alpaca4d.github.io/examples/beam-with-holes/), a
  [pipe T-joint](https://alpaca4d.github.io/examples/pipe-t-joint/),
  [yield lines](https://alpaca4d.github.io/examples/yield-lines/), a
  [plate with a hole](https://alpaca4d.github.io/examples/plate-with-a-hole/) and a
  [thick pipe](https://alpaca4d.github.io/examples/thick-pipe/).
- **More fibre laws:** Concrete02, Concrete04, Steel02, ElasticPP, Hysteretic and Elastic, in the
  [Concrete](../basics/moment-curvature/concrete.md), [Steel](../basics/moment-curvature/steel.md)
  and [Other Laws](../basics/moment-curvature/other-laws.md) components, which replace the
  one-law components.
- **[Footfall Analysis](../basics/analysis/footfall.md):** SCI P354's response factors of floors and
  stairs, from their modes. [Mass from Loads](../basics/loads/mass-from-loads.md) makes the weight
  of named load patterns into mass. Examples: a
  [U stair](https://alpaca4d.github.io/examples/footfall-stair/), a
  [helical stair](https://alpaca4d.github.io/examples/footfall-helical-stair/) and a
  [straight stair](https://alpaca4d.github.io/examples/footfall-straight-stair/).
- **[Report](../basics/report/report.md):** a calculation report from the model - its loads,
  combinations, results, steel check and views - as a PDF or a Word document, from ready-made
  templates.
- **[Topology Optimisation](../basics/optimisation/topology-optimisation.md)** adds BESO and
  Multi-Material to SIMP, and optimises for each load combination. Examples: a
  [truss node](https://alpaca4d.github.io/examples/truss-node/), a
  [beam-column joint](https://alpaca4d.github.io/examples/beam-column-joint/), the
  [cantilever at penalties 1 to 5](https://alpaca4d.github.io/examples/cantilever-penalties/) and
  the [L-bracket](https://alpaca4d.github.io/examples/l-bracket/).
- Linear Buckling of solids, with the
  [3D printed concrete structures](https://alpaca4d.github.io/examples/3d-printed-structure/)
  checked for buckling as they are printed.
- New examples: conventional structures under snow and wind, towers and bridges shaken by El
  Centro, a [response spectrum](https://alpaca4d.github.io/examples/response-spectrum/), a
  [form-found shell](https://alpaca4d.github.io/examples/compressed-shell/), the
  [moment curvature](https://alpaca4d.github.io/examples/moment-curvature/) of a reinforced concrete
  section, and the ten lessons of [Learn](../learn/01-river.md).

## 0.12.0-beta.4 — 2 November 2026

- [Natural Vibration](../basics/analysis/natural-vibration.md) and
  [Linear Buckling](../basics/analysis/linear-buckling.md) take a model that has already been
  analysed, from Run Analysis or Section Optimiser.

## 0.12.0-beta.3 — 2 November 2026

New elements, topology optimisation and principal stress lines.

- **[Ten Node Tetrahedron](../basics/elements/ten-node-tetrahedron.md)**, in place of the four node
  one, which upgrades to it. Examples: [Spot the cow](https://alpaca4d.github.io/examples/spot-the-cow/),
  the [femur](https://alpaca4d.github.io/examples/femur/) and the
  [Rebellious Slave](https://alpaca4d.github.io/examples/rebellious-slave/).
- **Truss**, a third type of the [beam](../basics/elements/force-beam-column.md) component: axial
  force only, in tension and compression, or in one of them.
- **[Support](../basics/elements/support.md)** is Rigid, Elastic (springs) or Compression Only (with
  a gap); the old Support upgrades to it. Supports that land on one node are made one, with a
  remark.
- **[Topology Optimisation](../basics/optimisation/topology-optimisation.md)** of solids by SIMP, as
  top3d does, with the design handed on as a model to analyse. Free up to 500 elements. Examples:
  [top3d's benchmarks](https://alpaca4d.github.io/examples/topology-benchmarks/) and a
  [bridge](https://alpaca4d.github.io/examples/topology-bridge/).
- **[Principal Stress Lines](../basics/visualisation/principal-stress-lines.md)**, rebuilt over
  shells, and new through solids.
- **[Shell Section](../basics/visualisation/shell-section.md)** cuts across shells and adds up the
  forces through the cut; **[Node Forces](../basics/results/node-forces.md)** gives the forces each
  beam brings into a node, for connection design.
- Beam stresses over the section's surface, results drawn as colour bands, and mode shapes drawn at
  a size fitted to the model.
- [Analysis Settings](../basics/analysis/analysis-settings.md) solves with Mumps, on several cores,
  when the OpenSees in use has it.
- Line and mesh loads on the elements an ElementId names, and end releases drawn in Model View.

## 0.12.0-beta.2 — 21 October 2026

Reinforced concrete sections, and beams sized from lists of sections.

- **[Interaction Domain](../basics/moment-curvature/interaction-domain.md)** (N-My-Mz) of a fibre
  section, with [Domain Check](../basics/moment-curvature/domain-check.md) and its
  [views](../basics/moment-curvature/domain-views.md): 3D, N-M and My-Mz.
- **[Moment Curvature](../basics/moment-curvature/moment-curvature.md)** in any direction, to the
  section's yield and ultimate state, with its diagram.
- **[Section Optimiser](../basics/optimisation/section-optimiser.md)** and
  **[Design Group](../basics/optimisation/design-group.md)** size beams from lists of sections,
  analysing until nothing changes.
- A Colour input on every section and material, and Model View coloured by element, section or
  material.
- View Results shows each result in the unit you choose.

## 0.12.0-beta.1 — 19 October 2026

Steel checks, linear buckling, and exchange with Karamba3D and FEM-Design.

- **Exchange:** [Karamba3D to Alpaca4d](../basics/utility/karamba3d-to-alpaca4d.md), its trusses as
  beams with hinges, and [Alpaca4d to FEM-Design](../basics/utility/alpaca4d-to-femdesign.md).
- **[Linear Buckling Analysis](../basics/analysis/linear-buckling.md):** the lowest buckling modes
  and their load factors.
- **Steel to EN 1993-1-1** in [Utilisation](../basics/results/utilisation.md): lateral-torsional
  buckling (6.3.2), with M_cr from the moment diagram, bending with compression (6.3.3), and
  buckling lengths per axis.
- **[Explorer](../basics/optimisation/explorer-inputs.md):** a design study through every
  combination of the sliders, value lists and panels wired into it.
- **[Non-Linear Optimisation](../basics/optimisation/non-linear-optimisation.md):** NLopt's
  derivative-free optimisers, as DoDo's NL-Opt has them.
- **[Mesh Brep](../basics/utility/mesh-brep.md):** quad meshes of Breps, kept to their edges.
- Faster assembly of large models.
