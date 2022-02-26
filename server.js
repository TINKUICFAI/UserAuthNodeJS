const app = require("./app.js");

// Default Ports
const PORT = process.env.PORT || 3000;

async function startServer() {
    // initiailze db

    // Start server on default port or in custom port
    app.listen(PORT, () => {
        console.log(`Database is started`);
        console.log(`Server is running on PORT: ${PORT}`);
    });
}

startServer();
