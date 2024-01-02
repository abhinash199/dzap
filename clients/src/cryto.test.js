import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
// Import the components
import CryptoApp from "./components/Crypto";
import "@testing-library/jest-dom";

describe("CryptoApp Component", () => {
  it("renders the component with initial values", () => {
    const { getByLabelText, screen, getByText, getByTestId } = render(
      <CryptoApp />
    );
    expect(getByLabelText("Amount:")).toBeInTheDocument();
    expect(getByText("From")).toBeInTheDocument();
    expect(getByText("To")).toBeInTheDocument();
    expect(getByText("Convert")).toBeInTheDocument();
  });

  it("handles user input and conversion correctly", async () => {
    const { getByText, getByTestId } = render(<CryptoApp />);

    // Simulate user input
    fireEvent.change(getByTestId("amount-input"), { target: { value: "10" } });
    fireEvent.change(getByTestId("from-select"), { target: { value: "btc" } });
    fireEvent.change(getByTestId("to-select"), { target: { value: "eur" } });

    // Simulate button click
    fireEvent.click(getByText("Convert"));

    // Wait for the conversion result to be displayed
    await waitFor(() => {
      expect(getByTestId("result")).toBeInTheDocument();
      expect(getByTestId("result")).toHaveTextContent("Convert");
    });
  });

  it("displays error message when conversion fails", async () => {
    const { getByLabelText, getByText, getByTestId } = render(<CryptoApp />);

    // Simulate user input
    fireEvent.change(getByTestId("amount-input"), {
      target: { value: "invalidAmount" },
    });
    fireEvent.change(getByTestId("from-select"), { target: { value: "btc" } });
    fireEvent.change(getByTestId("to-select"), { target: { value: "eur" } });

    // Simulate button click
    fireEvent.click(getByText("Convert"));
  });
});
