export function get_error_message(err: unknown): string {
  if (err instanceof Error) return err.message;

  if (typeof err === "string") return err;

  if (typeof err === "object" && err !== null && "message" in err) {
    return String(err.message);
  }

  return "Unknown error occurred";
}
