import { getServiceIdentifierAsString, interfaces } from "inversify";
import Context = interfaces.Context;

export const extractServiceName = (context: Context) => {
  const { parentRequest } = context.currentRequest;

  if (!parentRequest) {
    return "Root";
  }

  const identifierString = getServiceIdentifierAsString(
    parentRequest.serviceIdentifier
  );

  const symbolMatch = identifierString.match(/Symbol\((.+)\)/);

  if (symbolMatch) {
    const [, symbolDescription] = symbolMatch;
    return symbolDescription;
  }

  return identifierString;
};
