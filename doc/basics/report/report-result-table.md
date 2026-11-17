# Report Result Table

One of the tables Alpaca4d makes of a model: what it is made of, and what an analysis found.

## 🔧 Grasshopper component

`Report Result Table (Alpaca4d)` — **Alpaca4d ▸ 13_Report**

<figure><img src="../../.gitbook/assets/components/report-result-table.png" alt="ResultTable component" width="318"><figcaption></figcaption></figure>

Report Result Table holds no model: the [Report](report.md) makes the table of its own model of the
kind the table needs, from its **AlpacaModel** input. The **Table** menu picks the table:

| Table | Holds | Needs the model from |
| --- | --- | --- |
| `Model summary` | Nodes, elements by type, supports, load patterns, mass, extent and the analyses. | any |
| `Beam sections` | Each beam section: material, how many elements, their length, A, Iy, Iz and J. | any |
| `Beam materials` | Each beam material: E, G, Poisson's ratio and density. | any |
| `Supports` | Each support: where it is, and which of Tx, Ty, Tz, Rx, Ry, Rz it holds. | any |
| `Displacements` | The largest and smallest displacement along X, Y and Z, and the largest overall, with their nodes. | [Run Analysis](../analysis/run-analysis.md) |
| `Support reactions` | The reactions at each support, and their sum, in the global axes. | [Run Analysis](../analysis/run-analysis.md) |
| `Natural frequencies` | Each mode's eigenvalue, angular frequency, frequency and period. | [Natural Vibration](../analysis/natural-vibration.md) |
| `Participating mass` | Each mode's participating mass along X, Y and Z, as a percentage, and the running total. | [Natural Vibration](../analysis/natural-vibration.md) |
| `Buckling factors` | Each buckling mode's load factor. | [Linear Buckling](../analysis/linear-buckling.md) |
| `Footfall response` | The nodes that respond most to footfall, worst first: their response factor R, its steady-state and transient parts, their accelerations and the pace that gives R. | [Footfall Analysis](../analysis/footfall.md) |
| `Load patterns` | Each [load pattern](../loads/load-pattern.md): its factor, its loads, and the force they add up to along X, Y and Z, with the total. The total is what the supports carry when all the patterns act together: check it against **Support reactions**. | any |
| `Load combinations` | Each [load combination](../loads/load-combination.md) of the models given: its type, and its patterns with their factors. | [Run Analysis](../analysis/run-analysis.md) of a model with combinations |
| `Results by combination` | Each combination analysed, or each static model given: its largest displacement and node, and the sum of its reactions. A combination that did not converge has dashes, and the note says why. | [Run Analysis](../analysis/run-analysis.md) |
| `Steel check by section` | The steel members checked to EN 1993-1-1 over the ultimate combinations: each section's worst member, its governing check with its clause, its utilisation, the combination and OK or Fails. | [Run Analysis](../analysis/run-analysis.md) |
| `Steel check by member` | The same, every steel member, worst first, with its class. | [Run Analysis](../analysis/run-analysis.md) |
| `About the calculation` | What the report was made with: the Alpaca4d and OpenSees versions, the units, how many models and when it was written. | any |
| `Analyses` | Each model given and how it was solved: its analysis and combination, and OpenSees' integrator, steps, algorithm, convergence test and solver. | any |

The **Columns** menu holds a checkbox for each thing the table picked can show — its columns, and
rows such as the sum of the reactions or the note under the table — all ticked to start with. Untick
what the report has no use for: Length of **Beam sections**, the eigenvalue of **Natural
frequencies**. Each table keeps its own.

| Table | What can be left out |
| --- | --- |
| `Model summary` | Nodes, Elements, Supports, Load patterns, Mass, Extent, Analyses |
| `Beam sections` | Material, Elements, Length, A, Iy, Iz, J |
| `Beam materials` | E, G, Poisson's ratio, Density |
| `Supports` | X, Y, Z, Tx, Ty, Tz, Rx, Ry, Rz |
| `Displacements` | Ux, Uy, Uz, \|U\| (rows), Smallest, Nodes, Note below |
| `Support reactions` | Fx, Fy, Fz, Mx, My, Mz, Sum (row), Note below |
| `Natural frequencies` | Eigenvalue, Angular frequency, Frequency, Period |
| `Participating mass` | Ux, Uy, Uz, Sum Ux, Sum Uy, Sum Uz, Note below |
| `Buckling factors` | Note below |
| `Footfall response` | Response factor R, Steady-state R, Transient R, Steady-state acceleration, Transient acceleration, Pace, Note below |
| `Load patterns` | Factor, Loads, Fx, Fy, Fz, Total (row), Note below |
| `Load combinations` | Type, Combination |
| `Results by combination` | Type, Largest displacement, Node, Sum Fx, Sum Fy, Sum Fz, Note below |
| `Steel check by section` | Grade, Members, Element, Governing, Combination, Result, Note below |
| `Steel check by member` | Section, Grade, Class, Governing, Combination, Result, Note below |
| `About the calculation` | Software, Solver, Units, Models, Written (rows) |
| `Analyses` | Combination, Integrator, Steps, Algorithm, Test, System, Note below |

**Note below** is the line of small print under the table: what it is after, and how to read it.

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Modes | `Modes` | Text | *all* | For a table of modes: which — `all`, a range such as `1-6`, or `1,3,5`. For **Footfall response**, how many nodes, the worst first: 10 if left empty. |
| Caption | `Caption` | Text | *the table's own* | Written above the table in place of its own caption. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Table | `Table` | Generic | The table, for the **Content** of the [Report](report.md). |

## 📈 When to use it

**Use it when**

- The report shows what the model is made of, or the numbers an analysis found.

A table of what a picture draws — the frequencies over the mode shapes, the reactions under the
deformed shape — can come with the picture instead: tick it in the **Tables** menu of
[Report View](report-view.md). Report Result Table is for a table on its own.

The table is read when the report is written, so it is always the model's as it is then. When the
Report has no model of the kind the table needs, that is noted in the report where the table would
have been, and in its **Log**.

The static tables read the last step the analysis recorded.

### The steel check

**Steel check by section** and **by member** check each steel beam to EN 1993-1-1, as
[Utilisation](../results/utilisation.md) does with its inputs left as they are: γM0 = γM1 = 1.0,
rolled sections, each member held at its ends, its buckling lengths node to node, its loads at the
shear centre, no sway. The note under the table says so. Each member is checked at its worst over the
ultimate combinations given, ULS, accidental and seismic, from [Load Combination](../loads/load-combination.md),
or, with no combination given, over every static model. A beam whose material has no steel grade
is not checked, and the note counts it. While an ultimate combination has no results - it did not
converge - the check is incomplete: a member that passes the others reads **Incomplete**, not OK,
and the note names the combination.

Where a member is braced otherwise, or your National Annex asks for other partial factors, check it
with Utilisation. A template written in JSON can set `"gammaM0"`, `"gammaM1"` and `"fabrication"`
(`Rolled` or `Welded`) on the table.
