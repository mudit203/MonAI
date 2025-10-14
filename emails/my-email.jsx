import { Button, Html } from "@react-email/components";
import * as React from "react";

export default function Email({
  username="",
  type="budget-alert"
  data:{}
}) {
  return (
    <Html>
      <div
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
       Hey your Balance has exceeded above 80
      </div>
    </Html>
  );
}