import { ImageResponse } from "next/og";

export type EmailIllustrationImageParams = {
  labelWidthMm: number;
  labelHeightMm: number;
  labelFlowType: string;
  rollOuterDiameterMm: number;
  rollCoreMm: number;
  rollCoreLabel: string;
  hasBackgroundColor: boolean;
  backgroundColorHex: string;
};

export function createEmailIllustrationImageResponse(params: EmailIllustrationImageParams) {
  const isContinuous = params.labelFlowType === "continuous";

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
              display: "flex",
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
              {`Amplada ${params.labelWidthMm} mm`}
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
                {`Avanc ${params.labelHeightMm} mm`}
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
              {`${params.labelWidthMm} mm`}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 210 }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 188,
                    height: 96,
                    borderRadius: 10,
                    border: "2px solid #334155",
                    background: params.hasBackgroundColor ? params.backgroundColorHex : "#ffffff",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 12
                  }}
                >
                  <div
                    style={{
                      display: "flex",
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
                      display: "flex",
                      width: 104,
                      height: 5,
                      borderRadius: 3,
                      background: "#cbd5e1",
                      marginBottom: 10
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      width: 68,
                      height: 5,
                      borderRadius: 3,
                      background: "#cbd5e1"
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: "#64748b",
                    marginTop: 8
                  }}
                >
                  SORTIDA
                </div>
                <div style={{ display: "flex", fontSize: 13, color: "#64748b", lineHeight: 1 }}>
                  ↓
                </div>
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
                      display: "flex",
                      color: "#0f172a",
                      fontSize: 16,
                      fontWeight: 700,
                      marginBottom: 8
                    }}
                  >
                    {`${params.labelHeightMm} mm`}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      color: "#64748b",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    AVANC
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
              display: "flex",
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
              {`Diametre ${params.rollOuterDiameterMm} mm`}
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
              {`Mandril ${params.rollCoreLabel}`}
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
            <div
              style={{
                display: "flex",
                color: "#0f172a",
                fontSize: 26,
                fontWeight: 700,
                marginBottom: 8
              }}
            >
              {`${params.rollOuterDiameterMm} mm`}
            </div>
            <div
              style={{
                display: "flex",
                width: 146,
                height: 146,
                borderRadius: 999,
                border: "2px solid #475569",
                background: "#e2e8f0",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 54,
                  height: 54,
                  borderRadius: 999,
                  border: "2px solid #64748b",
                  background: "#ffffff"
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                color: "#0f172a",
                fontSize: 26,
                fontWeight: 700
              }}
            >
              {params.rollCoreLabel}
            </div>
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
