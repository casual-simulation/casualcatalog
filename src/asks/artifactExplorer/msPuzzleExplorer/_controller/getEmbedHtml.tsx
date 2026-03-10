return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Artifact Embed</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
    }
    iframe {
      flex: 1;
      border: none;
    }
  </style>
</head>
<body>
  <iframe src="${that}"></iframe>
</body>
</html>
`