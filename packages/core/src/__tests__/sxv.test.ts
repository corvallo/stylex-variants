import { describe, expect, expectTypeOf, it } from "vitest";

import { sxv } from "../sxv";
import type { VariantProps } from "../types";

describe("sxv", () => {
  it("infers variants from config", () => {
    const button = sxv({
      variants: {
        variant: {
          primary: {
            backgroundColor: "red",
          },

          outline: {
            backgroundColor: "transparent",
          },
        },

        size: {
          sm: {
            padding: 4,
          },

          md: {
            padding: 8,
          },
        },
      },
    });

    type Props = VariantProps<typeof button>;

    const props: Props = {
      variant: "primary",
      size: "sm",
      className: "custom",
      style: { margin: 4 },
    };
    expectTypeOf(props).toMatchTypeOf<Props>();
  });
  it("accepts typed default variants", () => {
    sxv({
      variants: {
        variant: {
          primary: {
            backgroundColor: "red",
          },

          outline: {
            backgroundColor: "transparent",
          },
        },

        size: {
          sm: {
            padding: 4,
          },

          md: {
            padding: 8,
          },
        },
      },

      defaultVariants: {
        variant: "primary",
        size: "md",
      },
    });
  });
});


it("explains a missing Babel transform when the result is called", () => {
  expect(() => sxv({ base: { color: "red" } })()).toThrow("Configure @stylex-variants/core/babel");
});
