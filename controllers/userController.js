exports.getUsers = async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      data: [],
    },
  });
};
