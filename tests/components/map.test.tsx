/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { OfficialTerritoryMap } from "../../src/components/maps/OfficialTerritoryMap";

describe("mapa territorial", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exibe erro quando o GeoJSON não pode ser carregado", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
    );

    render(<OfficialTerritoryMap territories={[]} />);

    await waitFor(() => {
      expect(
        screen.getByText("Não foi possível carregar o mapa territorial."),
      ).toBeTruthy();
    });
  });

  it("renderiza os polígonos quando o GeoJSON é carregado", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          features: [
            {
              properties: { nm_ti: "Irecê" },
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [-42, -11],
                    [-41, -11],
                    [-41, -10],
                    [-42, -10],
                    [-42, -11],
                  ],
                ],
              },
            },
          ],
        }),
      }),
    );

    render(
      <OfficialTerritoryMap
        territories={[{ id: 1, nome: "Irecê", total_nits: 3 }]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("group")).toBeTruthy();
    });
  });
});
