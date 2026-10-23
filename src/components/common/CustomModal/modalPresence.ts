// iOS presents a full-screen ad over the top modal, and dismissing that modal then closes the ad and
// leaves the empty modal blocking touches, so an ad waits until open modals are gone
const openModals = new Set<string>();
let waiters: Array<() => void> = [];

export const markModalOpen = (id: string) => {
  openModals.add(id);
};

export const markModalClosed = (id: string) => {
  openModals.delete(id);
  if (openModals.size === 0) {
    const pending = waiters;
    waiters = [];
    pending.forEach((resolve) => resolve());
  }
};

// Gives up after the timeout so a modal that never reports its dismissal cannot hold the flow
export const waitForModalsToClose = (timeoutMs = 2000) =>
  new Promise<void>((resolve) => {
    if (openModals.size === 0) {
      resolve();
      return;
    }
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      waiters = waiters.filter((waiter) => waiter !== done);
      resolve();
    }, timeoutMs);
    waiters.push(done);
  });
