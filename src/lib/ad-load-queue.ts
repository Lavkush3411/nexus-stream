/** Serialize Adsterra unit loads so global atOptions is not overwritten. */
let loadChain = Promise.resolve();

export function scheduleAdUnitLoad(run: () => Promise<void>): void {
  loadChain = loadChain.then(run).catch(() => undefined);
}
