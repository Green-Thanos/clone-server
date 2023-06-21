const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/get') {
    const { url: requestedUrl } = query;

    if (!requestedUrl) {
      res.statusCode = 400;
      res.end('Missing URL parameter');
      return;
    }

    http.get(requestedUrl, (response) => {
      let html = '';

      response.on('data', (chunk) => {
        html += chunk;
      });

      response.on('end', () => {
        res.setHeader('Content-type', 'text/html');
        res.statusCode = 200;
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>HTML Downloader</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }

              label {
                display: block;
                margin-bottom: 10px;
              }

              input[type="text"] {
                width: 300px;
                padding: 5px;
              }

              button {
                padding: 5px 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
              }

              button:hover {
                background-color: #45a049;
              }
            </style>
          </head>
          <body>
            <h2>HTML Downloader</h2>
            <label for="url">Enter URL:</label>
            <input type="text" id="url" name="url">
            <button onclick="downloadHTML()">Download</button>

            <script>
              function downloadHTML() {
                const urlInput = document.getElementById('url');
                const url = urlInput.value;

                if (url.trim() === '') {
                  alert('Please enter a URL');
                  return;
                }

                // Redirect to the /get endpoint with the URL as a query parameter
                window.location.href = '/get?url=' + encodeURIComponent(url);
              }
            </script>
          </body>
          </html>
        `);
      });
    }).on('error', (error) => {
      console.error('Error fetching HTML:', error);
      res.statusCode = 500;
      res.end('Error fetching HTML');
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const port = 8081;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
