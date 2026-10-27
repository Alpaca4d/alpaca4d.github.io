# ⚙️ Setup

Alpaca4d uses [OpenSees](https://opensees.berkeley.edu/) as its analysis engine. OpenSees is a free, open-source software developed at UC Berkeley — you need to download and install it separately, then tell Alpaca4d where to find it.

## Step 1 — Download OpenSees

Go to the official OpenSees download page and grab the executable for your operating system:

👉 [https://opensees.berkeley.edu/OpenSees/user/download.php](https://opensees.berkeley.edu/OpenSees/user/download.php)

You can also reach this page directly from Grasshopper via **Alpaca4d → Settings → Download OpenSees...**.

Save the executable somewhere permanent on your machine (e.g. `C:\OpenSees\OpenSees.exe` on Windows or `/usr/local/bin/OpenSees` on Mac/Linux).

An OpenSees built with Mumps solves large models on every core of the machine, and Alpaca4d uses it when it finds it: see [Solving on several cores](#solving-on-several-cores).

{% hint style="info" %}
The [Ten Node Tetrahedron](basics/elements/ten-node-tetrahedron.md) needs an OpenSees built from the master branch since 16 October 2026. OpenSees 3.8.0 and the releases before it do not have the element's fixes, and Run Analysis says so rather than solve with it. Every other element runs on 3.8.0.
{% endhint %}

## Step 2 — Set the OpenSees Executable in Alpaca4d

Once OpenSees is downloaded:

1. Open Rhino3D and launch Grasshopper.
2. In the Grasshopper menu bar, click **Alpaca4d → Settings → Set OpenSees Executable...**
3. A file browser opens — navigate to and select the OpenSees executable you downloaded.
4. A confirmation message will appear: `OpenSees path set to: ...`

The path is saved automatically and persists across sessions — you only need to do this once.

## Step 3 — Run an Analysis

With the executable set, any Alpaca4d analysis component (Run Analysis, Natural Vibration, Moment Curvature, etc.) will find and launch OpenSees automatically.

If the path is not configured, the component will show a red error:

> *OpenSees executable path is not configured. Use Alpaca4d → Settings → Set OpenSees Executable in the Grasshopper menu.*

## Resetting the Path

To clear a previously saved path, go to **Alpaca4d → Settings → Clear OpenSees Path**. You can then set a new one with "Set OpenSees Executable...".

**Alpaca4d → Settings → Display...** sets the colours [Model View](basics/visualisation/model-view.md) draws node ids, element ids, section names and loads in, and the colour of the values [View Results](basics/visualisation/view-results.md) writes. They are kept in the same settings file as the OpenSees path.

## Solving on several cores

The OpenSees downloaded from UC Berkeley solves on one core. An OpenSees built with **Mumps**
factorises on every core of the machine. On a large model that makes an analysis 2 to 18 times
quicker, and it needs less memory. On a small one it makes no difference.
[Analysis Settings](basics/analysis/analysis-settings.md#solving-on-several-cores) has the timings.

Alpaca4d works with either OpenSees, and nothing in a definition has to change. The default System,
`Auto`, uses Mumps when the OpenSees has it, and `BandSPD` on one core when it does not. To use an
OpenSees built with Mumps, point Alpaca4d at it like any other, with **Alpaca4d → Settings → Set
OpenSees Executable...**.

Every analysis then solves on all the cores. To use fewer, right-click
[Analysis Settings](basics/analysis/analysis-settings.md#right-click-menu) and pick a number under
**Cores for Mumps**. [Natural Vibration](basics/analysis/natural-vibration.md) always uses every
core.
