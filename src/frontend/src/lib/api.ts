import type {
  AppError,
  Result,
  Result_1,
  Result_2,
  Result_3,
  Result_4,
  Result_5,
  Result_6,
} from "@/backend";

/** Any of the backend's `Result` variants. */
type AnyResult =
  | Result
  | Result_1
  | Result_2
  | Result_3
  | Result_4
  | Result_5
  | Result_6;

/** Human-readable message for a backend `AppError`. */
export function appErrorMessage(error: AppError): string {
  switch (error.__kind__) {
    case "notAuthorized":
      return "You do not have access to this resource.";
    case "notFound":
      return `Not found: ${error.notFound}`;
    case "invalidInput":
      return error.invalidInput;
    case "unsupportedSourceKind":
      return `Unsupported source type: ${error.unsupportedSourceKind}`;
    case "engineUnavailable":
      return `The knowledge engine is unavailable: ${error.engineUnavailable}`;
    case "sourceTooLarge":
      return `That source is too large: ${error.sourceTooLarge}`;
    default:
      return "Something went wrong.";
  }
}

/** Unwrap a backend `Result`, throwing a readable Error on the `err` branch. */
export function unwrapResult<T>(result: AnyResult): T {
  if (result.__kind__ === "ok") {
    return result.ok as T;
  }
  throw new Error(appErrorMessage(result.err));
}

/** Normalize any thrown value into a displayable message. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong.";
}
