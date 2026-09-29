# Official MCP connection inventory

Documentation reviewed on **2026-09-28**. This is a research inventory for future
Marketplace entries, not an installed catalog or a claim of authenticated GBH
compatibility. No accounts were connected during this review.

## Meaning of official

Use **Service official** only when the service provider's documentation identifies
the server and its exact endpoint. A listing in an official MCP registry, a
verified repository namespace, or a familiar logo is not sufficient by itself.
Keep **Service official**, **Third-party integration**, and **Community** separate
from installation and connection status. A client vendor's built-in connector
does not establish that its credentials or backend can be reused by GBH.

## Provider-hosted endpoints

All addresses below are remote MCP endpoints identified by provider documentation.
Follow the linked provider guide for current account, regional, plan, and admin
restrictions. Authentication support varies; one universal OAuth registration
flow will not cover this inventory.

| Service | Endpoint | Authentication and access | Official evidence |
| --- | --- | --- | --- |
| Google Drive | `https://drivemcp.googleapis.com/mcp/v1` | OAuth 2.0; Workspace Developer Preview enrollment, Cloud project, API enablement, and OAuth client setup. | [Setup](https://developers.google.com/workspace/drive/api/guides/configure-mcp-server) |
| Gmail | `https://gmailmcp.googleapis.com/mcp/v1` | Developer Preview; use the product-specific setup guide linked from Google's index to configure authorization. | [Google endpoint index](https://docs.cloud.google.com/mcp/supported-products) |
| Google Calendar | `https://calendarmcp.googleapis.com/mcp/v1` | Developer Preview; product-specific authorization setup. | [Google endpoint index](https://docs.cloud.google.com/mcp/supported-products) |
| Google Chat | `https://chatmcp.googleapis.com/mcp/v1` | Developer Preview; product-specific authorization setup. | [Google endpoint index](https://docs.cloud.google.com/mcp/supported-products) |
| Google People | `https://people.googleapis.com/mcp/v1` | Developer Preview; product-specific authorization setup. | [Google endpoint index](https://docs.cloud.google.com/mcp/supported-products) |
| Slack | `https://mcp.slack.com/mcp` | Streamable HTTP, confidential OAuth with registered app credentials. Only internal or Marketplace-published apps; no dynamic client registration or legacy SSE transport. | [Slack developer guide](https://docs.slack.dev/ai/slack-mcp-server/) |
| Robinhood Trading | `https://agent.robinhood.com/mcp/trading` | Interactive Robinhood authentication and Agentic account onboarding; desktop required for authentication/onboarding. Exact OAuth metadata and custom-client eligibility require implementation-time verification. | [Robinhood setup](https://robinhood.com/us/en/support/articles/agentic-trading-overview/) |
| GitHub | `https://api.githubcopilot.com/mcp/` | OAuth or personal access token; client and organization policies apply. | [GitHub-maintained server](https://github.com/github/github-mcp-server) |
| Notion | `https://mcp.notion.com/mcp` | Interactive OAuth to the user's workspace. Do not substitute a Notion REST integration token without documented support. | [Notion connection guide](https://developers.notion.com/guides/mcp/get-started-with-mcp) |
| Linear | `https://mcp.linear.app/mcp` | OAuth 2.1 with dynamic registration, or bearer API key/OAuth token. | [Linear guide](https://linear.app/docs/mcp) |
| Atlassian | `https://mcp.atlassian.com/v2/mcp` | OAuth 2.1 or API token subject to organization policy. v2 is recommended; do not use the retired `/v1/sse` address. | [Atlassian-maintained guide](https://atlassian.github.io/atlassian-mcp-server/) |
| Canva | `https://mcp.canva.com/mcp` | Per-user OAuth. Custom applications currently need access approval; see the qualification below. | [Endpoint and setup](https://www.canva.dev/docs/apps/quickstart/), [access requirements](https://www.canva.dev/docs/apps/mcp/access/) |
| Figma | `https://mcp.figma.com/mcp` | OAuth; official setup currently restricts connections to approved clients and directs new client developers to a waitlist. | [Figma remote setup](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) |
| Stripe | `https://mcp.stripe.com` | OAuth or bearer **agent API key**; account and environment permissions apply. | [Stripe guide](https://docs.stripe.com/mcp) |
| Dropbox | `https://mcp.dropbox.com/mcp` | Open beta; OAuth. Dynamic registration is limited to trusted clients; other clients need their own Dropbox app credentials. | [Dropbox setup](https://help.dropbox.com/integrations/connect-dropbox-mcp-server) |
| Box | `https://mcp.box.com` | OAuth with client ID/secret and registered redirect URI; no dynamic client registration. Admin configuration and Business-or-higher plan requirements apply. | [Box setup](https://support.box.com/hc/en-us/articles/43847256139923-Managing-Box-MCP-Servers), [availability](https://support.box.com/hc/en-us/articles/43615620258195-Announcing-the-new-remote-Box-MCP-Server-GA-release) |
| Asana | `https://mcp.asana.com/v2/mcp` | OAuth with a pre-registered MCP app; no dynamic registration. MCP tokens are separate from REST API tokens; refresh handling required. | [Asana integration guide](https://developers.asana.com/docs/integrating-with-asanas-mcp-server) |
| HubSpot | `https://mcp.hubspot.com` | OAuth with PKCE required; create a HubSpot MCP auth app and register the client callback. This is the CRM server, not the local developer server. | [HubSpot integration guide](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server) |

## Common-service shortlist informed by OpenAI apps

OpenAI's [connected-app overview](https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt)
and [workplace connector announcement](https://openai.com/index/more-ways-to-work-with-your-team/)
are useful discovery references. They describe app capabilities, account
connections, and availability that depends on plan, region, and workspace policy.
They do not publish a usage ranking or establish that a ChatGPT connector backend
is independently available to GBH. Here, **common-service shortlist** means our
product selection, not an OpenAI popularity certification.

OpenAI also includes Asana among its
[connected-workflow examples](https://academy.openai.com/public/clubs/k-12-it-and-technical-staff-axv4l/blogs/manage-connected-applications-in-chatgpt-2026-05-29).
Dropbox, Box, Asana, and HubSpot have consequently been added to the endpoint
inventory above, with provider documentation as the evidence for official status.

| Product area | Suggested Marketplace grouping | Research status |
| --- | --- | --- |
| Files and knowledge | Google Drive, Dropbox, Box, Notion | Official endpoint documented; provider authorization still needed. |
| Communications and scheduling | Gmail, Google Calendar, Slack, Outlook Mail, Outlook Calendar, Teams | Google/Slack covered above; Microsoft tenant-based services below require separate integration work. |
| Development and projects | GitHub, Linear, Atlassian, Asana | Official endpoint documented; permissions and write approvals remain service-specific. |
| Design and presentations | Canva, Figma | Official endpoint documented; custom-client admission requirements apply. |
| CRM | HubSpot | Official CRM MCP documented; authenticated read/write capability testing remains pending. |

Useful product patterns to adopt from the OpenAI overview are separate
**Install plugin** and **Connect account** states, administrator-controlled app
availability, and clear disclosure of the actions an app can perform. Public
discovery can supply candidates; it should not silently grant an official badge
or connect an account.

### Microsoft 365 services requiring tenant onboarding

Microsoft provides official **Work IQ MCP** services for these use cases. The
[Work IQ overview](https://learn.microsoft.com/en-us/microsoft-agent-365/tooling-servers-overview)
labels the offering preview, requires a Microsoft 365 Copilot license, and
describes agent onboarding and administrator-granted permissions. Treat these as
**Official · Requires tenant setup · GBH integration unverified**, rather than
ordinary public connectors ready for one-click installation. This does not claim
that ChatGPT uses these same endpoints internally.

The following documented endpoint template uses the server IDs in the table:

```text
https://agent365.svc.cloud.microsoft/agents/tenants/{tenantId}/servers/{serverId}
```

| Service | Server ID | Official reference |
| --- | --- | --- |
| Outlook Mail | `mcp_MailTools` | [Mail tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-mail-tools) |
| Outlook Calendar | `mcp_CalendarTools` | [Calendar tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-calendar-tools) |
| Microsoft Teams | `mcp_TeamsServer` | [Teams tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-teams-tools) |
| SharePoint | `mcp_SharePointRemoteServer` | [SharePoint tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-sharepoint-tools) |
| OneDrive | `mcp_OneDriveRemoteServer` | [OneDrive tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-onedrive-tools) |

These URLs identify official service routes, not a tested GBH authentication
recipe. Verify the intended tenant, licensing, supported client registration,
token audience, and permission grants before creating an installable entry.
Do not infer unrestricted consumer-account access from the OneDrive name, or
substitute the Microsoft Learn documentation MCP for access to user files.

### Provider details affecting implementation

- **Dropbox:** GBH is not established as a trusted dynamic-registration client.
  Use the documented other-client setup or seek provider support; do not borrow
  another product's client identity.
- **Box:** customers configure their own integration credentials and callback in
  the administrator console. Keep plan eligibility and enabled tool permissions
  visible in setup.
- **Asana:** use v2, not the retired beta `/sse` endpoint. Access tokens last one
  hour; a pasted token is not a durable connection. Its MCP app authorization does
  not provide fine-grained per-tool scopes, so retain GBH tool/action controls.
- **HubSpot:** validate PKCE and use the CRM MCP auth-app flow. Installing a local
  HubSpot development assistant does not connect a Bot to CRM records.

All additions in this section are documentation-verified candidates only. None
were installed, authorized, or tested with private account data during research.

## Capability and access qualifications

**Google documents and presentations.** Drive MCP supports finding and reading
files, including Docs, Slides, and Sheets. Its documented tools also include
file creation and copying. This does not establish full structured editing of
slide elements, spreadsheet cells, or document formatting. A presentation Bot
requiring these operations needs a separate capability assessment against the
actual tool schemas. See the [tool list](https://developers.google.com/workspace/drive/api/reference/mcp)
and [read-file formats](https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/read_file_content).
The Google index reviewed here does not list separate Docs, Slides, or Sheets MCP
endpoints. Do not infer their existence from the REST APIs.

**Slack.** Supports search, conversation access, messaging, canvases, files, and
lists. Register a GBH internal app for a private workspace integration, or pursue
publication for broader distribution. The Host must handle the app's OAuth
credentials; a client ID belonging to another AI product is not reusable.

**Robinhood.** The official service supports account information and trading.
Trading is restricted to the dedicated Agentic account, while readable account
information can span other Robinhood accounts. Account eligibility and onboarding
still apply. Android setup must accommodate the documented desktop authentication
step. Catalog inclusion must not automatically enable trading tools or waive
existing action approvals.

**Canva.** Provides design creation/editing and exports, making it relevant to a
presentation Bot. Its access page describes a Developer Portal client-ID/secret
path, but explicitly says self-service enablement is not available yet and directs
applicants to the waitlist. CIMD clients also require redirect-URI approval. Treat
GBH access as pending rather than promising immediate connection. This is the
design MCP, distinct from Canva's developer-documentation MCP.

**Linear and Atlassian.** Linear provides issue/project workflows and a dedicated
read-only endpoint, `https://mcp.linear.app/mcp/readonly`. Atlassian covers Jira,
Confluence, and additional products through v2; verify its tool discovery behavior
when integrating with the retained Host tool loader.

**Stripe.** Use OAuth or agent keys for new integrations. Its current documentation
says full-access secret keys and restricted keys without the Agent tag stop being
accepted on October 31, 2026. Catalog entries should not teach the expiring setup.

## GBH integration status

The current [Marketplace](Marketplace.md#external-catalogs) can import remote MCP
configuration and accept explicit secret header values. Generic local OAuth,
account slots, and per-Bot extension assignment remain unimplemented. Imported
plugins and credentials are Host-wide. No provider in this inventory received an
authenticated end-to-end test as part of this research.

GitHub PAT, Linear API key, and Stripe agent-key connections are candidates for
the existing explicit-header path. This is a configuration fit, not proof that
discovery, tool calls, and account restrictions work in GBH. Google, Slack,
Notion, Canva, Figma, and interactive Robinhood setup require authorization work
and, where applicable, provider access approval before an Android **Connect**
button can reliably complete setup.
The newly listed Dropbox, Box, Asana, and HubSpot services likewise need OAuth
integration; the Microsoft services additionally need tenant onboarding validation.

## Proposed catalog maintenance

These are design requirements for a future official catalog, not implemented
Marketplace behavior:

- Store provider identity, exact endpoint, official evidence URLs, review date,
  authentication mode, access requirements, capability limits, and integration
  test status as separate fields.
- Show **Official · Preview**, **Official · Requires approval**, or **Official ·
  Ready to configure** as appropriate. Display **Connected** only after successful
  authenticated discovery, and tool verification separately.
- Discover candidates from public registries, but require provider-source evidence
  before granting the official label. Endpoint or publisher changes should trigger
  review instead of silently redirecting existing credentials.
- Keep OAuth credentials and refresh-token handling in the Host; bind approved
  accounts and tool permissions explicitly to Bots once that capability exists.
  Preserve existing approvals for external writes and trades.
- Recheck provider documentation before shipping an entry. Record failures and
  eligibility restrictions without downgrading them to misleading generic
  credential errors.

---

[Marketplace](Marketplace.md) · [Documentation](Home.md)
