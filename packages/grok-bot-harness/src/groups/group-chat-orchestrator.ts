/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/groups/group-chat-orchestrator.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GroupChatOrchestrator = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  async run(args) {
    const members = await this.deps.resolveMembers(args.memberIds);
    if (members.length === 0) return;
    const memberById = new Map(members.map((member) => [member.id, member]));
    let totalMessages = 0;
    for (let round = 0; round < GROUP_MAX_ROUNDS; round++) {
      if (!this.deps.isCurrent()) return;
      const responderIds = round === 0 && args.isAttachmentOnlyTurn === true ? members.map((member) => member.id) : resolveResponders(members, this.deps.readHistory()).map((member) => member.id);
      let messagesThisRound = 0;
      for (const memberId of orderRoundSpeakers(responderIds, round)) {
        if (totalMessages >= GROUP_MAX_MEMBER_TURNS) return;
        if (!this.deps.isCurrent()) return;
        const member = memberById.get(memberId);
        if (member == null) continue;
        const isWindingDown = round === GROUP_MAX_ROUNDS - 1 || GROUP_MAX_MEMBER_TURNS - totalMessages <= GROUP_WIND_DOWN_REMAINING_BUDGET;
        const sent = await this.runOneTurn(
          args.group,
          member,
          members,
          isWindingDown,
          args.isAttachmentOnlyTurn === true
        );
        let hitCap = false;
        for (const content of sent) {
          this.deps.postMemberMessage(member, content);
          totalMessages++;
          messagesThisRound++;
          if (totalMessages >= GROUP_MAX_MEMBER_TURNS) {
            hitCap = true;
            break;
          }
        }
        this.deps.finalizeMemberTurn?.(member);
        if (hitCap) return;
      }
      if (members.length === 1 || messagesThisRound === 0) return;
    }
  }
  async runOneTurn(group, member, members, isWindingDown, isAttachmentOnlyTurn) {
    const peers = members.filter((other) => other.id !== member.id);
    const newMessages = messagesSinceMemberLastSpoke(this.deps.readHistory(), member.id);
    const sent = await this.deps.runMemberTurn({
      member,
      prompt: buildGroupTurnPrompt({
        member,
        group,
        peers,
        newMessages,
        isWindingDown,
        isAttachmentOnlyTurn
      }),
      isWindingDown
    });
    const spoken = [];
    for (const content of sent) {
      const delivered = stripLeadingPass(content);
      if (delivered.length === 0) continue;
      spoken.push(delivered);
      if (spoken.length >= GROUP_MAX_MESSAGES_PER_TURN) break;
    }
    return spoken;
  }
};

