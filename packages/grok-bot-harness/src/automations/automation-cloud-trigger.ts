/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/automation-cloud-trigger.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function microsoftTeamsCloudTrigger(trigger2) {
  return new Trigger({
    trigger: {
      case: "microsoftTeamsTrigger",
      value: new MicrosoftTeamsTrigger({
        tenantId: trigger2.tenantId,
        teamIds: [...trigger2.teamIds],
        channelIds: [...trigger2.channelIds],
        messageContains: trigger2.messageContains,
        messageContainsIsRegex: trigger2.messageContainsIsRegex,
        blockUnauthenticatedTeamsUsers: trigger2.blockUnauthenticatedTeamsUsers
      })
    }
  });
}
function linearCloudTrigger(trigger2) {
  let event;
  switch (trigger2.event.case) {
    case "issueCreated":
      event = {
        case: "issueCreated",
        value: new LinearIssueCreatedEvent()
      };
      break;
    case "statusChanged":
      event = {
        case: "statusChanged",
        value: new LinearStatusChangedEvent({
          statusIds: [...trigger2.event.statusIds]
        })
      };
      break;
    case "endOfCycle":
      event = {
        case: "endOfCycle",
        value: new LinearEndOfCycleEvent({
          cycleIds: [...trigger2.event.cycleIds]
        })
      };
      break;
  }
  return new Trigger({
    trigger: {
      case: "linear",
      value: new LinearTrigger({
        event,
        projectIds: [...trigger2.projectIds],
        teamIds: [...trigger2.teamIds]
      })
    }
  });
}
function sentryCloudTrigger(trigger2) {
  let event;
  switch (trigger2.event.case) {
    case "issueCreated":
      event = { case: "issueCreated", value: new SentryIssueCreatedEvent() };
      break;
    case "issueResolved":
      event = { case: "issueResolved", value: new SentryIssueResolvedEvent() };
      break;
    case "issueAssigned":
      event = { case: "issueAssigned", value: new SentryIssueAssignedEvent() };
      break;
    case "issueArchived":
      event = { case: "issueArchived", value: new SentryIssueArchivedEvent() };
      break;
    case "issueUnresolved":
      event = {
        case: "issueUnresolved",
        value: new SentryIssueUnresolvedEvent()
      };
      break;
    case "issueAny":
      event = { case: "issueAny", value: new SentryIssueAnyEvent() };
      break;
  }
  return new Trigger({
    trigger: {
      case: "sentry",
      value: new SentryTrigger({
        event,
        projectIds: [...trigger2.projectIds]
      })
    }
  });
}
function pagerDutyCloudTrigger(trigger2) {
  let event;
  switch (trigger2.event.case) {
    case "incidentTriggered":
      event = {
        case: "incidentTriggered",
        value: new PagerDutyIncidentTriggeredEvent()
      };
      break;
    case "incidentAcknowledged":
      event = {
        case: "incidentAcknowledged",
        value: new PagerDutyIncidentAcknowledgedEvent()
      };
      break;
    case "incidentResolved":
      event = {
        case: "incidentResolved",
        value: new PagerDutyIncidentResolvedEvent()
      };
      break;
    case "incidentEscalated":
      event = {
        case: "incidentEscalated",
        value: new PagerDutyIncidentEscalatedEvent()
      };
      break;
    case "incidentAny":
      event = {
        case: "incidentAny",
        value: new PagerDutyIncidentAnyEvent()
      };
      break;
  }
  return new Trigger({
    trigger: {
      case: "pagerduty",
      value: new PagerDutyTrigger({
        event,
        serviceIds: [...trigger2.serviceIds]
      })
    }
  });
}
function emailCloudTrigger(trigger2) {
  return new Trigger({
    trigger: {
      case: "emailReceived",
      value: new EmailReceivedTrigger({
        inboxEmail: trigger2.inbox,
        fromAddresses: [...trigger2.from ?? []],
        requireAuthPass: emailTriggerRequiresAuthPass(trigger2)
      })
    }
  });
}
function backendCloudTrigger(trigger2) {
  switch (trigger2.type) {
    case "microsoftTeams":
      return microsoftTeamsCloudTrigger(trigger2);
    case "linear":
      return linearCloudTrigger(trigger2);
    case "sentry":
      return sentryCloudTrigger(trigger2);
    case "pagerduty":
      return pagerDutyCloudTrigger(trigger2);
    case "email":
      return emailCloudTrigger(trigger2);
    case "webhook":
      return new Trigger({
        trigger: { case: "webhook", value: new WebhookTrigger({}) }
      });
  }
}

