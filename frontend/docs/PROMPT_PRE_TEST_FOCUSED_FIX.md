# PROMPT — VN–RU PRE-TEST FOCUSED FIX

Repository:
`dangminhdev0403/vnru-network`

Baseline:
`master` at `5f55656428218785f9b0cb1f2140c86224c317a9`

Read and follow:
`PRE_TEST_FOCUSED_FIX_GUIDE.md`

Goal:
Make the latest integrated Prototype V3 truthful and safe enough for REAL auth/IAM flow testing.

Do not expand product scope.

Mandatory order:

1. Re-check HEAD.
2. Read repository instruction/docs gate.
3. Confirm current runtime services.
4. Produce a short route/capability manifest BEFORE editing.
5. Apply only the focused fixes in the guide.
6. Run lint/build.
7. Report exact remaining blockers.

Highest priority:
- `/workspace` must not be an unrestricted persona showcase.
- capability-gate role navigation.
- route-guard Researcher/Reviewer/Organization surfaces.
- canonical Governance = `/admin`.
- implement canonical `/account` and `/security` using existing auth UI.
- keep legacy IAM redirects.
- remove finance wording from CURRENT UI.
- stop fake backend-success toasts/actions.
- mark non-runtime role pages as UI preview where appropriate.
- do not invent Enterprise/Leadership capabilities.
- do not restore removed business services.

Do not redesign the product during this task.

Do not change dependencies unless unavoidable.

Do not create missing backend business capabilities.

Stop if a required existing auth/account component cannot be found; report the exact missing primitive instead of inventing a parallel implementation.

Final report must include:
- baseline/new SHA;
- files changed;
- route map;
- capability gating map;
- lint/build results;
- finance scan;
- fake-interaction scan;
- remaining blockers;
- `Docs read:` exact paths.
