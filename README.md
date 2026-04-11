Install pywebview based on the system manually
Remove non-matching pywebview dependancy first
eg: pdm remove pywebview
    pdm add "pywebview[edgechromium]>=6.1"

  windows = "pywebview[edgechromium]>=6.1"
  linux = "pywebview[gtk]>=6.1"
  mac = "pywebview>=6.1"
