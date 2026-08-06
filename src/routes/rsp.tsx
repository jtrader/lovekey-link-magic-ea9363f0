import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteBreadcrumbs, SitePager } from "@/components/SiteNavUi";
import lovekeyMark from "@/assets/lovekey-mark.png";
import whitepaperAsset from "@/assets/rsp-whitepaper.pdf.asset.json";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/rsp")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Love Key Link / RSP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RspLayout,
});

const helpNetwork = [
  {
    title: "First Aid Angel",
    tag: "PREPARE",
    body: "Quick first aid guidance and support",
    href: "https://firstaidangel.org/",
  },
  {
    title: "Crisis Compass",
    tag: "RESPOND",
    body: "Emergency guidance for active crises",
    href: "https://crisis-compass.org/",
  },
  {
    title: "Aid Angel",
    tag: "RECOVER",
    body: "Recovery support after disaster",
    href: "https://aidangel.app/",
  },
  {
    title: "Guardian Guide",
    tag: "HEAL",
    body: "Mental health and emotional support",
    href: "https://guardianguide.org/",
  },
  {
    title: "Love Key",
    tag: "COORDINATE",
    body: "Connect with the Help Network",
    href: "https://lovekeyring.org/",
  },
  {
    title: "Love Key Ring",
    tag: "REACH",
    body: "A gentle way to reach help",
    href: "https://lovekey.com.au/?locale=AU#product-section",
  },
];

// ─── Styles ────────────────────────────────────────────────────────────────




// ─── Layout shell ────────────────────────────────────────────────────────────




function RspLayout() {
  return (
    <div className="rsp-root">
      <SiteHeader />

      <SiteBreadcrumbs />
      <SitePager variant="header" />

      <Outlet />

      <SitePager variant="footer" />

      {/* FOOTER */}
      <footer className="rsp-footer">
        <div className="rsp-help">
          <h2 className="rsp-help-title">Love Key Help Network</h2>
          <div className="rsp-help-grid">
            {helpNetwork.map((tile) => (
              <a
                key={tile.title}
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("help_network_tile_click", {
                    tile: tile.title,
                    tag: tile.tag,
                    location: "rsp_footer",
                  })
                }
                className="rsp-help-tile"
              >
                <div className="rsp-help-head">
                  <span className="rsp-help-name">{tile.title}</span>
                  <span className="rsp-help-tag">{tile.tag}</span>
                </div>
                <p className="rsp-help-body">{tile.body}</p>
              </a>
            ))}
          </div>
        </div>
        <div className="rsp-footer-inner">
          <img
            src={lovekeyMark}
            alt="Love Key Link"
            style={{ width: 96, height: 96, objectFit: "contain" }}
          />
          <div className="rsp-footer-left">
            <strong>Love Key Link / RSP</strong> · Respectful Synchronised Protocol v1.6 · Part of
            the{" "}
            <a
              href="https://lovekeyring.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--rsp-primary)" }}
            >
              Love Key Help Network
            </a>{" "}
            · Copyright © 2026 Jack Oswald. All rights reserved unless otherwise licensed in
            writing.
          </div>
          <div className="rsp-footer-right">
            RSP NFTs are utility, provenance, access, participation, and certification tokens. Not
            investment products.
          </div>
        </div>
      </footer>
    </div>
  );
}
