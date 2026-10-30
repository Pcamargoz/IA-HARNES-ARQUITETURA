export * from "./port.js";
export * from "./schemas.js";
export * from "./detect.js";
export { ProcessAdapter, type ProcessSpec } from "./adapters/process-adapter.js";
export { createShellEchoAdapter, SHELL_ECHO_MANIFEST } from "./adapters/shell-echo.js";
export { NoopAdapter, NOOP_MANIFEST } from "./adapters/noop.js";
export * from "./adapters/cli-specs.js";
