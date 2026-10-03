import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Select } from "../components/ui/select";

const options = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

function Harness() {
  const [value, setValue] = useState("active");
  return <Select value={value} onChange={setValue} options={options} />;
}

describe("Select", () => {
  it("renders the selected value and changes it through the option menu", () => {
    render(<Harness />);

    expect(screen.getByRole("combobox").textContent).toContain("Active");
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Archived" }));
    expect(screen.getByRole("combobox").textContent).toContain("Archived");
  });

  it("exposes a hidden form value when a name is supplied", () => {
    render(
      <Select
        value="active"
        onChange={() => undefined}
        name="status"
        options={options}
      />,
    );

    expect(screen.getByDisplayValue("active").getAttribute("name")).toBe("status");
  });
});
