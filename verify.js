export const verify = async (req, res) => {
 const { VRCHAT_USERNAME, VRCHAT_PASSWORD, VRCHAT_CODE } = req.body;

  if (!VRCHAT_USERNAME|| !VRCHAT_PASSWORD) {
    res
      .status(400)
      .json({ message: "bad request. please send id and password" });
    return;
  }


};
