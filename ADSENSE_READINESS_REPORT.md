# Norlytics AdSense Readiness Report

Audit date: June 14, 2026

## Readiness After Repository Fixes

Estimated readiness: **moderate, pending DNS repair and content expansion**.

The repository now has a substantially safer AdSense-review posture, but the live domain should not be submitted until its DNS records are consolidated and repeated external requests are stable.

## Passed

- `ads.txt` contains the configured Google publisher ID.
- `robots.txt` allows public crawling and excludes dynamic `/channel/` result routes.
- Public pages use clean canonical URLs and reciprocal EN/FR hreflang metadata.
- Legal, privacy, cookie, About, and contact pages are present.
- API keys remain server-side.
- Clean Netlify rewrites and legacy URL redirects remain intact.
- Retained blog articles identify the author and explain the public-data estimation methodology.

## Fixed

- Removed unsupported `500K+ Channels Analyzed` and `98% Estimation Accuracy` claims from EN/FR home and About pages.
- Replaced those claims with honest product facts.
- Removed direct Google Analytics and AdSense script tags from public HTML.
- Google Analytics and AdSense now load through `ConsentManager` only after an explicit `accepted` choice.
- Rejecting consent keeps non-essential Google scripts disabled.
- Updated EN/FR privacy and cookie disclosures to describe the implemented behavior.
- Added founder/contact credibility to EN/FR About pages.
- Temporarily marked thin duplicate articles `noindex, follow`.
- Removed quarantined articles from `sitemap.xml`.
- Removed quarantined articles from homepage and blog discovery surfaces.
- Corrected the contact-form success redirect from the stale `analyzer.norcanto.com` host.
- Added automated AdSense-readiness regression tests.

## Quarantined Articles

These pages remain accessible but should not be submitted or indexed until they are substantially rewritten:

- `/blog/ai-tools-for-youtube-creators`
- `/blog/grow-youtube-channel-fast`
- `/blog/youtube-cpm-countries`
- `/blog/youtube-rpm-by-niche`
- `/blog/youtube-shorts-monetization`
- `/blog/youtube-sponsorship-guide`
- Their corresponding `/fr/blog/...` pages

Each is approximately 335-340 words and shares a near-identical template.

## Remaining Risks

### Critical: DNS inconsistency and intermittent delivery

External DNS resolvers returned different production targets:

- Cloudflare DNS returned Netlify targets `35.157.26.135` and `63.176.8.218`.
- Google DNS and the local resolver returned `54.232.119.62` and a different IPv6 target.

Requests routed through the latter target were extremely slow, incomplete, or failed. Review the authoritative DNS zone and Netlify custom-domain setup. Remove stale/conflicting A and AAAA records, then wait for DNS propagation and verify from multiple regions before applying to AdSense.

### High: Google-certified CMP

The repository now prevents non-essential Google scripts from loading before explicit acceptance. For serious EEA/UK/Swiss AdSense traffic, configure a Google-certified consent management platform and verify Google Consent Mode behavior.

### Medium: Content depth

Several retained articles remain below 1,000 words. They are distinct enough to stay indexed, but should receive original examples, clearer sourcing, and deeper practical analysis over time.

### Medium: Trailing-slash consistency

Some directory-backed Netlify pages resolve to trailing-slash URLs while canonical tags use clean URLs without a trailing slash. The current routing tests show no redirect loop, but live canonical/redirect behavior should be rechecked after DNS repair.

## Manual Testing Checklist

1. Confirm authoritative DNS contains only Netlify-recommended records.
2. Test `http`, `https`, `www`, and apex-domain behavior from multiple networks.
3. Confirm every sitemap URL returns a complete HTTP `200` response consistently.
4. Open a private browser session and confirm no Google Analytics or AdSense request occurs before consent.
5. Select Reject and confirm Google scripts remain absent after navigation.
6. Select Accept and confirm Google scripts load once.
7. Validate the sitemap in Google Search Console.
8. Request indexing only for pages that remain in the sitemap.
9. Validate structured data for retained articles.
10. Install and test a Google-certified CMP before substantial EEA/UK/Swiss ad traffic.
