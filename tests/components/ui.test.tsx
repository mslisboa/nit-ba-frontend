/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { EmptyState } from "../../src/components/ui/EmptyState";
import { MetricCard } from "../../src/components/ui/MetricCard";
import { ValidationTag } from "../../src/components/ui/ValidationTag";

describe("componentes compartilhados", () => {
  it("renderiza a tag de validação confirmada", () => {
    render(<ValidationTag status="CONFIRMADA" />);

    expect(screen.getByText("Confirmada")).toBeTruthy();
  });

  it("renderiza o cartão de métrica", () => {
    render(<MetricCard value={12} label="NITs" detail="10 ativos" icon="N" />);

    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("NITs")).toBeTruthy();
    expect(screen.getByText("10 ativos")).toBeTruthy();
  });

  it("renderiza o estado vazio", () => {
    render(<EmptyState title="Nenhum registro" description="Ajuste os filtros." />);

    expect(screen.getByText("Nenhum registro")).toBeTruthy();
    expect(screen.getByText("Ajuste os filtros.")).toBeTruthy();
  });
});
