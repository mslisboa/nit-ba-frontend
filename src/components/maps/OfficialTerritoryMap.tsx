"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TerritoryCount = {
  id: number;
  nome: string;
  total_nits: number;
};

type Shape = {
  name: string;
  path: string;
  centroid: { x: number; y: number };
};

type OfficialTerritoryMapProps = {
  territories: TerritoryCount[];
  selectedName?: string | null;
};

const BOUNDS = {
  minX: -46.65,
  maxX: -37.3,
  minY: -18.38,
  maxY: -8.5,
};

function normalizeTerritory(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function project(point: [number, number]) {
  const [longitude, latitude] = point;

  return [
    18 + ((longitude - BOUNDS.minX) / (BOUNDS.maxX - BOUNDS.minX)) * 584,
    16 + ((BOUNDS.maxY - latitude) / (BOUNDS.maxY - BOUNDS.minY)) * 648,
  ];
}

export function OfficialTerritoryMap({
  territories,
  selectedName,
}: OfficialTerritoryMapProps) {
  const router = useRouter();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalSelected, setInternalSelected] = useState<string | null>(
    selectedName ?? null,
  );

  const counts = new Map(
    territories.map((territory) => [territory.nome, territory.total_nits]),
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/assets/data/territorios-identidade.geojson");

        if (!response.ok) {
          throw new Error("GeoJSON indisponível");
        }

        const geojson = await response.json();
        const territoryByName = new Map(
          territories.map((territory) => [
            normalizeTerritory(territory.nome),
            territory,
          ]),
        );
        const nextShapes: Shape[] = [];

        for (const feature of geojson.features) {
          const rawName = feature.properties?.nm_ti || feature.properties?.NM_TI;
          const name =
            territoryByName.get(normalizeTerritory(rawName))?.nome ?? rawName;
          const polygons =
            feature.geometry.type === "Polygon"
              ? [feature.geometry.coordinates]
              : feature.geometry.coordinates;

          let pointCount = 0;
          let centroidX = 0;
          let centroidY = 0;

          const pathData = polygons
            .map((polygon: number[][][]) =>
              polygon
                .map((ring: number[][], ringIndex: number) =>
                  ring
                    .map((point: number[], pointIndex: number) => {
                      const [x, y] = project(point as [number, number]);

                      if (ringIndex === 0) {
                        centroidX += x;
                        centroidY += y;
                        pointCount += 1;
                      }

                      return `${pointIndex === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(" ") + " Z",
                )
                .join(" "),
            )
            .join(" ");

          nextShapes.push({
            name,
            path: pathData,
            centroid:
              pointCount > 0
                ? { x: centroidX / pointCount, y: centroidY / pointCount }
                : { x: 310, y: 340 },
          });
        }

        if (active) {
          setShapes(nextShapes);
        }
      } catch {
        if (active) {
          setError("Não foi possível carregar o mapa territorial.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [territories]);

  function selectTerritory(name: string) {
    setInternalSelected(name);
    const territory = territories.find((item) => item.nome === name);

    if (territory) {
      router.push(`/territorios/${territory.id}`);
    }
  }

  const effectiveSelected = selectedName ?? internalSelected;

  if (loading) {
    return (
      <div className="bahia-map" aria-busy="true">
        <svg
          viewBox="0 0 620 680"
          role="group"
          aria-label="Carregando mapa dos Territórios de Identidade"
        >
          <text x="310" y="330" textAnchor="middle">
            Carregando mapa oficial…
          </text>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bahia-map">
        <svg viewBox="0 0 620 680" role="group" aria-label="Erro ao carregar mapa">
          <text x="310" y="330" textAnchor="middle" className="map-load-error">
            {error}
          </text>
        </svg>
        <button
          type="button"
          className="button secondary"
          onClick={() => window.location.reload()}
        >
          Tentar carregar o mapa novamente
        </button>
      </div>
    );
  }

  return (
    <div className="bahia-map official-map-stage">
      <svg
        viewBox="0 0 620 680"
        role="group"
        aria-label="Mapa dos 27 Territórios de Identidade da Bahia"
      >
        {shapes.map((shape) => {
          const count = counts.get(shape.name) ?? 0;
          const intensity = Math.min(1, 0.18 + count * 0.13);
          const selected = effectiveSelected === shape.name;

          return (
            <g key={shape.name}>
              <path
                d={shape.path}
                className={`official-territory-shape${
                  count === 0 ? " is-empty" : ""
                }${selected ? " is-selected" : ""}`}
                style={{ "--territory-intensity": String(intensity) } as React.CSSProperties}
                tabIndex={0}
                role="button"
                aria-label={`Filtrar por ${shape.name}`}
                onClick={() => selectTerritory(shape.name)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectTerritory(shape.name);
                  }
                }}
                data-territory-shape={shape.name}
              />
              <text
                x={shape.centroid.x}
                y={shape.centroid.y}
                className={`official-territory-count${
                  count === 0 ? " is-empty" : ""
                }`}
                data-territory-label={shape.name}
              >
                {count}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="official-map-source">
        Limites territoriais: SEI Bahia · camada vetorial oficial simplificada
      </div>
    </div>
  );
}
