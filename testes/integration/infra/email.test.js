import email from "infra/email.js";
import orchestrator from "testes/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "EuMEsmo <smells78@hotmail.com>",
      to: "teste@curso.dev",
      subject: "TESTE DE EMAIL",
      text: "QWERTY",
    });

    await email.send({
      from: "EuMEsmo <smells78@hotmail.com>",
      to: "teste@curso.dev",
      subject: "SEGUNDO TESTE DE EMAIL",
      text: "Corpo do último email.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<smells78@hotmail.com>");
    expect(lastEmail.recipients[0]).toBe("<teste@curso.dev>");
    expect(lastEmail.subject).toBe("SEGUNDO TESTE DE EMAIL");
    expect(lastEmail.text).toBe("Corpo do último email.\r\n");
  });
});
