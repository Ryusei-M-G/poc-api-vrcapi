export const verify = async (req, res) => {
  const id = req.body.id;
  const pass = req.body.pass;
  const code = req.body?.code;

  if (!id || !pass) {
    res
      .status(400)
      .json({ message: "bad request. please send id and password" });
    return;
  }
};
