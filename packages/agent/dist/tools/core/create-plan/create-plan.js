var planSchema = external_exports.string().describe("A detailed, concrete plan for accomplishing the user's request");
var nameSchema = external_exports.string().describe("A short 3-4 word name for the plan. IMPORTANT: This should only be provided on the FIRST CreatePlan call. On subsequent updates, this field will be ignored to keep the plan file name stable.");
var overviewSchema = external_exports.string().describe("A 1-2 sentence high-level description of the plan that summarizes what will be accomplished");
var todoSchema = external_exports.object({
  id: external_exports.string().describe("Unique identifier for the todo"),
  content: external_exports.string().describe("Description of the todo task")
});
var todosSchema = external_exports.array(todoSchema).describe("Array of implementation todos");
var phaseSchema = external_exports.object({
  name: external_exports.string().describe("Name of the implementation phase"),
  todos: external_exports.array(todoSchema).describe("Todos within this phase")
});
var phasesSchema = external_exports.array(phaseSchema).describe("Implementation phases, each containing related todos");
