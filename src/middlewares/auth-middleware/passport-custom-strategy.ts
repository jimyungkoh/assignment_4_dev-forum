import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import prismaClient from "../../database/sql";

const JWT_SECRET = process.env.JWT_SECRET || "";

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    try {
      const user = await prismaClient.user.findUnique({
        where: { email: jwtPayload.sub },
      });
      if (user) {
        return done(null, { email: jwtPayload.sub });
      } else {
        return done(null, false, {
          message: "올바르지 않은 인증 정보입니다.",
        });
      }
    } catch (error) {
      return done(error);
    }
  }
);

passport.use(jwtStrategy);
