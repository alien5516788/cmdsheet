export async function get_groups() {
  try {
    return await pywebview.api.get_groups();
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to fetch groups\n" + err);
    return { status: false, message: "Failed to fetch groups" };
  }
}

export async function get_group(name: string) {
  try {
    return await pywebview.api.get_group(name);
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to fetch group\n" + err);
    return { status: false, message: "Failed to fetch group" };
  }
}

export async function get_snippets(groupName: string) {
  try {
    return await pywebview.api.get_snippets(groupName);
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to fetch snippets\n" + err);
    return { status: false, message: "Failed to fetch snippets" };
  }
}

export async function get_snippet(groupName: string, snippetName: string) {
  try {
    return await pywebview.api.get_snippet(groupName, snippetName);
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to fetch snippet\n" + err);
    return { status: false, message: "Failed to fetch snippet" };
  }
}

export async function create_item(itemType: "snippet" | "group", name: string, groupName: string, description: string) {
  try {
    return await pywebview.api.create_item(itemType, name, groupName, description);
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to create item\n" + err);
    return { status: false, message: "Failed to create item" };
  }
}
