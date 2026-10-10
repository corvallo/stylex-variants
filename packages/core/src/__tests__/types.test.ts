import { describe, expectTypeOf, it } from "vitest";

import type { StyleXCreateStyle, SXVResult, VariantProps, VariantSelection } from "../types";

describe("VariantSelection", () => {
  it("infers variant values", () => {
    type Variants = {
      variant: {
        primary: StyleXCreateStyle;
        outline: StyleXCreateStyle;
      };
      size: {
        sm: StyleXCreateStyle;
        md: StyleXCreateStyle;
      };
    };

    type Props = VariantSelection<Variants>;

    expectTypeOf<Props>().toEqualTypeOf<{
      variant?: "primary" | "outline";
      size?: "sm" | "md";
    }>();
  });
});

describe("VariantProps", () => {
  it("extracts props from an SXV result", () => {
    type Variants = {
      variant: {
        primary: StyleXCreateStyle;
        outline: StyleXCreateStyle;
      };
      size: {
        sm: StyleXCreateStyle;
        md: StyleXCreateStyle;
      };
    };

    type Button = SXVResult<Variants>;

    type Props = VariantProps<Button>;

    const props: Props = {
      variant: "primary",
      size: "sm",
      className: "custom",
      style: { margin: 4 },
    };
    expectTypeOf(props).toMatchTypeOf<Props>();
  });
});

import { sxv } from "../sxv";

it("rejects invalid selections, defaults and compounds", () => {
  if (false) {
    const variants = {
      size: { sm: { fontSize: 12 }, lg: { fontSize: 20 } },
      active: { true: { opacity: 1 }, false: { opacity: 0.5 } },
    };
    const button = sxv({ variants });
    button({ size: "sm", active: false });
    // @ts-expect-error unknown variant value
    button({ size: "medium" });
    // @ts-expect-error unknown variant group
    button({ tone: "primary" });
    // @ts-expect-error boolean variants accept booleans, not strings
    button({ active: "true" });
    // @ts-expect-error invalid default
    sxv({ variants, defaultVariants: { size: "medium" } });
    // @ts-expect-error invalid compound condition
    sxv({ variants, compoundVariants: [{ size: "medium", style: { color: "red" } }] });
    // @ts-expect-error compound styles are required
    sxv({ variants, compoundVariants: [{ size: "sm" }] });
  }
});

it("rejects dynamic styles", () => {
  if (false) {
    // @ts-expect-error dynamic base styles are unsupported
    sxv({ base: (color: string) => ({ color }) });
    // @ts-expect-error dynamic variant styles are unsupported
    sxv({ variants: { tone: { primary: (color: string) => ({ color }) } } });
    // @ts-expect-error dynamic compound styles are unsupported
    sxv({
      variants: { size: { sm: { fontSize: 12 } } },
      compoundVariants: [{ size: "sm", style: (color: string) => ({ color }) }],
    });
  }
});

it("accepts output className and style props", () => {
  if (false) {
    const button = sxv({ variants: { size: { sm: { fontSize: 12 } } } });
    button({ size: "sm", className: "custom", style: { margin: 4 } });
  }
});
