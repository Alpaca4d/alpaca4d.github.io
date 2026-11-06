# 🔌 Alpaca4d and OpenSees

Alpaca4d does not solve the model itself. It writes the model as an OpenSees input file, a Tcl
script, runs the OpenSees program installed on your computer on it, and reads the results back
from the file OpenSees records them in. Grasshopper is where the model is built and the results
are read; OpenSees is where it is solved.

## What happens when you press run

1. **The deck is written.** [Assemble](../basics/assemble.md) has already made the components one
   model, and each piece knows the OpenSees command it stands for: `element forceBeamColumn`,
   `fix`, `pattern Plain` and the rest. [Run Analysis](../basics/analysis/run-analysis.md) writes
   them out as a `.tcl` deck: the model, then the recorder, then the analysis block from
   [Analysis Settings](../basics/analysis/analysis-settings.md), then `wipe`.
2. **OpenSees runs.** Run Analysis starts the OpenSees executable set under **Alpaca4d ▸ Settings ▸
   Set OpenSees Executable…**, with the deck as its argument, and waits for it to finish.
3. **The results are recorded.** As OpenSees solves, its MPCO recorder writes the results of every
   converged step to a results file.
4. **The model comes back.** Everything OpenSees printed becomes the **log** output. Run Analysis
   reads it for errors and warnings, and hands back the model with its results attached, or an
   empty output if the run failed, so the result components go quiet rather than show stale
   numbers.
5. **The results are read.** The [result components](../basics/results/README.md) and
   [Model View](../basics/visualisation/model-view.md) read the results file when they compute,
   not when the analysis runs.

The other analyses work the same way, with a deck of their own.
[Natural Vibration](../basics/analysis/natural-vibration.md) runs an `eigen` command, reads the
eigenvalues from what OpenSees prints and the modal properties from a report file.
[Linear Buckling](../basics/analysis/linear-buckling.md) has OpenSees print the stiffness matrices
and solves the eigenvalue problem in Alpaca4d itself, since OpenSees has no buckling analysis.
[Moment Curvature](../basics/moment-curvature/moment-curvature.md) runs a section-analysis deck,
which its **log** output shows in full.

## The results file

The MPCO recorder, written by M. Petracca and G. Camata at ASDEA Software Technology, writes an
HDF5 file that the result components read back, and that STKO opens too. Run Analysis records a
set of results to suit the analysis type: a transient analysis adds velocities and accelerations
to what a static one records. An [MPCO Recorder](../basics/mpco-recorder.md) on Assemble chooses
the results instead: leaving out what you will not read makes a large analysis faster and its file
smaller. Every converged step is recorded, so the steps the result components can read are
the steps of [Analysis Step](../basics/analysis/analysis-step.md).

## Where the files go

The decks and the results files go into a folder called `AlpacaResults`, next to the Grasshopper
file. Each name carries the first eight characters of the analysis component's InstanceGuid and
the number of the run, such as `recorder_<id>_0.mpco`. Two analysis components in one document, or one component solving a
tree of models, one per branch, each keep files of their own, and solving again overwrites the
same files rather than adding new ones. A results file named on an MPCO Recorder goes beside the
Grasshopper file itself.

Save the Grasshopper file first. Unsaved, Run Analysis writes its files to a folder in the
system's temporary folder, and Natural Vibration refuses to run. Since the result components read
the results file later, keep it where the analysis left it.

## Why OpenSees is installed separately

[OpenSees](../references/opensees.md) is open-source software from UC Berkeley, under the
Regents' own licence. It is free to use, but selling software that includes OpenSees source code
needs a licence from UC Berkeley. Alpaca4d is a commercial plug-in, and it does not include,
bundle or resell OpenSees: your use of OpenSees runs under UC Berkeley's terms, which you accept
with them when you download it ([License](../references/license.md)). You download it yourself and
point Alpaca4d at it once, as [Setup](../setup.md) describes; the path is kept from one session to
the next.

It also leaves the choice of OpenSees to you:

- The OpenSees from UC Berkeley solves on one core. One built with **Mumps** factorises on every
  core, which makes a large model 2 to 18 times quicker. The default System, `Auto`, uses Mumps
  when the OpenSees has it.
- The [Ten Node Tetrahedron](../basics/elements/ten-node-tetrahedron.md) needs an OpenSees built
  from master since 16 October 2026. Run Analysis says so on an older one, rather than solve.
- Linear Buckling on OpenSees 3.8.0 is limited to 4000 equations; a newer build has no such limit.

## The deck is yours

The `.tcl` deck is plain text in OpenSees's own documented format. You can read it to see exactly
what was solved, keep it with the project, or run it with any OpenSees build, without Alpaca4d.
[Serialize](../basics/utility/serialize.md) writes the model part of the deck without running it,
and [Deserialise](../basics/utility/deserialise.md) reads one back into a model. When a result
looks wrong, reading the deck and the **log** is the quickest way to find out why.

How closely the answers match textbook and NAFEMS results is shown in the
[benchmarks](../benchmark/intro.md).

## See also

- [Setup](../setup.md) — installing OpenSees and pointing Alpaca4d at it
- [Run Analysis](../basics/analysis/run-analysis.md) — the errors and what they mean
- [MPCO Recorder](../basics/mpco-recorder.md) — choosing what is recorded
- [OpenSees](../references/opensees.md) — the program and its licence
- [License](../references/license.md) — what Alpaca4d covers and what it does not
- [How a model is built](how-a-model-is-built.md) — the chain that produces the deck
