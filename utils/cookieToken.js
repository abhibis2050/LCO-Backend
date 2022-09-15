const cookieToken = (user, res) => {
  const token = user.getJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000 // 3(days) * 24 (hours) * 60 (min) * 60 (sec) * 1000(mili sec)
    ),
    httpOnly: true,
  };
  // we set up an extra json response part  because
  //cookies will be set up for web but for mobile the criteria will be different
  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports =  cookieToken ;
