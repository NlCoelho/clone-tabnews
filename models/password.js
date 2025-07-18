import bcryptjs from "bcryptjs";

const pepper = "bcryptPepper123";

async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password + pepper, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword + pepper, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
