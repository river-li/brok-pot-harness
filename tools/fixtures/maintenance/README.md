# Maintenance API fixtures

`github-compare-response.json` contains the fields used by readiness from an actual GitHub REST compare response for:

```text
GET /repos/river-li/brok-pot-harness/compare/ac21ea469d1799ccbc736018a18ea7e30eb24a54...5ca45b4bc57afeb9db7bdf4c5bce7160eca6bdfe
```

The response was `status: diverged`, with three commits ahead and three behind. The fixture keeps the compare endpoint's real top-level field names and omits its large commit payloads. In particular, the response has no `head_commit`; readiness obtains and checks the requested head SHA with a separate commit lookup.
