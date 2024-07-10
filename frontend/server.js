const express = require('express');
const path = require('path');
 
const app = express();
const port = process.env.PORT || 3000;
 
const distDir = path.join(__dirname, 'dist/browser');
 
app.use(express.static(distDir));
 
app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  console.log(`Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Error serving index.html: ${err}`);
      res.status(500).send(err);
    }
  });
});
 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});