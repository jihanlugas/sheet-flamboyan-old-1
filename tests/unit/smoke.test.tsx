import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  EmptyState,
  ErrorState,
  FormField,
  Input,
  LoadingState,
  StatusBadge,
  Table,
  TableRegion,
} from "@/src/components/ui";

afterEach(cleanup);

describe("foundation UI", () => {
  it("associates a field label and validation message with its input", () => {
    render(
      <FormField error="Alamat email belum valid." id="email" label="Email" required>
        <Input
          id="email"
          required
          type="email"
        />
      </FormField>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("email-error");
    expect(screen.getByRole("alert").textContent).toBe("Alamat email belum valid.");
  });

  it("keeps status meaning in text and tables inside a named scroll region", () => {
    render(
      <>
        <StatusBadge tone="warning">Menunggu</StatusBadge>
        <TableRegion label="Daftar contoh">
          <Table>
            <caption>Daftar contoh</caption>
            <tbody>
              <tr>
                <td>Baris contoh</td>
              </tr>
            </tbody>
          </Table>
        </TableRegion>
      </>,
    );

    expect(screen.getByText("Menunggu")).toBeTruthy();
    expect(screen.getByRole("region", { name: "Daftar contoh" })).toBeTruthy();
    expect(screen.getByRole("table", { name: "Daftar contoh" })).toBeTruthy();
  });

  it("announces loading, error, and empty states with distinct semantics", () => {
    const { container, rerender } = render(<LoadingState>Memuat daftar pemain.</LoadingState>);

    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("Memuat daftar pemain.");

    rerender(<ErrorState>Daftar pemain gagal dimuat.</ErrorState>);
    expect(screen.getByRole("alert").textContent).toContain("Daftar pemain gagal dimuat.");

    rerender(<EmptyState>Belum ada pemain.</EmptyState>);
    expect(screen.getByRole("status").textContent).toContain("Belum ada pemain.");
  });
});
