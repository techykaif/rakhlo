import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "../components/ui/select";

const options = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

describe("Select", () => {
  it("renders the selected value and changes it through the option menu", () => {
    let value = "active";

    const { rerender } = render(
      <Select
        value={value}
        onChange={(next) => {
          value = next;
          rerender(
            <Select
              value={value}
              onChange={(nextValue) => {
                value = nextValue;
                rerender(
                  <Select
                    value={value}
                    onChange={() => undefined}
                    options={options}
                  />,
                );
              }}
              options={options}
            />,
          );
        }}
        options={options}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Active");
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Archived" }));
    expect(screen.getByRole("combobox")).toHaveTextContent("Archived");
  });

  it("exposes a hidden form value when a name is supplied", () => {
    render(
      <Select value="active" onChange={() => undefined} name="status" options={options} />,
    );

    expect(screen.getByDisplayValue("active")).toHaveAttribute("name", "status");
  });
});
