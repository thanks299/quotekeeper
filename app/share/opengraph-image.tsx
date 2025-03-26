import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "Quote from QuoteApp"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  try {
    // Font
    const interBold = await fetch(new URL("/app/fonts/Inter-Bold.ttf", import.meta.url)).then((res) =>
      res.arrayBuffer(),
    )

    const interRegular = await fetch(new URL("/app/fonts/Inter-Regular.ttf", import.meta.url)).then((res) =>
      res.arrayBuffer(),
    )

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          padding: "40px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontFamily: "Inter",
              fontWeight: "bold",
              color: "#7c3aed",
              marginBottom: "20px",
            }}
          >
            QuoteApp
          </div>
          <div
            style={{
              fontSize: "24px",
              fontFamily: "Inter",
              color: "#64748b",
            }}
          >
            View this inspirational quote
          </div>
        </div>
      </div>,
      {
        ...size,
        fonts: [
          {
            name: "Inter",
            data: interBold,
            style: "normal",
            weight: 700,
          },
          {
            name: "Inter",
            data: interRegular,
            style: "normal",
            weight: 400,
          },
        ],
      },
    )
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}

