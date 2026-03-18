function getMe(req, res) {
  const { _id, username, email, createdAt } = req.user;
  res.json({ user: { _id, username, email, createdAt } });
}

export { getMe };
