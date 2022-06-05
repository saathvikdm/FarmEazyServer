const allowOnly = function (accessLevel, callback) {
  function checkUserRole(req, res) {
    // console.log(req.user[0].dataValues);
    const { UserTypeId } = req.user[0].dataValues;
    if (!(accessLevel & UserTypeId)) {
      res.status(403).json({ msg: "You do not have access to this" });
      return;
    }

    callback(req, res);
  }

  return checkUserRole;
};

export { allowOnly };
