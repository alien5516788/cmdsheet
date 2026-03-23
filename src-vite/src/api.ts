import type { SnippetBlock } from "./components/snippetview/snippeteditor";

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

export async function get_snippet(groupName: string, name: string) {
  try {
    return await pywebview.api.get_snippet(groupName, name);
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to fetch snippet\n" + err);
    return { status: false, message: "Failed to fetch snippet" };
  }
}

export async function create_item(itemType: "snippet" | "group", groupName: string, name: string, description: string) {
  // 'groupName' parameter is only used for snippets
  try {
    if (itemType === "snippet") {
      return await pywebview.api.create_snippet(groupName, name, description);
    } else {
      return await pywebview.api.create_group(name, description);
    }
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to create item\n" + err);
    return { status: false, message: "Failed to create item" };
  }
}

export async function update_item(
  itemType: "snippet" | "group",
  groupName: string,
  name: string,
  newName: string | null,
  description: string | null,
  favourite: boolean | null,
  tags: string[] | null
) {
  // 'groupName' parameter is only used for snippets
  // 'tags' and 'favourite' parameters are only used for snippets
  try {
    if (itemType === "snippet") {
      return await pywebview.api.update_snippet(groupName, name, newName, description, favourite, tags);
    } else {
      return await pywebview.api.update_group(name, newName, description);
    }
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to update item\n" + err);
    return { status: false, message: "Failed to update item" };
  }
}

export async function update_snippet_content(groupName: string, name: string, content: SnippetBlock[]) {
  try {
    return await pywebview.api.update_snippet_content(groupName, name, content);
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to update snippet content\n" + err);
    return { status: false, message: "Failed to update snippet content" };
  }
}

export async function delete_item(itemType: "snippet" | "group", groupName: string, name: string) {
  try {
    if (itemType === "snippet") {
      return await pywebview.api.delete_snippet(groupName, name);
    } else {
      return await pywebview.api.delete_group(name);
    }
  } catch (err) {
    await pywebview.api.print_log("Log: Failed to delete item\n" + err);
    return { status: false, message: "Failed to delete item" };
  }
}
