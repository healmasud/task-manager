const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const User = require("./models/user");

const main = async () => {
  // const task = await Task. findById('5c2e505a3253e18a43e612e6')
  // await task. populate(' owner'). execPopulate()
  // console. log (task. owner)
  const user = await User.findById("6232fb487e599e3365c23332");
  await user.populate("tasks").execPopulate();
  console.log(user.tasks);
};

main();
