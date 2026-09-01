# Run Analysis

Writes the model out as an OpenSees `.tcl` deck, launches the solver, and hands back the
model with the results attached.

## 🔧 Grasshopper component

`Run Analysis (Alpaca4d)` — **Alpaca4d ▸ 07_Analysis**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The assembled model, from [Assemble](../assemble.md). |
| Settings | `Settings` | Settings | — | From [Analysis Settings](analysis-settings.md). |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| log | `log` | Text | Everything OpenSees printed — the console output and any error stream. **Read this first when something goes wrong.** |
| AlpacaModel | `AlpacaModel` | Model | The same model, now carrying results. Feed it to the [Results](../results/README.md) and [Visualisation](../visualisation/README.md) components. `null` if the analysis failed. |

## 💡 Where the files go

The deck and the results are written **next to the Grasshopper file**:

| File | Contents |
| --- | --- |
| `AlpacaModel.tcl` | The input deck. |
| `recorder.mpco` | The MPCO result database. |

If the Grasshopper document has never been saved, Run Analysis falls back to the current
working directory. Save the file first — it makes the output findable, and it is required by
[Natural Vibration](natural-vibration.md).

The recorder that is attached depends on the analysis type: a static recorder for `Static`,
a transient one for `Transient`.

## 💡 Errors and how they surface

| What you see | What happened |
| --- | --- |
| *"OpenSees executable path is not configured"* | Set it — **Alpaca4d ▸ Settings ▸ Set OpenSees Executable…**. See [Setup](../../setup.md). |
| *"Analysis Failed: OpenSees exited with an error"* | The deck itself failed — a bad command, an undefined material. The **log** names the line. |
| *"Analysis Failed: OpenSees 'analyze' did not converge"* | The deck was valid but the solution did not converge. Loosen the [Test](test.md) tolerance, raise its iteration count, take smaller steps in [Analysis Step](analysis-step.md), or change the algorithm. |
| *"Warning! Double check the log!"* | OpenSees printed a warning and carried on. The results exist but deserve a look. |

On any failure the `AlpacaModel` output is `null`, so the downstream result components go
quiet rather than showing stale numbers.

## 📈 When to use it

**Use it when** you want a static or transient solution.

**Do not use it when** you want modes and periods → [Natural Vibration](natural-vibration.md)
sets up its own eigenvalue run and needs no settings.

## 🔗 Relation to OpenSees

The component assembles and runs a complete deck: the model, then the recorder, then the
analysis block from [Analysis Settings](analysis-settings.md), then `wipe`. To see exactly
what was sent, use [Serialize](../utility/serialize.md), or open the `AlpacaModel.tcl` it
leaves behind.
