describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display the login form", () => {
    cy.get("form").should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
  });

  it("should show an error if login credentials are incorrect", () => {
    cy.get('input[name="email"]').type("wrong.email@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get("form").submit();

    cy.get(".Toastify__toast--error").should(
      "contain",
      "Mot de passe ou email invalide."
    );
  });

  it("should log in an existing user and redirect based on role", () => {
    const userEmail = "john.doe@example.com";
    const userPassword = "password123";

    cy.intercept("POST", "**/api/user/login", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          userFirstName: "John",
          userLastName: "Doe",
          userEmail: "john.doe@example.com",
          userRole: "customer",
        },
      });
    }).as("loginRequest");

    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type(userPassword);
    cy.get("form").submit();

    cy.wait("@loginRequest").then((interception) => {
      const user = interception.response.body;
      if (user.userRole === "admin") {
        cy.url().should("include", "/admin/admindashboard");
      } else {
        cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
      }
    });

    cy.get(".Toastify__toast--success").should(
      "contain",
      "Connexion réussie !"
    );
  });
});
