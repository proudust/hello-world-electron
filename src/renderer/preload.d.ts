import { main } from "../main/preload";

declare global {
  interface Window {
    main: typeof main;
  }
}
