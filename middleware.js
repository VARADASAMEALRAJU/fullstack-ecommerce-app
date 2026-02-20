// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // If there is a token, the user is authenticated
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/cart"],
};