import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, space, type, motion } from "../shared/styles/tokens.stylex";

const docsHome = "https://corvallo.github.io/stylex-variants/";

export function PlaygroundHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header {...stylex.props(s.header)}>
      <nav aria-label="Main navigation" {...stylex.props(s.nav)}>
        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="playground-nav-links"
          onClick={() => setOpen(!open)}
          {...stylex.props(s.toggle)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
        <a href={docsHome} {...stylex.props(s.brand)}>
          <img
            src={`${import.meta.env.BASE_URL}stylex-variants-mark.png`}
            alt=""
            width="32"
            height="32"
            {...stylex.props(s.logo)}
          />
          <span {...stylex.props(s.title)}>StyleX Variants</span>
        </a>
        <div id="playground-nav-links" {...stylex.props(s.links, open && s.open)}>
          <a {...stylex.props(s.link)} href={`${docsHome}docs/intro`}>
            Docs
          </a>
          <a
            {...stylex.props(s.link, s.github)}
            href="https://github.com/corvallo/stylex-variants"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M14 3h7v7M10 14 21 3M21 14v7H3V3h7" />
            </svg>
            <span {...stylex.props(s.srOnly)}> (opens in a new tab)</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

const s = stylex.create({
  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    backgroundColor: colors.navbar,
    backdropFilter: "blur(12px)",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.navbarBorder,
    fontFamily: type.navbar,
    fontSize: type.navSize,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    minHeight: 60,
    boxSizing: "border-box",
    paddingBlock: space.xs,
    paddingInline: space.md,
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xs,
    marginRight: space.md,
    color: colors.navbarText,
    textDecoration: "none",
    whiteSpace: "nowrap",
    outline: { default: "none", ":focus-visible": motion.focus },
    outlineOffset: 3,
  },
  logo: { display: "block", objectFit: "contain", flexShrink: 0 },
  title: { fontWeight: type.navWeight, letterSpacing: "-0.02em" },
  links: {
    display: { default: "flex", "@media (max-width: 996px)": "none" },
    alignItems: "center",
    flexGrow: 1,
    gap: space.sm,
    flexBasis: { default: "auto", "@media (max-width: 996px)": "100%" },
    flexDirection: { default: "row", "@media (max-width: 996px)": "column" },
  },
  open: { display: "flex" },
  link: {
    display: "flex",
    alignItems: "center",
    gap: space.xxs,
    color: { default: colors.navbarText, ":hover": colors.navbarHover },
    textDecoration: "none",
    fontWeight: type.medium,
    paddingBlock: space.xs,
    paddingInline: space.sm,
    outline: { default: "none", ":focus-visible": motion.focus },
    outlineOffset: 2,
    alignSelf: { default: "auto", "@media (max-width: 996px)": "stretch" },
  },
  github: { marginLeft: { default: "auto", "@media (max-width: 996px)": 0 } },
  toggle: {
    display: { default: "none", "@media (max-width: 996px)": "inline-flex" },
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    padding: 0,
    marginRight: space.xs,
    borderWidth: 0,
    backgroundColor: colors.transparent,
    color: colors.navbarText,
    cursor: "pointer",
    outline: { default: "none", ":focus-visible": motion.focus },
    outlineOffset: 2,
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
});
