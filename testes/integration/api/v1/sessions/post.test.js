import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";
import orchestrator from "testes/orchestrator.js";
import session from "models/session.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With incorrect 'email' but correct 'password'", async () => {
      await orchestrator.createUser({
        password: "senha-correta",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email-incorreto@live.com",
          password: "senha-correta",
        }),
      });

      const responseBody = await response.json();
      expect(response.status).toBe(401);

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Os dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estam corretos.",
        status_code: 401,
      });
    });

    test("With correct 'email' but incorrect 'password'", async () => {
      await orchestrator.createUser({
        email: "email-correto@live.com",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email-correto@live.com",
          password: "senha-incorreta",
        }),
      });

      const responseBody = await response.json();
      expect(response.status).toBe(401);

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Os dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estam corretos.",
        status_code: 401,
      });
    });

    test("With incorrect 'email' and incorrect 'password'", async () => {
      await orchestrator.createUser({});
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email-incorreto@live.com",
          password: "senha-incorreta",
        }),
      });

      const responseBody = await response.json();
      expect(response.status).toBe(401);

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Os dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estam corretos.",
        status_code: 401,
      });
    });

    test("With correct 'email' and correct 'password'", async () => {
      const createdUser = await orchestrator.createUser({
        email: "email-e-senha-corretos@live.com",
        password: "email-e-senha-corretos",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email-e-senha-corretos@live.com",
          password: "email-e-senha-corretos",
        }),
      });

      const responseBody = await response.json();
      expect(response.status).toBe(201);

      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: createdUser.id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const expires_at = new Date(responseBody.expires_at);
      const created_at = new Date(responseBody.created_at);

      created_at.setMilliseconds(0);
      expires_at.setMilliseconds(0);
      expect(expires_at - created_at).toBe(session.EXPIRATION_IN_MILLISECONDS);

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: responseBody.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });
  });
});
