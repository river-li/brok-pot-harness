# box-lifecycle maintenance

The box-lifecycle Host extension and its lifecycle-bound services. Read extension.ts for dependencies and registration.

Follow the repository AGENTS.md. Preserve emitted identifiers and recovered-fragment markers.
These files are reconstructed in bundle scope; do not invent standalone imports
or replace newer upstream behavior with older code. Keep vendor paths intact
and apply local adaptations conditionally. Build from the repository root and
run the tests appropriate to the changed component.
