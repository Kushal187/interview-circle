import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import connectDB from "../db/connectDB.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const db = await connectDB();
      const user = await db.collection("users").findOne({ username });

      if (!user) {
        return done(null, false, { message: "Invalid username or password" });
      }

      const isMatch = await bcrypt.compare(password, user.hashedPassword);
      if (!isMatch) {
        return done(null, false, { message: "Invalid username or password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await connectDB();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
