import { ImageResponse } from "next/og";

export const runtime = "nodejs";

function parseNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const labelWidthMm = parseNumber(searchParams.get("labelWidthMm"), 70);
  const labelHeightMm = parseNumber(searchParams.get("labelHeightMm"), 45);
  const rollOuterDiameterMm = parseNumber(searchParams.get("rollOuterDiameterMm"), 115);
  const rollCoreMm = parseNumber(searchParams.get("rollCoreMm"), 40);
  const rollCoreLabel = searchParams.get("rollCoreLabel") ?? `${rollCoreMm} mm`;
  const labelFlowType = searchParams.get("labelFlowType") ?? "gap";
  const hasBackgroundColor = searchParams.get("hasBackgroundColor") === "true";
  const backgroundColorHex = searchParams.get("backgroundColorHex") ?? "#FFFFFF";
  const isContinuous = labelFlowType === "continuous";

  return new ImageResponse(
    (
      <div
        style={{
          width: 320,
          height: 620,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "#f8fafc",
          padding: 14,
          fontFamily: "Arial"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            background: "#ffffff",
            padding: 14
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: 10
            }}
          >
            Format etiqueta
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                padding: "5px 8px",
                borderRadius: 999,
                background: "#e2e8f0",
                color: "#1e293b",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              Amplada {labelWidthMm} mm
            </div>
            {!isContinuous && (
              <div
                style={{
                  display: "flex",
                  padding: "5px 8px",
                  borderRadius: 999,
                  background: "#e2e8f0",
                  color: "#1e293b",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}
              >
                Avanç {labelHeightMm} mm
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#f8fafc",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: 12
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                color: "#0f172a",
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 8
              }}
            >
              {labelWidthMm} mm
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 210 }}>
                <div
                  style={{
                    width: 188,
                    height: 96,
                    borderRadius: 10,
                    border: "2px solid #334155",
                    background: hasBackgroundColor ? backgroundColorHex : "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 12
                  }}
                >
                  <div
                    style={{
                      width: 146,
                      height: 14,
                      borderRadius: 4,
                      background: "#e2e8f0",
                      alignSelf: "center",
                      marginBottom: 14
                    }}
                  />
                  <div
                    style={{
                      width: 104,
                      height: 5,
                      borderRadius: 3,
                      background: "#cbd5e1",
                      marginBottom: 10
                    }}
                  />
                  <div
                    style={{
                      width: 68,
                      height: 5,
                      borderRadius: 3,
                      background: "#cbd5e1"
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: "#64748b",
                    marginTop: 8
                  }}
                >
                  SORTIDA
                </div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1 }}>↓</div>
              </div>
              {!isContinuous && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginLeft: 4
                  }}
                >
                  <div
                    style={{
                      color: "#0f172a",
                      fontSize: 16,
                      fontWeight: 700,
                      marginBottom: 8
                    }}
                  >
                    {labelHeightMm} mm
                  </div>
                  <div
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      color: "#64748b",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    AVANÇ
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            background: "#ffffff",
            padding: 14,
            flex: 1
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: 10
            }}
          >
            Bobina
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                padding: "5px 8px",
                borderRadius: 999,
                background: "#e2e8f0",
                color: "#1e293b",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              Diametre {rollOuterDiameterMm} mm
            </div>
            <div
              style={{
                display: "flex",
                padding: "5px 8px",
                borderRadius: 999,
                background: "#e2e8f0",
                color: "#1e293b",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              Mandril {rollCoreLabel}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              background: "#f8fafc",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: 12,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ color: "#0f172a", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
              {rollOuterDiameterMm} mm
            </div>
            <div
              style={{
                width: 146,
                height: 146,
                borderRadius: 999,
                border: "2px solid #475569",
                background: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 999,
                  border: "2px solid #64748b",
                  background: "#ffffff"
                }}
              />
            </div>
            <div style={{ color: "#0f172a", fontSize: 26, fontWeight: 700 }}>{rollCoreLabel}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 320,
      height: 620
    }
  );
}
