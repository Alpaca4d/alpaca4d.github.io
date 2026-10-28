# 🎯 Optimisation

Two ways to find a good design, both by moving the sliders of a definition and solving it again:

- **Explore a design space** with the Explorer components: every combination of a few sliders,
  one solution each, with the results, a picture and the 3D model of each design saved to a
  folder. The [Alpaca4d Explorer](https://alpaca4d.github.io/explorer/) opens that folder in the
  browser, to filter the designs on parallel axes, compare trade-offs and look at any of them in
  2D and 3D.
- **Search for the best design** with [Non-Linear Optimisation](non-linear-optimisation.md): an
  algorithm moves the sliders towards the smallest or largest value of one number, such as the
  mass, and can keep other numbers, such as the utilisation, within limits.

They do what Colibri with Design Explorer, and DoDo's NL-Opt, did. Both ship with Alpaca4d, so
there is nothing else to install.

A third works on the material itself rather than on sliders: [Topology Optimisation](topology-optimisation.md)
finds which part of a block of bricks or tetrahedra a structure needs.

Examples to start from:

- the [Footbridge Study](../../examples/footbridge-study/footbridge-study.md), a study of 108
  designs for the Explorer;
- the [Non-Linear Optimisation cases](../../examples/non-linear-optimisation/non-linear-optimisation.md),
  eight problems with known answers;
- the [Topology Bridge](../../examples/topology-bridge/topology-bridge.md), where a bridge needs its
  steel;
- the [Topology Benchmarks](../../examples/topology-benchmarks/topology-benchmarks.md), two problems
  checked against top3d.

## Components in this tab

| Component | Nickname | Does |
| --- | --- | --- |
| [Explorer Inputs](explorer-inputs.md) | `Explorer Inputs` | Steps through every combination of its sliders, value lists and panels. Press **Fly**. |
| [Explorer Outputs](explorer-outputs.md) | `Explorer Outputs` | Names the results a design is judged by. |
| [Explorer Record](explorer-record.md) | `Explorer Record` | Saves each design: data.csv, a picture, a 3D model. |
| [Explorer Image](explorer-image.md) | `Explorer Image` | Which views to take a picture of, and how big. |
| [Explorer Subset](explorer-subset.md) | `Explorer Subset` | Runs part of a study, to try it out or split it between machines. |
| [Non-Linear Optimisation](non-linear-optimisation.md) | `NL-Opt` | Minimises or maximises a number by moving sliders, with NLopt's algorithms. |
| [Topology Optimisation](topology-optimisation.md) | `Topology` | Finds where a solid of bricks or tetrahedra needs its material. |

## Which one

| | Explorer | Non-Linear Optimisation |
| --- | --- | --- |
| Answers | What are the options, and what trades off against what? | Which design is best by this measure? |
| Variables | A few, each in a few steps | Any number, each as finely as its slider allows |
| Results | As many as you like, weighed afterwards | One objective, and constraints it must meet |
| Designs solved | Every combination, once | As many as the algorithm needs, one after another |
| Leaves you with | A study folder to explore and share | The sliders on the best design, and the history of the run |

They work well together. A study shows where the good designs are and what matters; narrow
the sliders' bounds to that region, then let the optimiser find the best design inside it.

## Exploring a design space

1. Wire the sliders, value lists and panels that make a design into
   [Explorer Inputs](explorer-inputs.md). **Name them**: each name becomes an axis.
2. Wire the results that matter - mass, maximum displacement, utilisation, first period - into
   [Explorer Outputs](explorer-outputs.md), and rename its inputs to name the columns, units
   included: `Mass [t]`.
3. Connect **Inputs** and **Outputs** to [Explorer Record](explorer-record.md), and the
   **AlpacaModel** to its **Model** input to get a 3D view. Set **Write** to `true`.
4. Press **Fly** on Explorer Inputs. Rhino stays usable while it runs; **Fly** again or *Esc*
   stops it.
5. Open the [Alpaca4d Explorer](https://alpaca4d.github.io/explorer/) and drop the study folder on
   it. Right-click Explorer Record ▸ *Open the Alpaca4d Explorer* opens both.

{% hint style="info" %}
**A stopped study picks up where it left off.** Explorer Record never saves a design twice, and
Explorer Inputs skips the designs already saved without solving them. Flying again after a
stop, a crash or an extra slider step only runs what is missing.
{% endhint %}

### What the explorer does with it

- **Filter** by dragging along any axis; combine as many as needed.
- **Goals**: click a result's name and pick *Minimise* or *Maximise*. **Pareto front** then
  keeps the designs no other design beats on every goal at once.
- **Gallery, table, scatter** of the designs that pass, sorted and coloured by any column.
- **Each design**: its picture, its 3D model, every value with where it sits in its range, and
  arrows on each input to step to the design next door, among those that pass the filters.
- **Rate** designs with stars and **export** the ones that pass as CSV.

A study folder on your computer is read by the browser and never uploaded. To share a study,
put the folder online - a GitHub repository works - and open it by its address: the address bar
then holds a link to the study, and to the design picked.

## Searching for the best design

1. Drag from the **Variables** grip of [Non-Linear Optimisation](non-linear-optimisation.md) to
   the sliders the design depends on.
2. Drag from the **Objective** grip to the number to minimise or maximise, such as the total mass.
3. To keep other numbers within limits, drag from the **Constraints** grip to numbers that must
   end up at or below zero, such as `utilisation - 1`.
4. Double-click the optimiser, pick an algorithm and press **Start**. When it ends, the sliders
   are on the best design it found, and one Undo puts them back.
