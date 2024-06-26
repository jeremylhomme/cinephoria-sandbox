describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("should display the registration form", () => {
    cy.get("form").should("exist");
    cy.get('input[name="userFirstName"]').should("exist");
    cy.get('input[name="userLastName"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('input[name="confirmUserPassword"]').should("exist");
  });

  it("should show an error if passwords do not match", () => {
    cy.get('input[name="userFirstName"]').type("John");
    cy.get('input[name="userLastName"]').type("Doe");
    cy.get('input[name="email"]').type("john.doe@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmUserPassword"]').type("password456");
    cy.get("form").submit();

    cy.get(".Toastify__toast--error").should(
      "contain",
      "Passwords do not match"
    );
  });

  it("should register a new user", () => {
    let userEmail = "john.doe@example.com";

    cy.checkUserExists(userEmail).then((response) => {
      console.log("User exists check response:", response);
      if (response.status === 200) {
        // User exists, change the email
        userEmail = `john.doe+${Date.now()}@example.com`;
      }

      cy.get('input[name="userFirstName"]').type("John");
      cy.get('input[name="userLastName"]').type("Doe");
      cy.get('input[name="email"]').type(userEmail);
      cy.get('input[name="password"]').type("password123");
      cy.get('input[name="confirmUserPassword"]').type("password123");
      cy.get("form").submit();

      cy.get(".Toastify__toast--success").should(
        "contain",
        "Inscription effectuée avec succès."
      );

      cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    });
  });
});
