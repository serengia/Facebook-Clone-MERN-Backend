const app = require("./app");

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV}`);
});
