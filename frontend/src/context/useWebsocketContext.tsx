import { useContext } from "react";
import { WebsocketContext } from "./WebsocketProvider";

export const useWebsocketContext = () => {
  const context = useContext(WebsocketContext);
  return context;
}