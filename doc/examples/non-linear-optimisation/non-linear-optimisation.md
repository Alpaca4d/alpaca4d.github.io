# ⛰️ Non-Linear Optimisation

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/examples/non-linear-optimisation/non-linear-optimisation.png" alt="Six optimisation cases over their sliders' ranges, each with where the sliders start and the answer it should end at"><figcaption></figcaption></figure>

[non-linear-optimisation](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/examples/non-linear-optimisation/non-linear-optimisation.gh)

Eight cases for [Non-Linear Optimisation](../../basics/optimisation/non-linear-optimisation.md),
each with a known answer. Every case has its sliders, its objective - and constraints, where it
has them - as Expression components, an optimiser already linked to them and set to the algorithm
the case is for, and a panel saying what to expect.

Double-click an optimiser, press **Start**, and compare where the sliders end with the panel. One
Undo puts the sliders back where they started.

| Case | Algorithm | Expect |
| --- | --- | --- |
| 1 Rosenbrock | BOBYQA | 0 at (1, 1) |
| 2 Branin | DIRECT-L | 0.3979 at one of three points |
| 3 A hill, maximised | Nelder-Mead | 5 at (2, -1) |
| 4 NLopt's tutorial, two constraints | COBYLA | 0.5443 at (0.3333, 0.2963) |
| 5 Outside the unit circle, one constraint | ISRES | about -1.414 at about (-0.707, -0.707) |
| 6 Rastrigin | CRS2-LM | 0 at (0, 0) |
| 7 A gene pool of 12 | Sbplx | 0, every gene at 0.3 |
| 8 Three set-ups to refuse or warn about | - | a warning, and two refusals |

The cases cover every algorithm Non-Linear Optimisation has: local and global, with constraints
and without, minimising and maximising, sliders and a Galapagos gene pool. Case 8 is set up wrong
on purpose, to show what the optimiser says when it cannot run.

Each case is a function of two numbers, small enough to solve in moments. To optimise a structure,
link the sliders of the design instead, and an output of the analysis - the mass, say - as the
objective; see [Searching for the best design](../../basics/optimisation/README.md#searching-for-the-best-design).
