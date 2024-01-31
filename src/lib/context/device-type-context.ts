import { getContext, hasContext, setContext } from "svelte";
import { writable, type Readable,  get, readable } from "svelte/store";

enum DeviceTypeBreakpointsMin {
  Tablet = 768,
  Desktop = 1440,
}

export enum DeviceType {
  Mobile = 0,
  Tablet = 1,
  Desktop = 2,
}

const ResolveDeviceType = (
  windowsInnerWidth: number | undefined
): DeviceType | undefined => {
  if (!windowsInnerWidth) {
    return undefined;
  }

  if (windowsInnerWidth < DeviceTypeBreakpointsMin.Tablet) {
    return DeviceType.Mobile;
  }

  if (windowsInnerWidth < DeviceTypeBreakpointsMin.Desktop) {
    return DeviceType.Tablet;
  }

  return DeviceType.Desktop;
};

const DeviceTypeContextKey = "device-type-context";
const store = writable<DeviceType | undefined>(undefined);
const storeReadable = readable<DeviceType | undefined>(get(store), (set) => store.subscribe((x) => set(x)));

export const setDeviceTypeContext = (
  windowsInnerWidth: number | undefined
): Readable<DeviceType | undefined> => {
  const current = ResolveDeviceType(windowsInnerWidth);
  const inStore = get(storeReadable);
  if(inStore !== current) {
    store.set(current);
  }
  if(!hasContext(DeviceTypeContextKey)) {
    setContext(DeviceTypeContextKey, storeReadable);
  }
  return storeReadable;
};

export const getDeviceTypeContext = (): Readable<DeviceType | undefined> =>
  getContext(DeviceTypeContextKey);
