import React from "react";
import { useQRCode } from "next-qrcode";
import { Box, Typography } from "@material-ui/core";

interface Data {
  text: string;
}
export function GenerateQr(data: Data) {
  const { SVG } = useQRCode();

  return (
    <Box>
      <SVG
        text={data.text}
        options={{
          level: "M",
          margin: 3,
          scale: 4,
          width: 200,
        }}
      />
    </Box>
  );
}
