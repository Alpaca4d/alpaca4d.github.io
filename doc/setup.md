# ⚙️ Setup

Alpaca4d uses [OpenSees](https://opensees.berkeley.edu/) as its analysis engine. OpenSees is a free, open-source software developed at UC Berkeley — you need to download and install it separately, then tell Alpaca4d where to find it.

## Step 1 — Download OpenSees

Go to the official OpenSees download page and grab the executable for your operating system:

👉 [https://opensees.berkeley.edu/OpenSees/user/download.php](https://opensees.berkeley.edu/OpenSees/user/download.php)

You can also reach this page directly from Grasshopper via **Alpaca4d → Settings → Download OpenSees...**.

Save the executable somewhere permanent on your machine (e.g. `C:\OpenSees\OpenSees.exe` on Windows or `/usr/local/bin/OpenSees` on Mac/Linux).

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
